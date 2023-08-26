import customerController from "../controllers/customer.controller";
import express from 'express';
import { verify } from "../controllers/auth.controller";

const router = express.Router();

router.get('/', (req, res) => {
    console.log('Welcome to Customer API');
    res.send('Welcome to Customer API');
});

router.get('/hotel', customerController.getHotelList);
router.post('/hotel/:id', customerController.getHotelInfo);
router.get('/room/:id', customerController.getRoomInfo);
router.get('/room_amenity/:id', customerController.getRoomAmenity);
router.get('/getPreBill/:room_id', verify, customerController.getPreBill);
router.get('/getReservation', verify, customerController.getReservation);
router.get('/notification_list', verify, customerController.getNotificationList);

//req.body  { booking_id, star, comment}
router.post('/rating', verify, customerController.rating);

//req.body  { booking_id, content}
router.post('/report', verify, customerController.report);

//req.body  { email, phone, full_name}
router.put('/profile', verify, customerController.updateInfo)

//req.body  { hotel_id, room_id}
router.put('/cancelRoom', verify, customerController.cancelRoom)

//req.body  { hotel_id, room_id}
router.get('/getUserInfo', verify, customerController.getUserInfo)


export default router;
