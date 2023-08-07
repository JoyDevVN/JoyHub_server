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

export default class bookingController {
    // Booking 
    static bookRoom = bookRoom;
    static updateBookingInfo = updateBookingInfo;
    static getBookingListCustomer = getBookingListCustomer;
    static getBookingListHotel = getBookingListHotel;
    static deleteBooking = deleteBooking;
}
