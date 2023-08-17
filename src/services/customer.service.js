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
                    from: "room_types",
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
                    as: "room_types"
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
                    "room_types": 1,
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
                    from: "room_types",
                    localField: "account_id",
                    foreignField: "hotel_id",
                    pipeline: [
                        {
                            $addFields:
                            {
                                new_id: { $toString: "$_id" }
                            }
                            
                        },
                        {
                            $lookup:
                            {
                                from: "rooms",
                                localField: "new_id",
                                foreignField: "room_type_id",
                                pipeline: [
                                    {
                                        $addFields:
                                        {
                                            new_room_id: { $toString: "$_id" }
                                        }
                                        
                                    },
                                    {
                                        $lookup:
                                        {
                                            from: "room_amenity",
                                            localField: "new_room_id",
                                            foreignField: "room_id",
                                            pipeline: [
                                                {
                                                    $lookup:
                                                    {
                                                        from: "amenity",
                                                        localField: "amenity_id",
                                                        foreignField: "amenity_id",
                                                        pipeline: [
                                                            {
                                                                $project: {
                                                                    "name": 1,
                                                                }
                                                            },
                                                        ],
                                                        as: "amenity",
                                                    },
                                                },
                                                {
                                                    $project: {
                                                        "amenity": 1,
                                                    }
                                                },
                                            ],
                                            as: "amenity",
                                        },
                                    },
                                    {
                                        $project: {
                                            "name": 1,
                                            "isBooked": 1,
                                            "amenity": 1,
                                        }
                                    },
                                ],
                                as: "room_list",
                            },
                            
                        },
                        {
                            $project: {
                                "name": 1,
                                "room_list": 1,
                                "price": 1,
                                "bedroom": 1,
                                "bathroom": 1,
                                "area": 1,
                                "guest": 1,
                            }
                        },
                    ],
                    as: "rooms"
                }
            },
            {
                $lookup:
                {
                    from: "report",
                    localField: "account_id",
                    foreignField: "hotel_id",
                    as: "review",
                },
            },
            {
                $project: {
                    "hotel_name": 1,
                    "rooms": 1,
                    "address": 1,
                    "description": 1,
                    "review": 1,
                }
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
}