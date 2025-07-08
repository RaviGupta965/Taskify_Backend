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
    origin: "http://localhost:5173", // your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
    console.log(`User joined project room: ${projectId}`);
  });

  socket.on("leaveProject", (projectId) => {
    socket.leave(projectId);
    console.log(`User left project room: ${projectId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.set("io", io); // Store io instance globally
app.use(injectSocket);
app.use(cors());
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

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a project room
  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
    console.log(`🛠️ Socket ${socket.id} joined project ${projectId}`);
  });

  // Emit changes to all users in the same project
  socket.on("taskUpdated", ({ projectId, task }) => {
    socket.to(projectId).emit("taskUpdated", task);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`server is listening at PORT: ${process.env.PORT}`);
});
