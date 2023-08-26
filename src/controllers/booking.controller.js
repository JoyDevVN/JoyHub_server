import bookingService from "../services/booking.service.js"

export const getBookingListHotel = async (req, res) => {
    const { result, error } = await bookingService.getBookingListHotel(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const getBookingListCustomer= async (req, res) => {
    const { result, error } = await bookingService.getBookingListCustomer(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const bookRoom = async (req, res) => {
    req.body.account_id = req.user.account_id;
    const { result, error } = await bookingService.bookRoom(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const updateBookingInfo = async (req, res) => {
    const { result, error } = await bookingService.updateBookingInfo(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const deleteBooking = async (req, res) => {
    const { result, error } = await bookingService.deleteBooking(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const addBill = async (req, res) => {
    const { result, error } = await bookingService.addBill(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const updateBill = async (req, res) => {
    const { result, error } = await bookingService.updateBill(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const getBillList = async (req, res) => {
    const { result, error } = await bookingService.getBillList(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const getBillDetailList = async (req, res) => {
    const { result, error } = await bookingService.getBillDetailList(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const addBillDetail = async (req, res) => {
    const { result, error } = await bookingService.addBillDetail(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const deleteBillDetail = async (req, res) => {
    const { result, error } = await bookingService.deleteBillDetail(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const deleteBill = async (req, res) => {
    const { result, error } = await bookingService.deleteBill(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export const addMoney = async (req, res) => {
    const { result, error } = await bookingService.addMoney(req.body);
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export default class bookingController {
    // Booking
    static bookRoom = bookRoom;
    static updateBookingInfo = updateBookingInfo;
    static getBookingListCustomer = getBookingListCustomer;
    static getBookingListHotel = getBookingListHotel;
    static deleteBooking = deleteBooking;

    //Bill
    static getBillList = getBillList
    static addBill = addBill
    static updateBill = updateBill
    static deleteBill = deleteBill

    //Bill_detail
    static getBillDetailList = getBillDetailList
    static addBillDetail = addBillDetail
    static deleteBillDetail = deleteBillDetail

    //money
    static addMoney = addMoney

}
