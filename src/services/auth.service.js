import joi from "joi";
import db from "./db.service.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const registerValidator = (data) => {
    const rule = joi.object({
        username: joi.string().min(6).max(30).required(),
        email: joi.string().email().required(),
        password: joi
            .string()
            .pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
            .required(),
        role: joi.string().required(),
        wallet: joi.string().pattern(new RegExp("^[0-9]{9,18}$")),
        full_name: joi.string().min(6).max(30),
        phone: joi.string().pattern(new RegExp("^[0-9]{10}$")),
        hotel_name: joi.string().min(6),
        address: joi.string().min(6),
        description: joi.string().empty(""),
        owner_name: joi.string().empty(""), // empty string is allowed
    });

    const result = rule.validate(data);
    if (result.error) {
        // console.log(`[VALIDATING] ${result.error.details[0].message}`)
        throw new Error(result.error.details[0].message);
    }
};

const moderatorValidator = (data) => {
    const rule = joi.object({
        username: joi.string().min(6).max(30).required(),
        hotel_name: joi.string().required(),
    });
    const result = rule.validate(data);
    if (result.error) {
        throw new Error(result.error.details[0].message);
    }
}

const isExist = async (username, email) => {
    const { data, error } = await db
        .from("account")
        .select()
        .or(`username.eq.${username}, email.eq.${email}`);
    if (error) {
        throw new Error(error.message);
    }
    if (data.length > 0) {
        throw new Error("Username or email already exists");
    }
};

const getRoleByName = async (name) => {
    const { data, error } = await db
        .from("role")
        .select()
        .like("name", name);
    // if query error, throw an error
    if (error) {
        throw new Error(error.message);
    }
    // if data is empty, throw an error
    if (!data || data.length === 0) {
        throw new Error("Role not found");
    }
    // if data is not empty, return the first element
    return { role_id: data[0]["role_id"] };
}

export const register = async (account) => {

    try {
        registerValidator(account);
        // console.log(`[INFO]Service Registering account ${JSON.stringify(account)}`);
        await isExist(account.username, account.email);
        const {role_id: role} = await getRoleByName(account.role);
        const { error: error_insert } = await db.from("account").insert({
            username: account.username,
            password: bcrypt.hashSync(account.password, 10),
            email: account.email,
            role_id: role,
            wallet: account.wallet,
        });
        if (error_insert) {
            // console.log(`[ERROR] Insert account fail: ${error_insert.message}`);
            return { error: error_insert.message };
        }
        if (account.role === "customer") {
            // console.log(`[INFO]Service Registering customer ${JSON.stringify(account)}`);
            const { error: error_insert } = await db.from("customer").insert({
                account_id: account.username,
                name: account.full_name || null,
                phone: account.phone || null,
            }).select();
            // console.log(`[INFO]Service Registering customer...`);
            if (error_insert) {
                // console.log(`[ERROR] Insert customer fail ${error_insert.message}`);
                // delete account
                const { error: error_delete } = await db.from("account").delete().eq("username", account.username);
                return { error: error_insert.message };
            }
        }
        else if (account.role === "moderator") {
            // console.log(`[INFO]Service Registering moderator ${JSON.stringify(account)}`);
            const { error: error_insert } = await db.from("moderator").insert({
                account_id: account.username,
                hotel_name: account.hotel_name,
                address: account.address || null,
                description: account.description || null,
                owner_name: account.owner_name || null,
            });
            // console.log(`[INFO]Service Registering moderator...`);
            if (error_insert) {
                // console.log(`[ERROR] Insert moderator fail ${error_insert.message}`);
                // delete account
                const { error: error_delete } = await db.from("account").delete().eq("username", account.username);
                return { error: error_insert.message };
            }
        }
        // console.log(`[SUCCESS] Account ${account.username} created`);
        return { result: `Account ${account.username} created` };
    }
    catch (error) {
        // console.log(`[ERROR] ${error.message}`);
        const { error: error_delete } = await db.from("account").delete().eq("username", account.username);
        return { error: error.message };
    }
};

export const getAccounts = async () => {
    const { data, error } = await db.from("account").select();
    if (error) {
        return { error: error.message };
    }
    return { result: data };
};

const getAccountByUsername = async (username) => {
    const { data, error } = await db
        .from("account")
        .select(`username, password, role(name)`)
        .eq("username", username);
    if (error) {
        throw new Error(error.message);
    }
    if (data.length === 0) {
        throw new Error("User not found");
    }
    // console.log(`Data: ${JSON.stringify(data[0])}`)
    return { result: data[0]};
};

export const login = async (username, password) => {
    try {
        const {result: user} = await getAccountByUsername(username);
        // console.log(`Password: ${user.password} - ${password}`);
        if (bcrypt.compare(password, user.password) === false) {
            return { error: "Wrong password" };
        }
        const token = jwt.sign({ username }, process.env.TOKEN_SECRET, {expiresIn: 60 * 60 * 24}); // 1 day
        // console.log(`[SUCCESS] ${username} logged in`)
        return { result: "Login success", token: token, role: user.role.name};
    }
    catch (error) {
        // console.log(`[ERROR] ${error.message}`);
        return { error: error.message };
    }
}

export const verifyToken = async (token) => {
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        return { result: verified };
    } catch (error) {
        return { error: "Invalid token" };
    }
};
export default class authService {
    static register = register;
    static getAccounts = getAccounts;
    static login = login;
    static verifyToken = verifyToken;
}