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
            .eq("room_type_id", room_type_id);
        if (error) {
            return { error: error.message };
        }
        return { result: data };
    }
    catch (err) {
        return { error: err.message };
    }
}

export default class modService {
    static getRoomType = getRoomType;
    static insertRoomType = insertRoomType;
    static updateRoomTypeName = updateRoomTypeName;
    static deleteRoomType = deleteRoomType;
}
