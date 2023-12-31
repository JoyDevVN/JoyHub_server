import modService from "../services/moderator.service.js"

export const getRoomType = async (req, res) => {
    const id = req.user.account_id;
    const { result, error } = await modService.getRoomType(id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const verifyMod = async (req, res, next) => {
    if (req.user.role !== "moderator") {
        return res.status(401).json({ error: "Cannot access moderator" });
    }
    // console.log("verify mod");
    next();
}

// export const insertRoomType = async (req, res) => {
//     req.body.hotel_id = req.user.account_id;
//     // console.log(`insertRoomType: ${JSON.stringify(req.body, null, 2)}`);
//     const { result, error } = await modService.insertRoomType(req.body);
//     if (error) {
//         return res.status(401).json({ message: error });
//     }
//     res.status(200).json({ message: result });
// };

export const updateRoomTypeName = async (req, res) => {
    req.body.hotel_id = req.user.account_id;
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
    const id = req.user.account_id;
    const { result, error } = await modService.insertNewRoom(id,req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const updateRoomInfo = async (req, res) => {
  
    console.log("CUC DATA", req.body)
    const { result, error } = await modService.updateRoomInfo(req.body.id,req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const deleteRoom = async (req, res) => {
    const id = req.params.id;
    const { result, error } = await modService.deleteRoom(id);
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
    const id = req.user.account_id;
    const { result, error } = await modService.getHotelById(id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const getHotelRoomList = async (req, res) => {
    const id = req.user.account_id;
    const { result, error } = await modService.getHotelRoomList(id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const getHotelRoom = async (req, res) => {
    const id = req.user.account_id;
    const room_id = req.params.id;
    if (!room_id) {
        return res.status(401).json({ message: "Room id is required" });
    }
    const { result, error } = await modService.getHotelRoom(id, room_id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const getAllAmenity = async (req, res) => {

    const { result, error } = await modService.getAllAmenity();
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
}

export const addAmenity = async (req, res) => {

    const { result, error } = await modService.addAmenity();
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
}

export const getVerify = async (req, res) => {
    const id = req.user.account_id;
    const { result, error } = await modService.getVerify(id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });

}


export const acceptVerify = async (req, res) => {

    const { result, error } = await modService.acceptVerify(req.params.id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });

}

export const declineVerify = async (req, res) => {

    const { result, error } = await modService.declineVerify(req.params.id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });

}


export const removeVerify = async (req, res) => {
    const { result, error } = await modService.removeVerify(req.params.id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });


}

export const getCheckin = async (req, res) => {
    const id = req.user.account_id;
    const { result, error } = await modService.getCheckin(id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });

}

export const checkin = async (req, res) => {

    const { result, error } = await modService.checkin(req.params.id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });

}


export const getCheckout = async (req, res) => {
    const id = req.user.account_id;
    const { result, error } = await modService.getCheckout(id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });

}

export const checkout = async (req, res) => {

    const { result, error } = await modService.checkout(req.params.id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
}

export const getModInfo= async (req, res) => {
    const id = req.user.account_id;
    const { result, error } = await modService.getModInfo(id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
}

export const editInfo= async (req, res) =>{
    const id = req.user.account_id;


    const { result, error } = await modService.editInfo(id,req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
}

export const getNotifications = async (req, res) =>{
    const id = req.user.account_id;
    const { result, error } = await modService.getNotifications(id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
}

export const sendNotifications = async (req, res) =>{
    const id = req.user.account_id;
    const { result, error } = await modService.sendNotifications(id,req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
}

export const withdraw = async (req, res) =>{
    const id = req.user.account_id;
    const money = req.params.money;
    console.log("MONEY: " , money);
    const { result, error } = await modService.withdraw(id,money);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
}

export default class modController {
    static verifyMod = verifyMod;
    // Room-type
    // static getRoomType = getRoomType;
    // static insertRoomType = insertRoomType;
    // static updateRoomTypeName = updateRoomTypeName;
    // Room
    static insertNewRoom = insertNewRoom;
    static getRoomInfo = getRoomInfo;
    static updateRoomInfo = updateRoomInfo;
    static deleteRoom = deleteRoom;
    // Hotel
    static getHotelInfo = getHotelInfo;
    static getHotelById = getHotelById;
    static getHotelRoomList = getHotelRoomList;
    static getHotelRoom = getHotelRoom;
    //Amenity
    static getAllAmenity = getAllAmenity;
    static addAmenity = addAmenity;
    //MainScreen
    static getVerify = getVerify;
    static acceptVerify = acceptVerify;
    static declineVerify = declineVerify;

    static removeVerify = removeVerify;

    static getCheckin = getCheckin;
    static checkin = checkin;

    static getCheckout = getCheckout;
    static checkout = checkout;
    //user info
    static getModInfo = getModInfo;
    static editInfo = editInfo;

    //notifications
    static getNotifications = getNotifications;
    static sendNotifications = sendNotifications;

    //withdraw
    static withdraw = withdraw;
}
