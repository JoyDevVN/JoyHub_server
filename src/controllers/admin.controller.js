import adminService from "../services/admin.service";

 const verifyAdmin = async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({error: "Access denied"});
    }
    // console.log("verify admin");
    next();
}

 const activeModerator = async (req, res) => {
    const {username} = req.body;
    try {
        const result = await adminService.activeModerator(username);
        res.status(200).json({message: result});
    }
    catch (error) {
        res.status(401).json({error: error.message});
    }
}

 const getModerators = async (req, res) => {
    try {
        const moderators = await adminService.getModerators();
        res.status(200).json({moderators});
    }
    catch (error) {
        res.status(401).json({error: error.message});
    }
}

 const getUnacceptedModerators = async (req, res) => {
    try {
        const moderators = await adminService.getUnacceptedModerators();
        res.status(200).json({moderators});
    }
    catch (error) {
        res.status(401).json({error: error.message});
    }
}

 const removeModerator = async (req, res) => {
    const username = req.params.id;
    try {
        const result = await adminService.removeModerator(username);
        res.status(200).json({message: result});
    }
    catch (error) {
        res.status(401).json({error: error.message});
    }
}

const getRooms = async (req, res) => {
    try {
        const rooms = await adminService.getRooms();
        res.status(200).json(rooms);
    }
    catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getUnacceptedRooms = async (req, res) => {
    try {
        const id = req.params.id;
        const rooms = await adminService.getUnacceptedRooms(id);
        res.status(200).json(rooms);
    }
    catch (error) {
        res.status(400).json({error: error.message});
    }
}

export default {
    verifyAdmin,
    activeModerator,
    getModerators,
    getUnacceptedModerators,
    removeModerator,
    getRooms,
    getUnacceptedRooms,
}
