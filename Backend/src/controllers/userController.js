import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js"; // 🟢 Import ActivityLog
import bcrypt from "bcrypt";

export const authMe = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Lỗi khi gọi authMe:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateMe = async (req, res) => {
  try {
    const allowedFields = [
      "displayName",
      "email",
      "phone",
      "address",
      "dob",
      "gender",
      "balance",
    ];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật." });
    }

    if (updates.email) {
      const duplicate = await User.findOne({
        email: updates.email,
        _id: { $ne: req.user._id },
      });

      if (duplicate) {
        return res.status(409).json({ message: "Email đã được sử dụng." });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { returnDocument: "after", runValidators: true },
    ).select("-hashedPassword");

    if (!updatedUser) {
      return res.status(404).json({ message: "User không tồn tại." });
    }

    // 🟢 GHI LOG CẬP NHẬT THÔNG TIN
    await ActivityLog.create({
      userId: req.user._id,
      title: "Cập nhật thông tin cá nhân",
      badge: "info",
    });

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Lỗi khi gọi updateMe:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự." });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Mật khẩu hiện tại không chính xác." });
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.hashedPassword,
    );
    if (isSamePassword) {
      return res.status(400).json({
        message: "Mật khẩu mới không được trùng với mật khẩu hiện tại.",
      });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.hashedPassword = newHashedPassword;
    await user.save();

    // 🟢 GHI LOG ĐỔI MẬT KHẨU VÀO DATABASE
    await ActivityLog.create({
      userId: req.user._id,
      title: "Đổi mật khẩu thành công",
      badge: "info",
    });

    return res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};

// 🟢 HÀM MỚI: LẤY DANH SÁCH HOẠT ĐỘNG
export const getMyActivities = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ userId: req.user._id })
      .sort({ createdAt: -1 }) // Hoạt động mới nhất lên đầu
      .limit(10);

    return res.status(200).json(logs);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách hoạt động:", error);
    return res.status(500).json({ message: "Lỗi hệ thống." });
  }
};
