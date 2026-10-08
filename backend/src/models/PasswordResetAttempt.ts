import mongoose from "mongoose";

interface IPasswordResetAttempt {
  email: string;
  attempts: number;
  windowStart: Date;
}

const passwordResetAttemptSchema = new mongoose.Schema<IPasswordResetAttempt>({
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

const PasswordResetAttempt = mongoose.model<IPasswordResetAttempt>(
  "PasswordResetAttempt",
  passwordResetAttemptSchema
);

export default PasswordResetAttempt;
