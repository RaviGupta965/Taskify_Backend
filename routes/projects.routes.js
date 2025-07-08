import express from "express";
import { createProject, inviteMember, getUserProjects,getBoardMembers } from "../controllers/project.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, createProject);    // Create new project
router.post("/:projectId/invite", authenticate, inviteMember);// Invite user to project
router.get("/", authenticate, getUserProjects); 
router.get("/:id",authenticate,getBoardMembers);

export default router;