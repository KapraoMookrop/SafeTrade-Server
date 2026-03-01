import { Router } from "express";
import * as dealController from "../controllers/deal.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/getMessages", authenticateToken, dealController.GetMessages);

export default router;