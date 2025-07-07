import express from "express";
import { getRecentActivity } from "../controllers/activity.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:projectId", authMiddleware, getRecentActivity);

export default router;