import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    avatarUrl: {
      type: String, // Lưu CDN để hiển thị hình ảnh
    },
    avatarId: {
      type: String, // Cloudinary ID để xóa hình ảnh khi người dùng thay đổi avatar
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      sparse: true,
    },
    address: {
      type: String,
      default: "",
    },
    dob: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "Khác",
    },
    balance: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true },
);
const User = mongoose.model("User", userSchema);
export default User;
