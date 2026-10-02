const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function generateContent(prompt) {
  try {
    console.log("🚀 Sending request to Groq...");

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

      temperature: 0.2,

      // Do not return reasoning content
      include_reasoning: false
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

  } catch (error) {
    console.error("🔥 GROQ ERROR");
    console.error("Status:", error?.status);
    console.error("Code:", error?.code);
    console.error("Message:", error?.message);

    throw error;
  }
}

module.exports = generateContent;