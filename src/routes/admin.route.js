import express from 'express';
import adminController from '../controllers/admin.controller';
import authController from '../controllers/auth.controller';

const router = express.Router();
router.put('/active/:id', authController.verify, adminController.verifyAdmin, adminController.activeModerator);
router.get('/moderators', authController.verify, adminController.verifyAdmin, adminController.getModerators);
router.get('/moderators/inactive', authController.verify, adminController.verifyAdmin, adminController.getUnacceptedModerators);
router.delete('/moderators/:id', authController.verify, adminController.verifyAdmin, adminController.removeModerator);


router.get('/rooms', authController.verify, adminController.verifyAdmin, adminController.getRooms);
router.get('/rooms/inactive/:id', authController.verify, adminController.verifyAdmin, adminController.getUnacceptedRooms);
export default router;
