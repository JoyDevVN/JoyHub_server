import bookingController from "../controllers/booking.controller";
import express from 'express';
import { verify } from "../controllers/auth.controller";

const router = express.Router();

/// /booking/room
/// req.body: { hotel_id}
// Get list of booking for a hotel
router.get('/room_hotel', verify, bookingController.getBookingListHotel);
// Get list of booking for a customer
router.get('/room_customer', verify, bookingController.getBookingListCustomer);
/// req.body: { booking_id, hotel_id, room_id, account_id, start_date, end_date}
router.post('/room', verify, bookingController.bookRoom);
/// req.body: { booking_id, hotel_id, room_id, account_id, start_date, end_date}
router.put('/room', verify, bookingController.updateBookingInfo);
/// req.body: { booking_id, hotel_id, room_id, account_id}
router.delete('/room', verify, bookingController.deleteBooking);

/// /booking/bill
/// req.body: { customer_id }
router.get('/bill', verify, bookingController.getBillList);
/// req.body: { bill_id, customer_id, date_created, total}
router.post('/bill', verify, bookingController.addBill);
/// req.body: { bill_id, customer_id, date_created, total}
router.put('/bill', verify, bookingController.updateBill);
/// req.body: { bill_id, customer_id, date_created, total}
router.delete('/bill', verify, bookingController.deleteBill);

/// /booking/bill
/// req.body: { bill_id }
router.get('/bill_detail', verify, bookingController.getBillDetailList);
/// req.body: { bill_id, booking_id, price}
router.post('/bill_detail', verify, bookingController.addBillDetail);
/// req.body: { bill_id, booking_id}
router.delete('/bill_detail', verify, bookingController.deleteBillDetail);

router.get('/test', (req, res) => {
    res.json({ message: "test" });
});

export default router;
