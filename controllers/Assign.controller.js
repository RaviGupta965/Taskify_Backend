import User from "../models/user.schema.js";

export const smartAssign = async (req, res) => {
  try {
    await connectDB();
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const { projectId } = task;

    // Step 1: Get project members
    const project = await Project.findById(projectId).populate("members");
    if (!project) return res.status(404).json({ error: "Project not found" });

    const members = project.members;

    if (!members.length) return res.status(400).json({ error: "No members in this project" });

    // Step 2: Count active tasks for each member
    const memberTasks = await Promise.all(
      members.map(async (member) => {
        const count = await Task.countDocuments({
          assignedTo: member._id,
          projectId,
          status: { $ne: "Done" }
        });
        return { user: member, count };
      })
    );

    // Step 3: Find member with least active tasks
    const leastBusy = memberTasks.sort((a, b) => a.count - b.count)[0];

    // Step 4: Assign task
    task.assignedTo = leastBusy.user._id;
    await task.save();

    await logActivity({
      action: "smart-assigned",
      userId: req.user.id,
      taskId: task._id,
      projectId: task.projectId,
      details: `Smart assigned to ${leastBusy.user.username}`
    });

    res.status(200).json({ message: `Task assigned to ${leastBusy.user.username}`, task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};