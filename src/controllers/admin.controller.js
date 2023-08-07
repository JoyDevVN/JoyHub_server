import adminService from "../services/admin.service";

export const verifyAdmin = async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({error: "Access denied"});
    }
    // console.log("verify admin");
    next();
}

export const activeModerator = async (req, res) => {
    const {username} = req.body;
    try {
        const result = await adminService.activeModerator(username);
        res.status(200).json({message: result});
    }
    catch (error) {
        res.status(401).json({error: error.message});
    }
}

export default class adminController {
    static activeModerator = activeModerator;
    static verifyAdmin = verifyAdmin;
}
