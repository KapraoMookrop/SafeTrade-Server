import { Router } from "express";
import * as chatController from "../controllers/chat.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/GetMessages", authenticateToken, chatController.GetMessages);
router.post("/SendMessages", authenticateToken, chatController.SendMessages);
router.post("/MarkAsRead", authenticateToken, chatController.MarkAsRead);
router.get("/GetAllChatRooms", authenticateToken, chatController.GetAllChatRooms);

export default router;