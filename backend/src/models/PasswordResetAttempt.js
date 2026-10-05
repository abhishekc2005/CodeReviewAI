const mongoose = require("mongoose");

const passwordResetAttemptSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  attempts: {
    type: Number,
    default: 1,
  },
  windowStart: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient lookups and potential TTL cleanup
passwordResetAttemptSchema.index({ email: 1 });

const PasswordResetAttempt = mongoose.model(
  "PasswordResetAttempt",
  passwordResetAttemptSchema
);

module.exports = PasswordResetAttempt;
