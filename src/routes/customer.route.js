import customerController from "../controllers/customer.controller";
import express from 'express';
import { verify } from "../controllers/auth.controller";

const router = express.Router();

router.get('/', (req, res) => {
    console.log('Welcome to Customer API');
    res.send('Welcome to Customer API');
});

router.get('/hotel', customerController.getHotelList);
router.get('/hotel/:id', customerController.getHotelInfo);
router.get('/room/:id', customerController.getRoomInfo);
router.get('/room_amenity/:id', customerController.getRoomAmenity);
router.get('/getPreBill/:room_id/:account_id', customerController.getPreBill);
router.get('/getReservation/:account_id', customerController.getReservation);
router.get('/notification_list', verify, customerController.getNotificationList);

export default router;
