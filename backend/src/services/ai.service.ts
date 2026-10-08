import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function generateContent(code: string, language: string): Promise<string> {
  try {
    console.log("🚀 Sending request to Groq...");

    const prompt = `Programming Language:\n${language}\n\nCode:\n${code}\n\nReview this code as a senior software engineer.\n\nAnalyze:\n1. Correctness\n2. Bugs\n3. Edge cases\n4. Performance\n5. Security\n6. Maintainability\n7. Readability\n8. Language-specific best practices\n\nProvide concise and actionable feedback.`;

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",

      messages: [
        {
          role: "system",
          content:
            "You are a senior software engineer performing a professional code review. Analyze bugs, correctness, edge cases, performance, security, code quality, maintainability and best practices. Give concise, actionable and structured feedback."
        },
        {
          role: "user",
          content: prompt
        }
      ],

      temperature: 0.2
    });

    console.log("✅ Groq response received");

    const message = response?.choices?.[0]?.message;

    console.log("📦 Message received:", message);

    const review = message?.content?.trim();

    if (!review) {
      throw new Error("EMPTY_AI_RESPONSE");
    }

    console.log("✅ AI review generated successfully");

    return review;

  } catch (error: unknown) {
    const err = error as { status?: number; code?: string; message?: string };
    console.error("🔥 GROQ ERROR");
    console.error("Status:", err?.status);
    console.error("Code:", err?.code);
    console.error("Message:", err?.message);

    throw error;
  }
}
async function fixContent(code: string, language: string, reviewContext?: string): Promise<string> {
  try {
    console.log("🚀 Sending fix request to Groq...");

    // The AI must return ONLY the code, no markdown fences, no explanations.
    let prompt = `Programming Language:\n${language}\n\nCode to fix:\n${code}\n\n`;
    if (reviewContext) {
      prompt += `Previous Review Context:\n${reviewContext}\n\n`;
    }
    prompt += `Fix the actual bugs and issues in the code above. Improve correctness, security, and performance where appropriate. Preserve the intended functionality, behavior, and programming language. Do NOT rewrite unnecessarily. 

CRITICAL: Return ONLY the raw corrected code. Do NOT wrap the code in markdown fences (like \`\`\`javascript). Do NOT include any explanations, greetings, or text other than the code itself.`;

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: "You are an expert code fixer. You strictly follow instructions and return ONLY raw code without any markdown formatting or explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1 // Lower temperature for more deterministic fixes
    });

    console.log("✅ Groq fix response received");
    const message = response?.choices?.[0]?.message;
    let fixedCode = message?.content?.trim();

    if (!fixedCode) {
      throw new Error("EMPTY_AI_RESPONSE");
    }

    // Strip markdown fences just in case the AI ignores the prompt
    if (fixedCode.startsWith('```')) {
      const lines = fixedCode.split('\n');
      if (lines[0].startsWith('```')) lines.shift();
      if (lines[lines.length - 1].startsWith('```')) lines.pop();
      fixedCode = lines.join('\n').trim();
    }

    console.log("✅ AI fix generated successfully");
    return fixedCode;

  } catch (error: unknown) {
    const err = error as { status?: number; code?: string; message?: string };
    console.error("🔥 GROQ ERROR (Fix):");
    console.error("Status:", err?.status);
    console.error("Code:", err?.code);
    console.error("Message:", err?.message);
    throw error;
  }
}

export { generateContent, fixContent };