import express from "express";
import { smartAssign } from "../controllers/Assign.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:taskId/smart-assign", authMiddleware, smartAssign);

export default router;