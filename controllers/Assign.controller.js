import mongoose from "mongoose";
import Task from "../models/task.schema.js";
import Project from "../models/project.schema.js";
import connectDB from "../utils/DB_connect.js";
import logActivity from "../utils/logactivity.js";
export const smartAssignTask = async (req, res) => {
  try {
    await connectDB();
    const { title, description, priority, status, projectId } = req.body;

    // Find all members of the project
    const project = await Project.findById(projectId).populate(
      "members",
      "_id username"
    );
    if (!project) return res.status(404).json({ error: "Project not found" });

    // Count current tasks for each member
    const taskCounts = await Promise.all(
      project.members.map(async (member) => {
        const count = await Task.countDocuments({ assignedTo: member._id });
        return { userId: member._id, count };
      })
    );

    // Find member with least tasks
    const leastBusy = taskCounts.reduce((a, b) => (a.count < b.count ? a : b));

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      projectId,
      assignedTo: leastBusy.userId,
    });

    await logActivity({
      action: "smart-assigned",
      userId: req.user.id,
      taskId: task._id,
      projectId: task.projectId,
      details: `Smart assigned task "${task.title}" to user with ID ${leastBusy.userId}`,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
