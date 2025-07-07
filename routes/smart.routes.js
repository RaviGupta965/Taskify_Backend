import { smartAssign } from "../controllers/task.controller.js";

router.post("/:taskId/smart-assign", authMiddleware, smartAssign);