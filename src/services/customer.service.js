import joi from "joi";
import jwt from "jsonwebtoken";
import { RoomType, Room, RoomAmenity, RoomImage } from "../databases/room.model.js";
import { Customer, Moderator } from "../databases/account.model.js";
import { ObjectId } from "mongoose";

export const getHotelList = async () => {
    try {
        let datas = await Moderator.aggregate([
            {
                $lookup: 
                {
                    from: "rooms",
                    localField: "account_id",
                    foreignField: "hotel_id",
                    pipeline: [
                        {
                            $project: 
                            {
                                "price": 1
                            }
                        }
                    ],
                    as: "rooms"
                }
            },
            {
                $lookup: {
                    from: "report",
                    localField: "account_id",
                    foreignField: "hotel_id",
                    pipeline: [
                        {
                            $project: {
                                "star": 1,
                            }
                        },
                    ],
                    as: "reviews"
                  }
            },
            {
                $project: {
                    "hotel_name": 1,
                    "address": 1,
                    "reviews": 1,
                    "rooms": 1,
                }
            },
        ])
        return { result: datas };
    } catch (error) {
        return { error: error.message };
    }
}


export const getHotelInfo = async (id) => {
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
                    pipeline: [
                        {
                            $project: {
                                "name": 1,
                                "price": 1,
                                "area": 1,
                                "bedroom": 1,
                                "guest": 1,
                                "isAcepted": 1,
                                "isBooked": 1,
                                "room_type": 1,
                            }
                        },
                    ],
                    as: "rooms",
                },
            },
            {
                $lookup:
                {
                    from: "report",
                    localField: "account_id",
                    foreignField: "hotel_id",
                    pipeline: [
                        {
                            $project: {
                                "customer_id": 1,
                                "comment": 1,
                                "star": 1,
                            }
                        },
                    ],
                    as: "review",
                },
            },
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
                $addFields:
                {
                    new_id: { $toString: "$_id" }
                }
            },
            {   
                $match: 
                {
                    new_id: id
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

export const getNotification = async () => {
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
    static getHotelInfo = getHotelInfo;
    static getRoomAmenity = getRoomAmenity;
    static getNotification = getNotification;
}