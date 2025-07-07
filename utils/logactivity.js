export const logActivity = async ({ action, userId, taskId, projectId, details }) => {
  try {
    await Activity.create({
      action,
      user: userId,
      task: taskId,
      projectId,
      details
    });
  } catch (err) {
    console.error("❌ Failed to log activity:", err.message);
  }
};