import User from "../models/User.js";

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
      { new: true, runValidators: true },
    ).select("-hashedPassword");

    if (!updatedUser) {
      return res.status(404).json({ message: "User không tồn tại." });
    }

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Lỗi khi gọi updateMe:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
