import express from "express";
import {
  getGoals,
  createGoal,
  updateGoalAmount,
  deleteGoal,
} from "../controllers/savingGoalController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js"; // Thay bằng tên middleware xác thực của bạn

const router = express.Router();

// Áp dụng bảo mật xác thực cho tất cả các route bên dưới
router.use(protectedRoute);

router.route("/").get(getGoals).post(createGoal);

router.route("/:id").put(updateGoalAmount).delete(deleteGoal);

export default router;
