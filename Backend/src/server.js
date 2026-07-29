import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import userRoute from "./routes/userRoute.js";
import settingRoutes from "./routes/settingRoutes.js";
import { initNotificationCrons } from "./services/notificationCron.js"; // 1. Thêm import này
import savingGoalRoutes from "./routes/savingGoalRoutes.js"; // Import routes cho Saving Goals

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173";

// Middleware
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Áp dụng route cho Saving Goals
app.use("/api/saving-goals", savingGoalRoutes);

// Public routes
app.use("/api/auth", authRoute);

// Private routes (Áp dụng middleware bảo mật chung cho tất cả route /api/users)
app.use("/api/users", protectedRoute);
app.use("/api/users", userRoute);
app.use("/api/users", settingRoutes); // 2. Sửa lại thành /api/users để khớp với /settings bên trong router

// Connect DB & Start Server
connectDB()
  .then(() => {
    initNotificationCrons(); // 3. Thêm hàm khởi tạo Cron Job
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Lỗi kết nối CSDL:", err.message);
  });
