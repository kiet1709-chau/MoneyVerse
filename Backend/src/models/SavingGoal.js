import mongoose from "mongoose";

const savingGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Tên mục tiêu không được để trống"],
      trim: true,
    },
    target: {
      type: Number,
      required: [true, "Số tiền mục tiêu không được để trống"],
      min: [0, "Mục tiêu phải lớn hơn 0"],
    },
    current: {
      type: Number,
      default: 0,
      min: [0, "Số tiền hiện tại không được âm"],
    },
    icon: {
      type: String,
      default: "🎯",
    },
    color: {
      type: String,
      default: "bg-sky-600",
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
  },
);

const SavingGoal = mongoose.model("SavingGoal", savingGoalSchema);
export default SavingGoal;
