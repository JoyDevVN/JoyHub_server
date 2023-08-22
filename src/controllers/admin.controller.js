import adminService from "../services/admin.service";

const verifyAdmin = async (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(401).json({ error: "Access denied" });
    }
    // console.log("verify admin");
    next();
}

const activeModerator = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const { result, error } = await adminService.activeModerator(id);
    if (error) {
        return res.status(401).json({ error: error });
    }
    res.status(200).json({ message: result });
}

const getModerators = async (req, res) => {
    const { result, error } = await adminService.getModerators();
    if (error) {
        return res.status(401).json({ error: error });
    }
    res.status(200).json({ message: result });
}

const getUnacceptedModerators = async (req, res) => {
    const { result, error } = await adminService.getUnacceptedModerators();
    if (error) {
        return res.status(401).json({ error: error });
    }
    res.status(200).json({ message: result });
}

const removeModerator = async (req, res) => {
    const id = req.params.id;
    const { result, error } = await adminService.removeModerator(id);
    if (error) {
        return res.status(401).json({ error: error });
    }
    res.status(200).json({ message: result });
}

const activeRoom = async (req, res) => {
    const id = req.params.id;
    const { result, error } = await adminService.activeRoom(id);
    if (error) {
        return res.status(401).json({ error: error });
    }
    res.status(200).json({ message: result });
}

const removeRoom = async (req, res) => {
    const id = req.params.id;
    const { result, error } = await adminService.removeRoom(id);
    if (error) {
        return res.status(401).json({ error: error });
    }
    res.status(200).json({ message: result });
}

const getRooms = async (req, res) => {
    const { result, error } = await adminService.getRooms();
    if (error) {
        return res.status(401).json({ error: error });
    }
    res.status(200).json({ message: result });
}

const getUnacceptedRooms = async (req, res) => {
    const id = req.params.id;
    const { result, error } = await adminService.getUnacceptedRooms(id);
    if (error) {
        return res.status(400).json({ error: error });
    }
    res.status(200).json({ message: result });
}

const getRoomInfo = async (req, res) => {
    const id = req.params.id;
    const { result, error } = await adminService.getRoomInfo(id);
    if (error) {
        return res.status(400).json({ error: error });
    }
    res.status(200).json({ message: result });
}

const getReportList = async (req, res) => {
    const { result, error } = await adminService.getReportList();
    if (error) {
        return res.status(400).json({ error: error });
    }
    res.status(200).json({ message: result });
}

const getReportOfHotel = async (req, res) => {
    const id = req.params.id;
    const { result, error } = await adminService.getReportOfHotel(id);
    if (error) {
        return res.status(400).json({ error: error });
    }
    res.status(200).json({ message: result });
}

export default {
    activeModerator,
    getModerators,
    getUnacceptedModerators,
    removeModerator,
    getRooms,
    getUnacceptedRooms,
    verifyAdmin,
    getRoomInfo,
    activeRoom,
    removeRoom,
    getReportList,
    getReportOfHotel
}
