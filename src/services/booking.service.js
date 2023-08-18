import joi from "joi";
import { Booking } from "../databases/booking.model.js";
import { Notification } from "../databases/notification.model.js";
import jwt from "jsonwebtoken";
import { Account, Moderator } from "../databases/account.model.js";

const bookingValidator = (data) => {
    const rule = joi.object({
        booking_id: joi.string().required(),
        hotel_id: joi.string().required(),
        room_id: joi.string().required(),
        room_type_id: joi.string().required(),
        account_id: joi.string().required(),
        start_date: joi.string().required(),
        end_date: joi.string().required()
    });
    const result = rule.validate(data);
    if (result.error) {
        throw new Error(result.error.details[0].message);
    }
}

export const getBookingListHotel = async (bookingInfo) => {
    const { data, error } = await db
    .from("booking")
    .select()
    .match({
        hotel_id: bookingInfo.hotel_id,
    })
    if (error) {
        return { error: error.message };
    }
    return { result: data };
}

export const getBookingListCustomer = async (bookingInfo) => {
    const { data, error } = await db
    .from("booking")
    .select()
    .match({
        account_id: bookingInfo.account_id,
    })
    if (error) {
        return { error: error.message };
    }
    return { result: data };
}

export const bookRoom = async (bookingInfo) => {
    try {
        // bookingValidator(bookingInfo);
        // const { data, error } = await db
        //     .from("booking")
        //     .insert(bookingInfo);
        // if (error) {
        //     return { error: error.message };
        // }
        const customer = await Account.findById(bookingInfo.account_id);
        if (!customer) {
            return { error: "This customer does not exist" };
        }

        const hotel = await Moderator.findOne({ account_id: bookingInfo.hotel_id });
        if (!hotel) {
            return { error: "This hotel does not exist" };
        }

        const booking = new Booking({
            hotel_id: bookingInfo.hotel_id,
            room_id: bookingInfo.room_id,
            room_type_id: bookingInfo.room_type_id,
            account_id: bookingInfo.account_id,
            check_in: new Date(bookingInfo.check_in),
            check_out: new Date(bookingInfo.check_out),
        });
        const data = await booking.save();
        if (!data) {
            return { error: "Internal error" };
        }



        // create notification
        const notification = new Notification({
            booking_id: booking._id,
            from_id: booking.account_id,
            to_id: booking.hotel_id,
            for: "moderator",
            title: "New booking",
            content: `New booking from ${customer.username}`,
            status: "waiting",
            room_id: booking.room_id
        });
        const notificationData = await notification.save();
        if (!notificationData) {
            return { error: "Internal error" };
        }

        return { result: `successful` };
    }
    catch (err) {
        return { error: err.message };
    }
}

export const updateBookingInfo = async (booking) => {
    try {
        bookingValidator(booking);
        const { data, error } = await db
            .from("booking")
            .update({
                start_date: booking.start_date,
                end_date: booking.end_date
            })
            .match({
                booking_id: booking.booking_id,
                hotel_id: booking.hotel_id,
                room_id: booking.room_id,
                room_type_id: booking.room_type_id,
                account_id: booking.account_id
            })
            .select();
        if (error) {
            return { error: error.message };
        }

        if (!data || data.length === 0) {
            return { error: `Invalid request` };
        }
        return { result: `The booking info has been updated successfully!` };
    }
    catch (err) {
        return { error: err.message };
    }
}

export const deleteBooking = async (booking) => {
    try {
        const { data, error } = await db
            .from("booking")
            .delete()
            .eq("booking_id", booking.booking_id)
        if (error) {
            return { error: error.message };
        }
        return { result: "booking deleted" };
    }
    catch (err) {
        return { error: err.message };
    }
}

const billValidator = (data) => {
    const rule = joi.object({
        bill_id: joi.string().required(),
        customer_id: joi.string().required(),
        date_created: joi.string().required(),
        total: joi.string().required(),
    });
    const result = rule.validate(data);
    if (result.error) {
        throw new Error(result.error.details[0].message);
    }
}

export const addBill = async (bill) => {
    try {
        billValidator(bill);
        const { data, error } = await db
            .from("bill")
            .insert(bill);
        if (error) {
            return { error: error.message };
        }
        return { result: `Inserted ${bill.bill_id} into bill` };
    }
    catch (err) {
        return { error: err.message };
    }
}

export const getBillList = async (bill) => {
    const { data, error } = await db
    .from("bill")
    .select()
    .match({
        customer_id: bill.customer_id,
    })
    if (error) {
        return { error: error.message };
    }
    return { result: data };
}

export const updateBill = async (bill) => {
    try {
        billValidator(bill);
        const { data, error } = await db
            .from("bill")
            .update({
                total: bill.total
            })
            .match({
                bill_id: bill.bill_id,
                customer_id: bill.customer_id,
                date_created: bill.date_created
            })
            .select();
        if (error) {
            return { error: error.message };
        }

        if (!data || data.length === 0) {
            return { error: `Invalid request` };
        }
        return { result: `The bill info has been updated successfully!` };
    }
    catch (err) {
        return { error: err.message };
    }
}

const billDetailValidator = (data) => {
    const rule = joi.object({
        booking_id: joi.string().required(),
        bill_id: joi.string().required(),
        price: joi.string().required()
    });
    const result = rule.validate(data);
    if (result.error) {
        throw new Error(result.error.details[0].message);
    }
}

export const getBillDetailList = async (bill_detail) => {
    const { data, error } = await db
    .from("bill_detail")
    .select()
    .match({
        bill_id: bill_detail.bill_id,
    })
    if (error) {
        return { error: error.message };
    }
    return { result: data };
}

export const addBillDetail = async (bill_detail) => {
    try {
        billDetailValidator(bill_detail);
        const { data, error } = await db
            .from("bill_detail")
            .insert(bill_detail);
        if (error) {
            return { error: error.message };
        }
        return { result: `Inserted ${bill_detail.booking_id} ${bill_detail.bill_id} into bill_detail` };
    }
    catch (err) {
        return { error: err.message };
    }
}

export const deleteBillDetail = async (bill_detail) => {
    try {
        const { data, error } = await db
            .from("bill_detail")
            .delete()
            .eq("bill_id", bill_detail.bill_id).eq("booking_id", bill_detail.booking_id)
        if (error) {
            return { error: error.message };
        }
        return { result: "bill detail deleted" };
    }
    catch (err) {
        return { error: err.message };
    }
}

export const deleteBill = async (bill) => {
    try {
        const { data, error } = await db
            .from("bill")
            .delete()
            .eq("bill_id", bill.bill_id)
        if (error) {
            return { error: error.message };
        }
        return { result: "bill deleted" };
    }
    catch (err) {
        return { error: err.message };
    }
}

export default class bookingService {
    // Book room
    static bookRoom = bookRoom
    static updateBookingInfo = updateBookingInfo
    static getBookingListCustomer = getBookingListCustomer;
    static getBookingListHotel = getBookingListHotel;
    static deleteBooking = deleteBooking;

    // Bill
    static addBill = addBill
    static getBillList = getBillList
    static updateBill = updateBill
    static deleteBill = deleteBill

    // Bill_Detail
    static getBillDetailList = getBillDetailList
    static addBillDetail = addBillDetail
    static deleteBillDetail = deleteBillDetail
}
