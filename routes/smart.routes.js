import { smartAssign } from "../controllers/Assign.controller.js";

router.post("/:taskId/smart-assign", authMiddleware, smartAssign);