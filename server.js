import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/projects.routes.js";
import taskRoutes from "./routes/task.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import smartRoutes from "./routes/smart.routes.js";
import { injectSocket } from "./middlewares/socket.middleware.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://taskify-frontend-sooty.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
    console.log(`${socket.id} joined room: ${projectId}`);
  });

  socket.on("leaveProject", (projectId) => {
    socket.leave(projectId);
    console.log(` ${socket.id} left room: ${projectId}`);
  });

  socket.on("task-change", (projectId) => {
    socket.to(projectId).emit("task-updated");
    console.log(`Emitting 'task-updated' to room: ${projectId}`);
  });

  socket.on("disconnect", () => {
    console.log(" Disconnected:", socket.id);
  });
});

app.set("io", io); // Store io instance globally
app.use(injectSocket);
app.use(
  cors({
    origin: "https://taskify-frontend-sooty.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/smart", smartRoutes);

server.listen(process.env.PORT, () => {
  console.log(`server is listening at PORT: ${process.env.PORT}`);
});
