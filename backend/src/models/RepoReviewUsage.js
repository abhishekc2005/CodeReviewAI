const mongoose = require("mongoose");

const repoReviewUsageSchema = new mongoose.Schema({
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
repoReviewUsageSchema.index({ userId: 1, date: 1 }, { unique: true });

const RepoReviewUsage = mongoose.model("RepoReviewUsage", repoReviewUsageSchema);

module.exports = RepoReviewUsage;
