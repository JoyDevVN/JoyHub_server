import modService from "../services/moderator.service.js"

export const getRoomType = async (req, res) => {
    const { result, error } = await modService.getRoomType();
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const verifyMod = async (req, res, next) => {
    if (req.user.role !== "moderator") {
        return res.status(401).json({ error: "Access denied" });
    }
    // console.log("verify mod");
    next();
}

export const insertRoomType = async (req, res) => {
    const { result, error } = await modService.insertRoomType(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const updateRoomTypeName = async (req, res) => {
    const { result, error } = await modService.updateRoomTypeName(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export default class modController {
    static getRoomType = getRoomType;
    static verifyMod = verifyMod;
    static insertRoomType = insertRoomType;
    static updateRoomTypeName = updateRoomTypeName;
}
