import { register, getAccounts, login, verifyToken } from "../services/auth.service.js";

export const registerAccount = async (req, res) => {
    const { username, email, password, role_id, wallet } = req.body;
    const { result: message, error } = await register({
        username,
        email,
        password,
        role_id,
        wallet,
    });
    if (error) {
        return res.json({ "message": error, "created": false });
    }
    res.status(201).json({ "message": message, "created": true});
}

export const getAllAccounts = async (req, res) => {
    try {
        res.json(await getAccounts());
    }
    catch (error) {
        console.log(`Get all accounts error: ${error}`)
        res.json({ error });
    }
}

export const loginAccount = async (req, res) => {
    const { username, password } = req.body;
    const { result, token, error } = await login(username, password);
    if (error) {
        return res.json({ error, login: false });
    }
    res.header("auth-token", token).json({ message: result, login: true});
};

// verify middleware
export const verify = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return res.json({ error: "Access denied" });
    }
    const { result, error } = await verifyToken(token);
    if (error) {
        return res.json({ error });
    }
    req.user = result;
    next();
}
