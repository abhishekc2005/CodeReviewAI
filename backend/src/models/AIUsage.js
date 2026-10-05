const mongoose = require("mongoose");

const aiUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String, // YYYY-MM-DD format for daily tracking
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

// Unique compound index: one document per user per day
aiUsageSchema.index({ userId: 1, date: 1 }, { unique: true });

const AIUsage = mongoose.model("AIUsage", aiUsageSchema);

module.exports = AIUsage;
