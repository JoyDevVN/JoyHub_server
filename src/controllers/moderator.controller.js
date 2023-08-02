import modService from "../services/moderator.service.js"

export const getRoomType = async (req, res) => {
    const { result, error } = await modService.getRoomType();
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const verifyMod = async (req, res, next) => {
    // if (req.user.role !== "moderator") {
    //     return res.status(401).json({ error: "Access denied" });
    // }
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

export const getRoomInfo = async (req, res) => {
    const { result, error } = await modService.getRoomInfo();
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const insertNewRoom = async (req, res) => {
    const { result, error } = await modService.insertNewRoom(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const updateRoomInfo = async (req, res) => {
    const { result, error } = await modService.updateRoomInfo(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const deleteRoom = async (req, res) => {
    const { result, error } = await modService.deleteRoom(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const getHotelInfo = async (req, res) => {
    const { result, error } = await modService.getHotelInfo();
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const getHotelById = async (req, res) => {
    const { result, error } = await modService.getHotelById(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const getHotelRoom = async (req, res) => {
    const { result, error } = await modService.getHotelRoom(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};



export default class modController {
    static verifyMod = verifyMod;
    // Room-type
    static getRoomType = getRoomType;
    static insertRoomType = insertRoomType;
    static updateRoomTypeName = updateRoomTypeName; 
    // Room 
    static insertNewRoom = insertNewRoom;
    static getRoomInfo = getRoomInfo;
    static updateRoomInfo = updateRoomInfo;
    static deleteRoom = deleteRoom;
    // Hotel
    static getHotelInfo = getHotelInfo;
    static getHotelById = getHotelById;
    static getHotelRoom = getHotelRoom;

}
