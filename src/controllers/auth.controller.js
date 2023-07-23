import authService from "../services/auth.service.js";

export const registerAccount = async (req, res) => {
    const {result: result, error: error} = await authService.register(req.body);
    if (error) {
        return res.status(401).json({
            message: error,
        });
    }
    res.status(201).json({
        message: result,
    });
}

export const getAllAccounts = async (req, res) => {
    try {
        res.json(await authService.getAccounts());
    } catch (error) {
        // console.log(`Get all accounts error: ${error}`);
        res.status(401).json({error});
    }
}

export const loginAccount = async (req, res) => {
    const {username, password} = req.body;
    const {result, token, error, role} = await authService.login(username, password);
    if (error) {
        return res.status(401).json({
            message: error,
        });
    }
    res.status(200).header("auth-token", token).json({
        message: result,
        role: role,
    });
};

// verify middleware
export const verify = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).json({error: "Access denied"});
    }
    const {result, error} = await authService.verifyToken(token);
    if (error) {
        return res.json({error});
    }
    req.user = result;
    next();
}

export default class authController {
    static registerAccount = registerAccount;
    static getAllAccounts = getAllAccounts;
    static loginAccount = loginAccount;
    static verify = verify;
}