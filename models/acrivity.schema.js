const activitySchema = new mongoose.Schema({
  action: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },  // ✅ Add this
  timestamp: { type: Date, default: Date.now },
  details: String
});