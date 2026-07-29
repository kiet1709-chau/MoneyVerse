import express from "express";
import {
  getSettings,
  updateSettings,
} from "../controllers/settingController.js";

const router = express.Router();

router.get("/settings", getSettings);
router.put("/settings", updateSettings);

export default router;
