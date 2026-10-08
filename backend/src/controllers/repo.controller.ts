import { Request, Response } from 'express';
import Groq from "groq-sdk";
import RepoReviewUsage from "../models/RepoReviewUsage";
import {
  parseGitHubUrl,
  validateGitHubUrl,
  fetchRepoData,
  filterAndPrioritizeFiles,
  fetchFileContents,
  buildRepoContext,
  RepoError
} from "../services/repo.service";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const reviewRepo = async (req: Request, res: Response) => {
  try {
    const repoUrl = req?.body?.repoUrl?.trim();

    // ─── Validate URL ────────────────────────────────────
    console.log("[REPO] URL validation started");

    if (!repoUrl || !validateGitHubUrl(repoUrl)) {
      console.log("[REPO] URL validation failed: invalid URL");
      return res.status(400).json({
        success: false,
        message: "Please enter a valid public GitHub repository URL (https://github.com/owner/repo)."
      });
    }

    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      console.log("[REPO] URL validation failed: could not parse");
      return res.status(400).json({
        success: false,
        message: "Please enter a valid public GitHub repository URL (https://github.com/owner/repo)."
      });
    }

    const { owner, repo } = parsed;
    console.log(`[REPO] URL validation successful: ${owner}/${repo}`);

    // ─── Rate Limit ──────────────────────────────────────
    const REPO_DAILY_LIMIT = Number(process.env.REPO_REVIEW_DAILY_LIMIT) || 2;
    const today = new Date().toISOString().slice(0, 10);

    const usage = await RepoReviewUsage.findOneAndUpdate(
      { userId: req.userId, date: today },
      { $setOnInsert: { userId: req.userId, date: today, count: 0 } },
      { upsert: true, new: true }
    );

    if (usage.count >= REPO_DAILY_LIMIT) {
      console.log("[REPO] Daily repository review limit reached for user");
      return res.status(429).json({
        success: false,
        message: "Daily GitHub repository review limit reached. Please try again tomorrow."
      });
    }

    // ─── Fetch Repository Data ───────────────────────────
    console.log(`[REPO] Fetching repository metadata for: ${owner}/${repo}`);

    let repoData;
    try {
      repoData = await fetchRepoData(owner, repo);
    } catch (err: unknown) {
      // RepoError carries the correct HTTP status
      if (err instanceof RepoError) {
        console.error(`[REPO] GitHub error at metadata/tree stage: HTTP ${err.status} — ${err.message}`);
        return res.status(err.status).json({
          success: false,
          message: err.message
        });
      }
      // Network/unexpected errors
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      console.error(`[REPO] Unexpected error fetching repo data: ${errMsg}`);
      return res.status(500).json({
        success: false,
        message: "Unable to access this repository. Please try again later."
      });
    }

    const { meta, tree, defaultBranch } = repoData;
    console.log(`[REPO] Repository metadata received — ${meta.full_name}`);

    // ─── Filter & Prioritize Files ───────────────────────
    console.log(`[REPO] Total tree items: ${tree.length}`);
    const prioritizedFiles = filterAndPrioritizeFiles(tree);
    console.log(`[REPO] Files to analyze: ${prioritizedFiles.length}`);

    // ─── Fetch File Contents ─────────────────────────────
    const { contents, totalBytes, limitReached } = await fetchFileContents(
      owner, repo, defaultBranch, prioritizedFiles
    );
    console.log(`[REPO] Fetched ${Object.keys(contents).length} files (${(totalBytes / 1024).toFixed(1)} KB)`);

    if (Object.keys(contents).length === 0) {
      console.warn("[REPO] No file contents could be fetched — possibly rate-limited or empty repo");
      return res.status(422).json({
        success: false,
        message: "Could not fetch any files from this repository. The repository may be empty or GitHub rate limits may apply."
      });
    }

    // ─── Build Context ───────────────────────────────────
    const context = buildRepoContext(meta, tree, contents, limitReached);

    // ─── Build AI Prompt ─────────────────────────────────
    const prompt = `You are performing a comprehensive code review of a public GitHub repository.

Repository: ${context.name}
Description: ${context.description}
Primary Language: ${context.language}
Stars: ${context.stars} | Forks: ${context.forks}
Topics: ${context.topics}
Total Files: ${context.totalFiles} | Analyzed Files: ${context.analyzedFiles}
${context.limitReached ? "\nNote: Analysis was limited to the most relevant repository files due to size constraints.\n" : ""}

Detected Technology Stack:
${context.techStack || "Could not confidently determine from available files."}

Project Structure:
${context.structure}

===== FILE CONTENTS =====

${context.fileContents}

===== END FILE CONTENTS =====

Provide a structured repository review report with the following sections. Use markdown formatting.

# Repository Overview
Summarize the repository name, owner, and description.

# What This Project Does
Explain the main purpose based on evidence from the code. If unsure, say "Could not confidently determine from available files."

# Technology Stack
List detected: Languages, Frameworks, Databases, Tools, Other.

# Project Structure
Describe the directory layout and organization.

# Architecture
Explain how major components interact.

# Code Quality
AI-assisted assessment. Review correctness, readability, maintainability. Cite specific files when possible.

# Security Review
Identify potential security concerns. Label as "potential issues" unless evidence is conclusive. Never include actual secrets in the report.

# Performance Review
Identify performance concerns and optimization opportunities.

# Good Practices
Note positive patterns found in the codebase.

# Potential Issues
List critical or important issues found.

# Recommendations
Provide actionable improvement suggestions.

# Overall Assessment
Provide a score out of 10 for: Code Quality, Architecture, Security, Performance, Maintainability, Testing.
Provide an Overall score. Label it clearly as "AI-assisted assessment".

# Files Analyzed
List the analyzed files (paths only).

${context.limitReached ? "# Analysis Limitations\nNote that this analysis was limited to the most relevant files due to repository size." : ""}

Keep the report concise, evidence-based, and actionable.`;

    // ─── Single Groq AI Request ──────────────────────────
    console.log("[REPO] Sending ONE request to Groq");

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: "You are a senior software engineer performing a comprehensive repository code review. Provide structured, evidence-based analysis. Be professional, concise, and actionable."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2
    });

    const review = response?.choices?.[0]?.message?.content?.trim();

    if (!review) {
      throw new Error("EMPTY_AI_RESPONSE");
    }

    console.log("[REPO] Groq response received");

    // ─── Increment usage AFTER success ───────────────────
    await RepoReviewUsage.findOneAndUpdate(
      { userId: req.userId, date: today },
      { $inc: { count: 1 } }
    );

    console.log("[REPO] Repository review completed");

    return res.status(200).json({
      success: true,
      review,
      meta: {
        name: meta.full_name,
        description: meta.description,
        language: meta.language,
        stars: meta.stargazers_count,
        analyzedFiles: Object.keys(contents).length,
        totalFiles: tree.filter((i: { type: string }) => i.type === "blob").length,
        limitReached
      }
    });

  } catch (error: unknown) {
    const err = error as { status?: number; code?: string; message?: string };
    console.error("[REPO] Error:", err?.status, err?.code, err?.message);

    // Groq SDK errors
    if (err?.status === 400 || err?.status === 413) {
      return res.status(400).json({
        success: false,
        message: "The repository is too large or complex for the AI to process in a single request. We have truncated it, but it still exceeded limits."
      });
    }

    if (err?.status === 401) {
      return res.status(500).json({
        success: false,
        message: "AI service configuration error."
      });
    }

    if (err?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "AI service rate limit reached. Please try again shortly."
      });
    }

    if (err?.status === 500 || err?.status === 502 || err?.status === 503) {
      return res.status(503).json({
        success: false,
        message: "AI service is temporarily unavailable."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unexpected server error during repository analysis."
    });
  }
};
