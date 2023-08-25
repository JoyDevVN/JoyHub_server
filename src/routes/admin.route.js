import express from 'express';
import adminController from '../controllers/admin.controller';
import authController from '../controllers/auth.controller';

const router = express.Router();
router.put('/active/:id', authController.verify, adminController.verifyAdmin, adminController.activeModerator);
router.get('/moderators', authController.verify, adminController.verifyAdmin, adminController.getModerators);
router.get('/moderators/inactive', authController.verify, adminController.verifyAdmin, adminController.getUnacceptedModerators);
router.delete('/moderators/:id', authController.verify, adminController.verifyAdmin, adminController.removeModerator);


router.put('/rooms/active/:id', authController.verify, adminController.verifyAdmin, adminController.activeRoom);
router.delete('/rooms/:id', authController.verify, adminController.verifyAdmin, adminController.removeRoom);
router.get('/rooms', authController.verify, adminController.verifyAdmin, adminController.getRooms);
// get details of a room
router.get('/rooms/:id', authController.verify, adminController.verifyAdmin, adminController.getRoomInfo);
// get all rooms that are not accepted of a moderator
router.get('/rooms/pending/:id', authController.verify, adminController.verifyAdmin, adminController.getUnacceptedRooms);


router.get('/report', authController.verify, adminController.verifyAdmin, adminController.getReportList);
router.get('/report/:id', authController.verify, adminController.verifyAdmin, adminController.getReportOfHotel);
router.put('/report/:id', authController.verify, adminController.verifyAdmin, adminController.updateReadingStatus);
export default router;
