import customerController from "../controllers/customer.controller";
import express from 'express';
import { verify } from "../controllers/auth.controller";

const router = express.Router();

router.get('/hotelList', customerController.getHotelList);
router.get('/hotel/:id', customerController.getHotelInfo);
router.get('/room_amenity/:id', customerController.getRoomAmenity);

export default router;