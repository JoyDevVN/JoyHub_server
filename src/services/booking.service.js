import joi from "joi";
import db from "./db.service.js";
import jwt from "jsonwebtoken";

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

export const getBookingList = async (bookingInfo) => {
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

export const bookRoom = async (bookingInfo) => {
    try {
        bookingValidator(bookingInfo);
        const { data, error } = await db
            .from("booking")
            .insert(bookingInfo);
        if (error) {
            return { error: error.message };
        }
        return { result: `Inserted ${bookingInfo.booking_id} into booking` };
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
                booking_id: booking.booking_id,
                hotel_id: booking.hotel_id,
                room_id: booking.room_id,
                room_type_id: booking.room_type_id,
                account_id: booking.account_id,
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

export default class bookingService {
    // Book room
    static bookRoom = bookRoom
    static updateBookingInfo = updateBookingInfo
    static getBookingList = getBookingList;
    static deleteBooking = deleteBooking;
}
