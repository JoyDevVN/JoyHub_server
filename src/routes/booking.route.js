import bookingController from "../controllers/booking.controller";
import express from 'express';
import { verify } from "../controllers/auth.controller";

const router = express.Router();

/// /booking/room
/// req.body: {}
// Get list of booking for a hotel
/// req.body: { hotel_id}
router.get('/room', verify, bookingController.getBookingList);
/// req.body: { booking_id, hotel_id, room_id, account_id, start_date, end_date}
router.post('/room', verify, bookingController.bookRoom);
/// req.body: { booking_id, hotel_id, room_id, account_id, start_date, end_date}
router.put('/room', verify, bookingController.updateBookingInfo);
/// req.body: { booking_id, hotel_id, room_id, account_id}
router.delete('/room', verify, bookingController.deleteBooking);

router.get('/test', (req, res) => {
    res.json({ message: "test" });
});
console.log(router)

export default router;
