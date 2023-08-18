import joi from "joi";
import jwt from "jsonwebtoken";
import { RoomType, Room, RoomAmenity, RoomImage } from "../databases/room.model.js";
import { Booking } from "../databases/booking.model.js";
import accountModel, { Customer, Moderator } from "../databases/account.model.js";
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

export const getPreBill = async (room_id, account_id) => {
    try {
        //let room = await Room.findById(room_id)
        //let user = await Customer.findOne( {account_id: account_id})
        
        let room = await Room.aggregate([
            {
                $addFields:
                {
                    new_id: { $toString: "$_id" }
                }
            },
            {   
                $match: 
                {
                    new_id: room_id
                }
            },
            {
                $lookup:
                {
                    from: "moderators",
                    localField: "hotel_id",
                    foreignField: "account_id",
                    pipeline: [
                        {
                            $project: {
                                "hotel_name": 1,
                                "address": 1,
                            }
                        },
                    ],
                    as: "hotel",
                }
            },
            {
                $project: {
                    "name": 1,
                    "hotel_id": 1,
                    "hotel_name": 1,
                    "price": 1,
                    "room_type": 1,
                    "location": 1,
                    "hotel": 1,
                }
            },
        ])
        let user = await Customer.aggregate([
            {
                $addFields:
                {
                    new_id: { $toObjectId: "$account_id" }
                }
            },
            {   
                $match: 
                {
                    account_id: account_id
                }
            },
            {
                $lookup:
                {
                    from: "accounts",
                    localField: "new_id",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $project: {
                                "wallet": 1,
                                "phone": 1,
                            }
                        },
                    ],
                    as: "account",
                }
            },
            {
                $project: {
                    "full_name": 1,
                    "account": 1
                }
            },
        ])


        let datas = []
        datas.push(room)
        datas.push(user)
        return { result: datas };
    } catch (error) {
        return { error: error.message };
    }
}

export const getReservation = async (id) => {
    try {
        /*
        let datas = await Booking.aggregate([
            {
                $addFields:
                {
                    new_hotel_id: { $toObjectId: "$hotel_id" }
                }
            },
            {
                $addFields:
                {
                    new_room_id: { $toObjectId: "$room_id" }
                }
            },
            {   
                $match: 
                {
                    account_id: id
                }
            },
            {
                $lookup:
                {
                    from: "hotel",
                    localField: "new_hotel_id",
                    foreignField: "_id",
                    as: "hotel",
                }
            },
            {
                $lookup:
                {
                    from: "room",
                    localField: "new_room_id",
                    foreignField: "_id",
                    as: "room",
                }
            }
        ])
        */
        return { result: datas };
    } catch (error) {
        return { error: error.message };
    }
}

export const getRoomInfo = async (id) => {
    try {
        /*
        let datas = await Room.findById(id)
        if (!datas) {
            return { error: `Invalid request` };
        }
        */
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
                    localField: "new_id",
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
                                            "account": 1
                                        }
                                    }
                                ],
                                as: "amenity",
                            }
                        },
                        {
                            $project: {
                                "amenity": 1,
                            }
                        }
                    ],
                    as: "amenity_list",
                }
            },
            
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
    static getPreBill = getPreBill;
    static getReservation = getReservation;
    static getRoomInfo = getRoomInfo;
}