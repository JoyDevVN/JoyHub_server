import joi from "joi";
import db from "./db.service.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const activeModerator = async (username) => {
    const { data, error } = await db
        .from("moderator")
        .update({ accept: true })
        .eq("account_id", username)
        .select();
    if (error) {
        throw new Error(error.message);
    }
    if (data.length === 0) {
        throw new Error("Username not found");
    }
    return { result: "success" };
};

const getModerators = async () => {
    const { data, error } = await db.from("moderator").select();
    if (error) {
        throw new Error(error.message);
    }
    return { result: data };
};

const getUnacceptedModerators = async () => {
    const { data, error } = await db
        .from("moderator")
        .select(
            `*, account (
            email
        )`
        )
        .eq("accept", false);
    if (error) {
        throw new Error(error.message);
    }
    return { result: data };
};

const removeModerator = async (username) => {
    // remove moderator from moderator as well as account
    const { error: error_mod } = await db
        .from("moderator")
        .delete()
        .eq("account_id", username);
    if (error_mod) {
        throw new Error(error_mod.message);
    }
    const { error_acc } = await db
        .from("account")
        .delete()
        .eq("account_id", username);
    if (error_acc) {
        throw new Error(error_acc.message);
    }
    return "success";
};

const getRooms = async () => {
    const { data, error } = await db.from("moderator").select(`account_id,
            room_type(
                name,
                room(count)
            )
        `);

    // format data with the following format:
    // [
    //     {
    //         account_id: "moderator1",
    //         rooms: 10,
    //     }
    // ]
    const result = data.map((moderator) => {
        return {
            account_id: moderator.account_id,
            rooms: moderator.room_type.reduce((acc, room_type) => {
                return (
                    acc +
                    room_type.room.reduce((acc, room) => {
                        return acc + room.count;
                    }, 0)
                );
            }, 0),
        };
    });

    if (error) {
        throw new Error(error.message);
    }
    return { result: result };
};

// Get all rooms that are not accepted of a moderator
const getUnacceptedRooms = async (id) => {
    const { data, error } = await db
        .from("room_type")
        .select(`
            hotel_id,
            name,
            room(
                count
            )
        `)
        .eq("hotel_id", id)
        .eq("room.accept", false);
    // .eq("room.accept", false)
    let result = [];
    for (let i in data) {
        let hotel = {
            hotel_id: data[i].hotel_id,
            count: 0,
        }
        for (let j in data[i].room) {
            hotel.count += data[i].room[j].count;
        }
        result.push(hotel);
    }
    console.log(JSON.stringify(result, null, 2));
    if (error) {
        throw new Error(error.message);
    }
    return { result: result };
};

export default {
    activeModerator,
    getModerators,
    removeModerator,
    getUnacceptedModerators,
    getRooms,
    getUnacceptedRooms,
};
