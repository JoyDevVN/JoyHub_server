import customerController from "../controllers/customer.controller";
import express from 'express';
import { verify } from "../controllers/auth.controller";

const router = express.Router();

router.get('/hotel/:id', customerController.getHotelList);
router.get('/room_amenity/:id', customerController.getRoomAmenity);

export default router;