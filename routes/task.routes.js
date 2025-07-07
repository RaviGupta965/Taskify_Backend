import express from "express";
import { createTask, getProjectTasks, updateTask, deleteTask } from "../controllers/task.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, createTask);
router.get("/project/:projectId", authenticate, getProjectTasks);
router.patch("/:taskId", authenticate, updateTask);
router.delete("/:taskId", authenticate, deleteTask);

export default router;