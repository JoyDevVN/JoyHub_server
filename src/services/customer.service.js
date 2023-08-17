import joi from "joi";
import jwt from "jsonwebtoken";
import { RoomType, Room, RoomAmenity, RoomImage } from "../databases/room.model.js";
import { Customer, Moderator } from "../databases/account.model.js";
import { ObjectId } from "mongoose";

export const getHotelList = async (id) => {
    try {
        let datas = await Moderator.aggregate([
            {   
                $match: 
                {
                    account_id: id,
                }
            },
            {
                $lookup:
                {
                    from: "rooms",
                    localField: "account_id",
                    foreignField: "hotel_id",
                    as: "rooms",
                },
                
            },
            {
                $lookup:
                {
                    from: "report",
                    localField: "account_id",
                    foreignField: "hotel_id",
                    as: "review",
                },
            }
        ])
        return { result: datas };
    } catch (error) {
        return { error: error.message };
    }
}

export const getRoomAmenity = async (id) => {
    try {
        let datas = await Room.aggregate([
            {   
                $match: 
                {
                    _id: {  $eq: {$toObjectId: id} }
                }
            },
            {
                $lookup:
                {
                    from: "room_amenity",
                    localField: "_id",
                    foreignField: "room_id",
                    as: "room_amenity",
                }
            }
        ])

        return { result: datas };
    } catch (error) {
        return { error: error.message };
    }
}

export default class customerService {
    static getHotelList = getHotelList;
    static getRoomAmenity = getRoomAmenity;
}