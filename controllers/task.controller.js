import Task from "../models/task.schema.js";
import connectDB from "../utils/DB_connect.js";
import logActivity from '../utils/logactivity.js'
export const createTask = async (req, res) => {
  try {
    await connectDB();
    const { title, description, status, priority, assignedTo, projectId } =
      req.body;
    // Ensure required fields
    if (!title || !projectId || !status) {
      return res
        .status(400)
        .json({ error: "Title, status, and projectId are required" });
    }

    // Title must be unique within a project and not same as column name
    const existing = await Task.findOne({ title, projectId });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Title must be unique and not match column names" });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      assignedTo,
      projectId,
    });
    await logActivity({
      action: "created",
      userId: req.user.id,
      taskId: task._id,
      projectId: task.projectId,
      details: `Created task "${task.title}" in ${task.status}`,
    });
    await mongoose.disconnect();
    req.io.to(projectId).emit("taskCreated", task);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get tasks by project
export const getProjectTasks = async (req, res) => {
  try {
    await connectDB();
    const { projectId } = req.params;
    const tasks = await Task.find({ projectId }).populate(
      "assignedTo",
      "username"
    );
    res.status(200).json(tasks);
    await mongoose.disconnect();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    await connectDB();
    const { taskId } = req.params;
    const clientUpdate = req.body;

    const currentTask = await Task.findById(taskId);
    if (!currentTask) return res.status(404).json({ error: "Task not found" });
    // Conflict detection
    if (clientUpdate.version !== currentTask.version) {
      return res.status(409).json({
        conflict: true,
        message: "Version conflict. The task has been modified by someone else.",
        serverVersion: currentTask,
        clientVersion: clientUpdate
      });
    }

    // Prepare updated fields
    const updates = {
      ...clientUpdate,
      updatedAt: Date.now(),
      version: currentTask.version + 1
    };
    const updated = await Task.findByIdAndUpdate(taskId, updates, { new: true });

    await logActivity({
      action: "updated",
      userId: req.user.id,
      taskId: updated._id,
      projectId: updated.projectId,
      details: `Updated task "${updated.title}" in ${updated.status}`,
    });
    req.io.to(updated.projectId.toString()).emit("taskUpdated", updated);
    await mongoose.disconnect();
    res.status(200).json({ conflict: false, task: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    await connectDB();
    const { taskId } = req.params;
    await Task.findByIdAndDelete(taskId);
    await logActivity({
      action: "deleted",
      userId: req.user.id,
      taskId: task._id,
      projectId: task.projectId,
      details: `Deleted task "${task.title}" from ${task.status}`,
    });
    req.io.to(task.projectId.toString()).emit("taskDeleted", taskId);
    await mongoose.disconnect();
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
