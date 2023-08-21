import {Room, RoomAmenity} from "../databases/room.model.js";
import {Customer, Moderator} from "../databases/account.model.js";
import {Notification} from "../databases/notification.model.js";
import {Booking} from "../databases/booking.model.js";

export const getHotelList = async () => {
    try {
        let data = await Moderator.aggregate([
            {
                $match:
                    {
                        isAccepted: true
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
                                $match: {
                                    isAcepeted: true,
                                }
                            },
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
        return {result: data};
    } catch (error) {
        return {error: error.message};
    }
}


export const getHotelInfo = async (id) => {
    try {
        let data = await Moderator.aggregate([
            {
                $match:
                    {
                        account_id: id,
                        isAccepted: true
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
                                $match: {
                                    isAcepeted: true,
                                }
                            },
                            {
                                $project: {
                                    "name": 1,
                                    "price": 1,
                                    "area": 1,
                                    "bedroom": 1,
                                    "guest": 1,
                                    "isAcepeted": 1,
                                    "isBooked": 1,
                                    "room_type": 1,
                                }
                            }

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
        return {result: data};
    } catch (error) {
        return {error: error.message};
    }
}

export const getRoomAmenity = async (id) => {
    try {
        let data = await Room.aggregate([
            {
                $addFields:
                    {
                        new_id: {$toString: "$_id"}
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

        return {result: data};
    } catch (error) {
        return {error: error.message};
    }
}

export const getPreBill = async (room_id, account_id) => {
    try {
        //let room = await Room.findById(room_id)
        //let user = await Customer.findOne({account_id: account_id})

        let room = await Room.aggregate([
            {
                $addFields:
                    {
                        new_id: {$toString: "$_id"}
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
                        new_id: {$toObjectId: "$account_id"}
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


        let data = []
        data.push(room)
        data.push(user)
        return {result: data};
    } catch (error) {
        return {error: error.message};
    }
}

export const getReservation = async (id) => {
    try {
        let data = await Booking.aggregate([
                {
                    $addFields:
                        {
                            new_room_id: {$toObjectId: "$room_id"}
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
                            from: "moderators",
                            localField: "hotel_id",
                            foreignField: "account_id",
                            pipeline: [
                                {
                                    $project: {
                                        "_id": 0,
                                        "hotel_name": 1,
                                    }
                                },
                            ],
                            as: "hotels",
                        }
                },
                {
                    $lookup:
                        {
                            from: "rooms",
                            localField: "new_room_id",
                            foreignField: "_id",
                            pipeline: [
                                {
                                    $project: {
                                        "_id": 0,
                                        "name": 1,
                                        "price": 1,
                                        "room_type": 1,
                                        "image": 1,
                                    }
                                },
                            ],
                            as: "room",
                        }
                },
                {
                    $unwind: {
                        path: "$room",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $unwind: {
                        path: "$hotels",
                        preserveNullAndEmptyArrays: true
                    }

                },
                {
                    $project: {
                        "room_id": 1,
                        "hotel_id": 1,
                        "hotels": 1,
                        "room": 1,
                        "check_in": 1,
                        "check_out": 1,
                        "status": 1,
                        "updated_at": 1,
                    }
                }
            ]
        )
        // bring room info to booking
        data = data.map(
            (item) => {
                if (item.room) {
                    item.room_name = item.room.name;
                    item.room_price = item.room.price;
                    item.room_type = item.room.room_type;
                    item.thumbnail = item.room.image[0];
                    delete item.room;
                }
                if (item.hotels) {
                    item.hotel_name = item.hotels.hotel_name;
                    delete item.hotels;
                }
                return item;
            }
        );
        return {result: data};
    } catch (error) {
        return {error: error.message};
    }
}

export const getRoomInfo = async (id) => {
    try {
        /*
        let data = await Room.findById(id)
        if (!data) {
            return { error: `Invalid request` };
        }
        */
        let data = await Room.aggregate([
            {
                $addFields:
                    {
                        new_id: {$toString: "$_id"}
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
                                                    "_id": 0,
                                                    "name": 1,
                                                    "account": 1
                                                }
                                            }
                                        ],
                                        as: "amenity",
                                    }
                            },
                            {
                                $unwind: "$amenity"
                            },
                            {
                                $project: {
                                    "_id": 0,
                                    "amenity": 1,
                                }
                            }
                        ],
                        as: "amenity_list",
                    }
            },

        ])
        return {result: data};
    } catch (error) {
        return {error: error.message};
    }
}

export const getNotificationList = async (id) => {
    const data = await Notification.find({to_id: id})
        .select({
            _id: 1,
            booking_id: 1,
            updated_at: 1,
            status: 1,
            title: 1,
            content: 1
        })
        .sort({updated_at: -1})
        .lean();
    if (!data) {
        return {error: "Notification not found"};
    }
    return {result: data};
}


export default class customerService {
    static getHotelList = getHotelList;
    static getNotificationList = getNotificationList;
    static getHotelInfo = getHotelInfo;
    static getRoomAmenity = getRoomAmenity;
    static getPreBill = getPreBill;
    static getReservation = getReservation;
    static getRoomInfo = getRoomInfo;
}
