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
    return data[0];
};

export default {
    activeModerator,
}
