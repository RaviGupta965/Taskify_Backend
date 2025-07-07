import express from "express";
import { createProject, inviteMember, getUserProjects } from "../controllers/project.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, createProject);    // Create new project
router.post("/:projectId/invite", authenticate, inviteMember);// Invite user to project
router.get("/", authenticate, getUserProjects); // Get all projects of current user

export default router;