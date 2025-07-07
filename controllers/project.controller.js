import Project from "../models/project.schema.js";
import User from "../models/user.schema.js";
import connectDB from "../utils/DB_connect.js";
export const createProject = async (req, res) => {

  try {
    await connectDB()
    const { name } = req.body;
    const userId = req.user.id;

    const project = await Project.create({
      name,
      owner: userId,
      members: [userId]
    });

    await User.findByIdAndUpdate(userId, {
      $push: { joinedProjects: project._id }
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const inviteMember = async (req, res) => {
  try {
    await connectDB()
    const { projectId } = req.params;
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    if (project.members.includes(user._id)) {
      return res.status(400).json({ error: "User already in project" });
    }

    project.members.push(user._id);
    await project.save();

    user.joinedProjects.push(project._id);
    await user.save();

    res.status(200).json({ message: "User added to project" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserProjects = async (req, res) => {
  try {
    await connectDB()
    const userId = req.user.id;
    const projects = await Project.find({ members: userId }).populate("members", "username email");
    res.status(200).json(projects);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
