export const getRecentActivity = async (req, res) => {
  try {
    const { projectId } = req.params;

    const logs = await Activity.find({ projectId })
      .sort({ timestamp: -1 })
      .limit(20)
      .populate("user", "username")
      .populate("task", "title");

    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};