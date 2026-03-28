import { Router } from "express";
import * as dealController from "../controllers/deal.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/CreateChatRoom", authenticateToken, dealController.CreateChatRoom);
router.post("/CreateDeal", authenticateToken, dealController.CreateDeal);
router.post("/AcceptInvite", authenticateToken, dealController.AcceptInvite);
router.post("/RejectInvite", authenticateToken, dealController.RejectInvite);

export default router;