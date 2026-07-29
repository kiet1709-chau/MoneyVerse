import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, "Số tiền không được âm"],
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      required: true,
      default: "Tiết kiệm",
    },
    icon: {
      type: String,
      default: "🐷",
    },
    relatedGoalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SavingGoal",
      default: null,
    },
  },
  { timestamps: true },
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
