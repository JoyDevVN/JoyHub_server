import customerService from "../services/customer.service.js"

export const getHotelList = async (req, res) => {
    console.log("Getting hotel list")
    const { result, error } = await customerService.getHotelList();
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const getNotificationList = async (req, res) => {
    const id = req.user.account_id;
    const { result, error } = await customerService.getNotificationList(id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const getHotelInfo = async (req, res) => {
    const id = req.params.id;
    const { result, error } = await customerService.getHotelInfo(id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const getRoomAmenity = async (req, res) => {
    const id = req.params.id;
    const { result, error } = await customerService.getRoomAmenity(id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const getPreBill = async (req, res) => {
    const room_id = req.params.room_id;
    const account_id = req.params.account_id;
    console.log(room_id)
    console.log(account_id)
    const { result, error } = await customerService.getPreBill(room_id, account_id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const getReservation = async (req, res) => {
    const account_id = req.params.account_id;
    const { result, error } = await customerService.getReservation(account_id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const getRoomInfo = async (req, res) => {
    const id = req.params.id;
    const { result, error } = await customerService.getRoomInfo(id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export default class customerController {
    static getHotelList = getHotelList;
    static getHotelInfo = getHotelInfo;
    static getRoomAmenity = getRoomAmenity;
    static getPreBill = getPreBill;
    static getReservation = getReservation;
    static getRoomInfo = getRoomInfo;
    static getNotificationList = getNotificationList;
}
