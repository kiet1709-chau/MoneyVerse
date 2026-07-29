import express from "express";
import { signUp } from "../controllers/authController.js";
import { logIn } from "../controllers/authController.js";
import { signOut } from "../controllers/authController.js";
import { forgotPassword } from "../controllers/authController.js";
import { resetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUp);

router.post(["/login", "/lognin"], logIn);

router.post("/signout", signOut);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);
export default router;
