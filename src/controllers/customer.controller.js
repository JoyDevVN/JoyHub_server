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
    const { check_in, check_out } = req.body;
    const { result, error } = await customerService.getHotelInfo(id, check_in, check_out);
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
    const account_id = req.user.account_id;
    console.log(room_id)
    console.log(account_id)
    const { result, error } = await customerService.getPreBill(room_id, account_id);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const getReservation = async (req, res) => {
    const account_id = req.user.account_id;
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

export const rating = async (req, res) => {
    const account_id = req.user.account_id;
    const { booking_id, star, comment } = req.body;
    const { result, error } = await customerService.rating(booking_id, account_id, star, comment);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const report = async (req, res) => {
    const {booking_id, content} = req.body;
    const customer_id = req.user.account_id;
    const { result, error } = await customerService.report(customer_id, booking_id, content);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
}

export const updateInfo = async (req, res) => {
    const id = "64ddff79df3bc0763ba06d52";
    const { email, phone, full_name} = req.body;
    const { result, error } = await customerService.updateInfo(id, full_name, email, phone);
    if (error) {
        return res.status(401).json({ error: error });
    }
    res.status(200).json({ message: result });
}

export default class customerController {
    static getHotelList = getHotelList;
    static getHotelInfo = getHotelInfo;
    static getRoomAmenity = getRoomAmenity;
    static getPreBill = getPreBill;
    static getReservation = getReservation;
    static getRoomInfo = getRoomInfo;
    static getNotificationList = getNotificationList;
    static rating = rating;
    static report = report;
    static updateInfo = updateInfo;
}
