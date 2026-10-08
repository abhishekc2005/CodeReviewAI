import { Request, Response } from 'express';
import { generateContent, fixContent } from "../services/ai.service";
import AIUsage from "../models/AIUsage";

const SUPPORTED_LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "c",
  "cpp",
  "csharp",
  "go",
  "rust",
  "php",
  "ruby",
  "kotlin",
  "swift",
  "sql",
  "html",
  "css",
  "dart",
  "bash"
];

export const getReview = async (req: Request, res: Response) => {
  try {
    const code = req?.body?.code?.trim();
    const language = req?.body?.language?.trim()?.toLowerCase();

    if (!code) {
      return res.status(400).json({
        success: false,
        error: "Code is required"
      });
    }

    if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
      return res.status(400).json({
        success: false,
        error: "Unsupported programming language"
      });
    }

    // ─── AI Daily Rate Limit ───────────────────────────
    const AI_DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT) || 10;
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Atomically find or create today's usage document
    const usage = await AIUsage.findOneAndUpdate(
      { userId: req.userId, date: today },
      { $setOnInsert: { userId: req.userId, date: today, count: 0 } },
      { upsert: true, new: true }
    );

    if (usage.count >= AI_DAILY_LIMIT) {
      return res.status(429).json({
        success: false,
        error: "Daily AI review limit reached. Please try again tomorrow."
      });
    }

    // ─── Existing AI Review Logic ──────────────────────

    console.log("📥 AI Review request received");
    console.log("🧠 Code length:", code.length);
    console.log("🗣️ Language:", language);

    const review = await generateContent(code, language);

    // Increment usage count AFTER successful AI response
    await AIUsage.findOneAndUpdate(
      { userId: req.userId, date: today },
      { $inc: { count: 1 } }
    );

    return res.status(200).json({
      success: true,
      review
    });

  } catch (error: unknown) {
    const err = error as { status?: number; code?: string; message?: string };
    console.error(
      "🔥 Groq Error:",
      err?.status,
      err?.code,
      err?.message
    );

    if (err?.status === 401) {
      return res.status(401).json({
        success: false,
        error: "Groq API key is invalid or missing."
      });
    }

    if (err?.status === 404) {
      return res.status(502).json({
        success: false,
        error: "Groq model is unavailable."
      });
    }

    if (err?.status === 429) {
      return res.status(429).json({
        success: false,
        error: "Groq rate limit reached. Please try again shortly."
      });
    }

    if (
      err?.status === 500 ||
      err?.status === 502 ||
      err?.status === 503
    ) {
      return res.status(503).json({
        success: false,
        error: "Groq service is temporarily unavailable."
      });
    }

    return res.status(500).json({
      success: false,
      error: "Unexpected server error."
    });
  }
};

export const fixCode = async (req: Request, res: Response) => {
  try {
    const code = req?.body?.code?.trim();
    const language = req?.body?.language?.trim()?.toLowerCase();
    const reviewContext = req?.body?.reviewContext?.trim();

    if (!code) {
      return res.status(400).json({ success: false, error: "Code is required" });
    }

    if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
      return res.status(400).json({ success: false, error: "Unsupported programming language" });
    }

    // ─── AI Daily Rate Limit (using same limit as review) ──────
    const AI_DAILY_LIMIT = Number(process.env.AI_DAILY_LIMIT) || 10;
    const today = new Date().toISOString().slice(0, 10);

    const usage = await AIUsage.findOneAndUpdate(
      { userId: req.userId, date: today },
      { $setOnInsert: { userId: req.userId, date: today, count: 0 } },
      { upsert: true, new: true }
    );

    if (usage.count >= AI_DAILY_LIMIT) {
      return res.status(429).json({
        success: false,
        error: "Daily AI review limit reached. Please try again tomorrow."
      });
    }

    console.log("📥 AI Fix Code request received");
    const fixedCode = await fixContent(code, language, reviewContext);

    // Increment usage count AFTER successful AI response
    await AIUsage.findOneAndUpdate(
      { userId: req.userId, date: today },
      { $inc: { count: 1 } }
    );

    return res.status(200).json({
      success: true,
      fixedCode
    });

  } catch (error: unknown) {
    const err = error as { status?: number; code?: string; message?: string };
    console.error("🔥 Groq Error (Fix):", err?.status, err?.code, err?.message);

    if (err?.status === 401) return res.status(401).json({ success: false, error: "Groq API key is invalid or missing." });
    if (err?.status === 404) return res.status(502).json({ success: false, error: "Groq model is unavailable." });
    if (err?.status === 429) return res.status(429).json({ success: false, error: "Groq rate limit reached. Please try again shortly." });
    if (err?.status && err.status >= 500) return res.status(503).json({ success: false, error: "Groq service is temporarily unavailable." });
    
    return res.status(500).json({ success: false, error: "Unexpected server error." });
  }
};