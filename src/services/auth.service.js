import joi from "joi";
import db from "./db.service.js";
import jwt from "jsonwebtoken";

const test = async () => {
    const { data, error } = await db.from("account").select();
    if (error) {
        return { error: error.message };
    }
    return data;
};

const registerValidator = (data) => {
    const rule = joi.object({
        username: joi.string().min(6).max(30).required(),
        email: joi.string().email().required(),
        password: joi
            .string()
            .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
            .required(),
        role_id: joi.number().integer().min(2).max(3).required(),
        wallet: joi.string().pattern(new RegExp("^[0-9]{9,18}$")).required(),
    });

    // return true if data matches the schema
    return rule.validate(data);
};

const isExist = async (username, email) => {
    const { data, error } = await db
        .from("account")
        .select()
        .or(`username.eq.${username}`, `email.eq.${email}`);
    if (error) {
        return { error: error.message };
    }
    if (data.length > 0) {
        return true;
    }
    return false;
};

export const register = async (account) => {
    // validate the data before creating account
    const { error } = registerValidator(account);
    if (error) {
        return { error: error.details[0].message };
    }

    // check if username or email is already in the database
    const exist = await isExist(account.username, account.email);
    console.log(`exist: ${exist}`);
    if (exist) {
        return { error: "Username or email already exists" };
    }

    const { data, error_insert } = await db.from("account").insert({
        username: account.username,
        password: account.password,
        email: account.email,
        role_id: account.role_id,
        wallet: account.wallet,
    });
    if (error_insert) {
        return { error: error_insert.message };
    }
    // console.log(`Account ${account.username} created`);
    return { result: `Account ${account.username} created` };
};

export const getAccounts = async () => {
    const { data, error } = await db.from("account").select();
    if (error) {
        return { error: error.message };
    }
    return data;
};

const getAccountByUsername = async (username) => {
    const { data, error } = await db
        .from("account")
        .select()
        .eq("username", username);
    if (error) {
        return { error: error.message };
    }
    return data;
};

export const login = async (username, password) => {
    const user = await getAccountByUsername(username);
    if (user.error) {
        return { error: user.error };
    }
    if (user.length === 0) {
        return { error: "User not found" };
    }

    if (password != user[0].password) {
        return { result: "Wrong password"};
    }
    const token = jwt.sign({ username }, process.env.TOKEN_SECRET, {expiresIn: 60 * 60 * 24}); // 1 day
    return { result: "Login success", token };
}

export const verifyToken = async (token) => {
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        return { result: verified };
    } catch (error) {
        return { error: "Invalid token" };
    }
};
