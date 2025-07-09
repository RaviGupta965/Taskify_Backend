import connectDB from "../utils/DB_connect.js";
import mongoose from "mongoose";
import Activity from "../models/activity.schema.js";

export const getRecentActivity = async (req, res) => {
  try {
    await connectDB();
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    const logs = await Activity.find({ projectId })
      .sort({ timestamp: -1 })
      .limit(20)
      .populate("user", "username")
      .populate("task", "title");

    res.status(200).json(logs);
  } catch (err) {
    console.error("Error in getRecentActivity:", err);
    res.status(500).json({ error: err.message });
  }
};