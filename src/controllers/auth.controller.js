import authService from "../services/auth.service.js";

export const registerAccount = async (req, res) => {
    const { result: result, error: error } = await authService.register(req.body);
    if (error) {
        return res.status(401).json({
            message: error,
        });
    }
    res.status(201).json({
        message: result,
    });
}

export const loginAccount = async (req, res) => {
    const { result, token, error, role } = await authService.login(req.body);
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
        return res.status(401).json({ error: "Access denied" });
    }
    const { result, error } = authService.verifyToken(token);
    if (error) {
        return res.json({ error });
    }
    // console.log(result);
    req.user = result;
    next();
}

export default class authController {
    static registerAccount = registerAccount;
    // static getAllAccounts = getAllAccounts;
    static loginAccount = loginAccount;
    static verify = verify;
}
