import connectDB from "../utils/DB_connect.js";
import mongoose from "mongoose";
import Activity from "../models/activity.schema.js";
export const getRecentActivity = async (req, res) => {
  try {
    await connectDB()
    const { projectId } = req.params;
    const logs = await Activity.find({ projectId })
      .sort({ timestamp: -1 })
      .limit(20)
      .populate("user", "username")
      .populate("task", "title");
    res.status(200).json(logs);
    mongoose.disconnect();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};