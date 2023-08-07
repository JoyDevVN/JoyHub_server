import express from 'express';
import adminController from '../controllers/admin.controller';
import authController from '../controllers/auth.controller';

const router = express.Router();
router.post('/active', authController.verify, adminController.verifyAdmin, adminController.activeModerator);
export default router;
