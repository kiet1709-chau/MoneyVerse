import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      enum: ["success", "info", "warning"],
      default: "info",
    },
  },
  { timestamps: true },
);

export default mongoose.model("ActivityLog", activityLogSchema);
