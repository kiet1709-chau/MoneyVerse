import cron from "node-cron";
import webPush from "web-push";
import Setting from "../models/Setting.js";
import Notification from "../models/Notification.js";
import dotenv from "dotenv";

dotenv.config();

webPush.setVapidDetails(
  process.env.VAPID_MAILTO || "mailto:kietchaunguyen17@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

// Hàm hỗ trợ gửi Push Notification đến trình duyệt
const sendWebPush = async (pushSubscription, title, body) => {
  if (!pushSubscription) return;
  try {
    const payload = JSON.stringify({ title, body, icon: "/favicon.ico" });
    await webPush.sendNotification(pushSubscription, payload);
  } catch (error) {
    console.error("Lỗi gửi Web Push:", error.message);
  }
};

export const initNotificationCrons = () => {
  // 🟢 1. Xử lý "Nhắc nhở nhập liệu hằng ngày" vào đúng 22:00 mỗi đêm
  cron.schedule("0 22 * * *", async () => {
    console.log("⏰ Đang kiểm tra nhắc nhở nhập liệu 22:00...");

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Lấy những user BẬT tính năng nhắc nhở hằng ngày
    const activeSettings = await Setting.find({
      "notifications.dailyEntryReminder": true,
    });

    for (const setting of activeSettings) {
      // Kiểm tra xem hôm nay user đã ghi chép giao dịch nào chưa
      const hasEntryToday = await Transaction.exists({
        userId: setting.userId,
        createdAt: { $gte: startOfDay },
      });

      // Nếu CHƯA ghi chép thì tạo thông báo
      if (!hasEntryToday) {
        const title = "📝 Đừng quên ghi chép thu chi!";
        const message =
          "Đã 22:00 rồi, hãy dành 1 phút cập nhật các khoản thu chi hôm nay nhé.";

        await Notification.create({
          userId: setting.userId,
          title,
          message,
          type: "daily_reminder",
        });

        // Gửi Web Push nếu user có đăng ký trình duyệt
        await sendWebPush(setting.pushSubscription, title, message);
      }
    }
  });
};
