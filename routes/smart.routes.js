import express from "express";
import { smartAssign } from "../controllers/Assign.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/:taskId/smart-assign", authMiddleware, smartAssign);

export default router;