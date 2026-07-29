import express from "express";
import { authMe, updateMe } from "../controllers/userController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { changePassword } from "../controllers/userController.js";
import { getMyActivities } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protectedRoute, authMe);
router.put("/me", protectedRoute, updateMe);
router.post("/me/password", protectedRoute, changePassword);
router.get("/me/activities", protectedRoute, getMyActivities);

export default router;
