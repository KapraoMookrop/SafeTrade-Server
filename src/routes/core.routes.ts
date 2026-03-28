import { Router } from "express";
import * as coreController from "../controllers/core.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/GetProvinces", coreController.GetProvinces);
router.get("/GetDistricts", coreController.GetDistricts);
router.get("/GetSubDistricts", coreController.GetSubDistricts);
router.get("/VerifyEmail", coreController.VerifyEmail);
router.post("/Enable2FA", authenticateToken, coreController.Enable2FA);
router.post("/Disable2FA", authenticateToken, coreController.Disable2FA);
router.post("/Verify2FA", coreController.Verify2FA);
router.post("/SendForgotPasswordEmail", coreController.SendForgotPasswordEmail);
router.post("/ChangePassword", coreController.ChangePassword);
router.post("/SendMailDeleteAccount", coreController.SendMailDeleteAccount);
router.post("/DeleteAccount", coreController.DeleteAccount);
router.post("/FindUsers", authenticateToken, coreController.FindUsers);
router.get("/GetNotifications", authenticateToken, coreController.GetNotifications);
router.post("/MarkAllNotificationsAsRead", authenticateToken, coreController.MarkAllNotificationsAsRead);

export default router;