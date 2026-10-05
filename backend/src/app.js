const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const aiRoutes = require("./routes/ai.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

// ─── CORS Configuration ─────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ─── Middlewares ─────────────────────────────────────────
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

// ─── Health Check ────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("🚀 CodeReviewAI Backend Running");
});

// ─── Routes ──────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/ai", aiRoutes);

// ─── Global Error Handler ────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message || "Internal server error",
  });
});

module.exports = app;
