import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fontSize: {
      type: String,
      enum: ["small", "normal", "large"],
      default: "normal",
    },
    language: {
      type: String,
      enum: ["vi", "en", "ja", "zh"],
      default: "vi",
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      transactionAlerts: { type: Boolean, default: true },
      billReminders: { type: Boolean, default: true },
      promotions: { type: Boolean, default: false },
      dailyEntryReminder: { type: Boolean, default: false },
    },
    pushSubscription: {
      type: Object,
      default: null,
    },
  },
  { timestamps: true },
);

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;
