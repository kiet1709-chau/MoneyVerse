import Setting from "../models/Setting.js";
import Notification from "../models/Notification.js";

export const createTransaction = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { amount, type, category } = req.body;

    // 1. Lưu giao dịch
    const newTransaction = await Transaction.create({
      userId,
      amount,
      type,
      category,
    });

    // 2. Thực tế kiểm tra nút "Cảnh báo giao dịch"
    const userSetting = await Setting.findOne({ userId });
    if (userSetting?.notifications?.transactionAlerts) {
      await Notification.create({
        userId,
        title: "Giao dịch mới",
        message: `Bạn vừa ghi nhận giao dịch ${type === "expense" ? "chi tiêu" : "thu nhập"} ${amount.toLocaleString()}đ.`,
        type: "transaction",
      });
    }

    res.status(201).json({ success: true, data: newTransaction });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
