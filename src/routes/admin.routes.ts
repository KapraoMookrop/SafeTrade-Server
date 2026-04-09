import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware.js';
import * as adminController from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/FindSeller', authenticateToken, requireAdmin, adminController.getSellerVerification);
router.get('/GetSellerIdCard/:sellerId', authenticateToken, requireAdmin, adminController.getIdCardImage);
router.get('/GetSellerSelfie/:sellerId', authenticateToken, requireAdmin, adminController.getSelfieImage);

export default router;