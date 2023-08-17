import customerService from "../services/customer.service.js"

export const getHotelList = async (req, res) => {
    const { result, error } = await customerService.getHotelList();
    if (error) {
        return res.status(401).json({ message: error });
    }
    res.status(200).json({ message: result });
};

export default class modController {
    static getHotelList = getHotelList;
}
