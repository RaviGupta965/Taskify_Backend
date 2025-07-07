import express from "express";
import { smartAssign } from "../controllers/Assign.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:taskId/smart-assign", authenticate, smartAssign);

export default router;