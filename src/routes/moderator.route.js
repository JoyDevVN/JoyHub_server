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
router.post('/new-room', verify, modController.verifyMod, modController.insertNewRoom);
router.put('/room-type', verify, modController.verifyMod, modController.updateRoomTypeName);
router.get('/test', (req, res) => {
    res.json({ message: "test" });
});
router.get('/verify', verify, modController.verifyMod, (req, res) => {
    // if (req.user.role !== "moderator") {
    //     return res.status(401).json({ error: "Access denied" });
    // }
    res.json({ message: "verify" });
});
console.log(router)

export default router;
