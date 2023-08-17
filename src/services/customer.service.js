import joi from "joi";
import db from "./db.service.js";
import jwt from "jsonwebtoken";
import { RoomType, Room, RoomAmenity, RoomImage } from "../databases/room.model.js";
import { Customer, Moderator } from "../databases/account.model.js";

export const getHotelList = async () => {
    try {
        const data = await Moderator.aggregate([
            {
                $lookup:
                    {
                        from: "room",
                        localField: "account_id",
                        foreignField: "hotel_id",
                        as: "room"
                    }
            }
        ]
            
        );
        return { result: data };
    } catch (error) {
        return { error: error.message };
    }
}

export default class customerService {
    static getHotelList = getHotelList;
}