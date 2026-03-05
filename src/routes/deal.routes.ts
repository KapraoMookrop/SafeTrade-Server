import { Router } from "express";
import * as dealController from "../controllers/deal.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/getMessages", authenticateToken, dealController.GetMessages);
router.post("/createChatRoom", authenticateToken, dealController.CreateChatRoom);
router.post("/sendMessages", authenticateToken, dealController.SendMessages);
router.post("/markAsRead", authenticateToken, dealController.MarkAsRead);
router.post("/getAllUnread", authenticateToken, dealController.GetAllUnread);
router.post("/createDeal", authenticateToken, dealController.CreateDeal);

export default router;