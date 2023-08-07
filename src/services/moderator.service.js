import joi from "joi";
import db from "./db.service.js";
import jwt from "jsonwebtoken";

export const getRoomType = async () => {
    const { data, error } = await db
        .from("room_type")
        .select();
    if (error) {
        return { error: error.message };
    }
    return { result: data };
}

const roomTypeValidator = (data) => {
    const rule = joi.object({
        hotel_id: joi.string().required(),
        room_type_id: joi.string().required(),
        name: joi.string().required(),
    });
    const result = rule.validate(data);
    if (result.error) {
        throw new Error(result.error.details[0].message);
    }
}

export const insertRoomType = async (room_type) => {
    try {
        roomTypeValidator(room_type);
        const { data, error } = await db
            .from("room_type")
            .insert(room_type);
        if (error) {
            return { error: error.message };
        }
        return { result: `Inserted ${room_type.name} into room_type` };
    }
    catch (err) {
        return { error: err.message };
    }
}

export const updateRoomTypeName = async (room_type) => {
    try {
        roomTypeValidator(room_type);
        const { data, error } = await db
            .from("room_type")
            .update({ name: room_type.name })
            .match({ room_type_id: room_type.room_type_id, hotel_id: room_type.hotel_id })
            .select();
        if (error) {
            return { error: error.message };
        }

        if (!data || data.length === 0) {
            return { error: `Invalid request` };
        }
        return { result: `successful` };
    }
    catch (err) {
        return { error: err.message };
    }
}

export const deleteRoomType = async (room_type_id) => {
    try {
        const { data, error } = await db
            .from("room_type")
            .delete()
            .eq("room_type_id", room_type_id)
        if (error) {
            return { error: error.message };
        }
        return { result: data };
    }
    catch (err) {
        return { error: err.message };
    }
}

export const getRoomInfo = async () => {
    const { data, error } = await db
        .from("room")
        .select();
    if (error) {
        return { error: error.message };
    }
    return { result: data };
}

const roomValidator = (data) => {
    const rule = joi.object({
        hotel_id: joi.string().required(),
        room_id: joi.string().required(),
        room_type_id: joi.string().required(),
        name: joi.string().required(),
        number_of_guest: joi.string().required(),
        number_of_bedroom: joi.string().required(),
        number_of_bathroom: joi.string().required(),
        area: joi.string().required(),
        price: joi.string().required(),
    });
    const result = rule.validate(data);
    if (result.error) {
        throw new Error(result.error.details[0].message);
    }
}

export const insertNewRoom = async (room) => {
    try {
        roomValidator(room);
        const { data, error } = await db
            .from("room")
            .insert(room);
        if (error) {
            return { error: error.message };
        }
        return { result: `Inserted ${room.name} into room_type` };
    }
    catch (err) {
        return { error: err.message };
    }
}

export const updateRoomInfo = async (room) => {
    try {
        roomValidator(room);
        const { data, error } = await db
            .from("room")
            .update({
                name: room.name,
                number_of_guest: room.number_of_guest,
                number_of_bedroom: room.number_of_bedroom,
                number_of_bathroom: room.number_of_bathroom,
                area: room.area,
                price: room.price
            })
            .match({
                room_type_id: room.room_type_id,
                hotel_id: room.hotel_id,
                room_id: room.room_id
            })
            .select();
        if (error) {
            return { error: error.message };
        }

        if (!data || data.length === 0) {
            return { error: `Invalid request` };
        }
        return { result: `The room info has been updated successfully!` };
    }
    catch (err) {
        return { error: err.message };
    }
}

export const deleteRoom = async (room) => {
    try {
        const { data, error } = await db
            .from("room")
            .delete()
            .eq("room_id", room.room_id).eq("room_type_id", room.room_type_id).eq("hotel_id", room.hotel_id)
        if (error) {
            return { error: error.message };
        }
        return { result: data };
    }
    catch (err) {
        return { error: err.message };
    }
}

export const getHotelInfo = async () => {
    const { data, error } = await db
        .from("moderator")
        .select();
    if (error) {
        return { error: error.message };
    }
    return { result: data };
}

export const getHotelById = async (hotel) => {
    const { data, error } = await db
        .from("moderator")
        .select()
        .match({
            account_id: hotel.account_id,
        })
    if (error) {
        return { error: error.message };
    }
    return { result: data };
}

export const getHotelRoom = async (hotel) => {
    const { data, error } = await db
        .from("room")
        .select()
        .match({
            hotel_id: hotel.hotel_id,
        })
    if (error) {
        return { error: error.message };
    }
    return { result: data };
}


export default class modService {
    // Room-type
    static getRoomType = getRoomType;
    static insertRoomType = insertRoomType;
    static updateRoomTypeName = updateRoomTypeName;
    static deleteRoomType = deleteRoomType;
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
