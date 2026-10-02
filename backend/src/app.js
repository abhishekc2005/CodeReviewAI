const express = require("express");
const cors = require("cors");

const aiRoutes = require("./routes/ai.routes");

const app = express();

// middlewares
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// health route
app.get("/", (req, res) => {
  res.send("🚀 CodeReviewAI Backend Running");
});

// AI routes
app.use("/ai", aiRoutes);

// global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    error: "Internal server error"
  });
});

module.exports = app;
