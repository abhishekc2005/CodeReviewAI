const aiService = require("../services/ai.service");

module.exports.getReview = async (req, res) => {
  try {
    const code = req?.body?.code?.trim();

    if (!code) {
      return res.status(400).json({
        success: false,
        error: "Code is required"
      });
    }

    console.log("📥 AI Review request received");
    console.log("🧠 Code length:", code.length);

    const review = await aiService(code);

    return res.status(200).json({
      success: true,
      review
    });

  } catch (error) {
    console.error(
      "🔥 Groq Error:",
      error?.status,
      error?.code,
      error?.message
    );

    if (error?.status === 401) {
      return res.status(401).json({
        success: false,
        error: "Groq API key is invalid or missing."
      });
    }

    if (error?.status === 404) {
      return res.status(502).json({
        success: false,
        error: "Groq model is unavailable."
      });
    }

    if (error?.status === 429) {
      return res.status(429).json({
        success: false,
        error: "Groq rate limit reached. Please try again shortly."
      });
    }

    if (
      error?.status === 500 ||
      error?.status === 502 ||
      error?.status === 503
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