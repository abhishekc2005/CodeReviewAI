require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_KEY,
});

async function generateContent(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    systemInstruction:` You are a Staff-Level Software Engineer performing a production-grade code review.

Think step-by-step internally before answering, but present only structured final output.

Focus on:
- Code correctness
- Edge cases
- Error handling
- Performance complexity (Big-O if relevant)
- Security vulnerabilities
- Clean architecture principles
- SOLID principles
- Scalability concerns
- Maintainability

Avoid generic advice.

If the code contains architectural issues, suggest redesign patterns.

If applicable:
- Suggest design patterns
- Suggest refactoring strategies
- Suggest test cases
- Suggest monitoring/logging improvements

Output must be structured and concise.` ,

contents: [
  {
    role: "user",
    parts: [{ text: prompt }]
  }
],
  });

  return response.text;
}

module.exports = generateContent;