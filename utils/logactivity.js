import Activity from '../models/activity.schema'

const logActivity = async ({ action, userId, taskId, projectId, details }) => {
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
export default logActivity;