import express from "express";
import { register, login } from "../controllers/auth.controller.js";

const router = express.Router();

// Register a new user
router.post("/register", register);

// Login user and return JWT token
router.post("/login", login);

export default router;