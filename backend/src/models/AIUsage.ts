import mongoose from "mongoose";

interface IAIUsage {
  userId: mongoose.Types.ObjectId;
  date: string;
  count: number;
}

const aiUsageSchema = new mongoose.Schema<IAIUsage>({
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

const AIUsage = mongoose.model<IAIUsage>("AIUsage", aiUsageSchema);

export default AIUsage;
