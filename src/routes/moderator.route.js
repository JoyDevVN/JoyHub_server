import modController from "../controllers/moderator.controller";
import express from 'express';
import { verify } from "../controllers/auth.controller";

const router = express.Router();
/// /api/mod
/// /api/mod/room-type
/// req.body: { username, room_type_id, room_type_name }
/// res: { message}
router.get('/room-type', verify, modController.verifyMod, modController.getRoomType);
router.post('/room-type', verify, modController.verifyMod, modController.insertRoomType);
router.put('/room-type', verify, modController.verifyMod, modController.updateRoomTypeName);

/// /api/mod/room
/// req.body: { username, room_type_id, room_type_name }
/// res: { message }
router.get('/room', verify, modController.verifyMod, modController.getRoomInfo);
// req.body: { hotel_id, room_id, room_type_id, name, number_of_guest, number_of_bedroom, number_of_bathroom, area, price}
router.post('/room', verify, modController.verifyMod, modController.insertNewRoom);
// req.body: { hotel_id, room_id, room_type_id, name, number_of_guest, number_of_bedroom, number_of_bathroom, area, price}
router.put('/room', verify, modController.verifyMod, modController.updateRoomInfo);
// req.body: { hotel_id, room_id, room_type_id,}
router.delete('/room/:id', verify, modController.verifyMod, modController.deleteRoom);

/// /api/mod/hotel_list
/// req.body: {  }
router.get('/hotel_list', verify, modController.verifyMod, modController.getHotelInfo);
/// /api/mod/hotel
router.get('/hotel', verify, modController.verifyMod, modController.getHotelById);
/// /api/mod/hotel/roomlist
/// req.body: { hotel_id }
// Display room list of a hotel
router.get('/hotel/room_list', verify, modController.verifyMod, modController.getHotelRoomList);
/// /api/mod/hotel/room
/// req.body: { hotel_id, room_id}
// Display detail of a room of a hotel
router.get('/hotel/room/:id', verify, modController.verifyMod, modController.getHotelRoom);

router.get('/test', (req, res) => {
    res.json({ message: "test" });
});
router.get('/verify', verify, modController.verifyMod, (req, res) => {
    // if (req.user.role !== "moderator") {
    //     return res.status(401).json({ error: "Access denied" });
    // }
    res.json({ message: "verify" });
});


//amenity route
router.get('/amenity',verify, modController.verifyMod, modController.getAllAmenity);

router.post('/amenity', modController.addAmenity);


export default router;
