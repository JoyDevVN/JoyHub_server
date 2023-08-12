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
    return { result: data[0] };
};

const getModerators = async () => {
    const { data, error } = await db
        .from("moderator")
        .select();
    if (error) {
        throw new Error(error.message);
    }
    return { result: data };
};

const getUnacceptedModerators = async () => {
    const { data, error } = await db
        .from("moderator")
        .select(`*, account (
            email
        )`
        )
        .eq("accept", false);
    if (error) {
        throw new Error(error.message);
    }
    return { result: data };
};

const removeModerator = async(username) => {
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
        .eq("account_id", username)
    if (error_acc) {
        throw new Error(error_acc.message);
    }
    return { result: "success" };
}

export default {
    activeModerator,
    getModerators,
    removeModerator,
    getUnacceptedModerators
}
