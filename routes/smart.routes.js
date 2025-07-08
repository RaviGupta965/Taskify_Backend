import express from "express";
import { smartAssignTask } from "../controllers/Assign.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, smartAssignTask);

export default router;