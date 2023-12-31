import {Room, RoomAmenity} from "../databases/room.model.js";
import {Customer, Moderator, Account} from "../databases/account.model.js";
import {Notification, Rating, Report} from "../databases/notification.model.js";
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
                                        "price": 1,
                                        "image": 1
                                    }
                            }
                        ],
                        as: "rooms"
                    }
            },
            {
                $lookup: {
                    from: "ratings",
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
                    "hotel_id": "$account_id",
                    "image": 1,
                }
            },
        ])
        return {result: data};
    } catch (error) {
        return {error: error.message};
    }
}

// get hotel info with room list and review list
// @param: id: hotel_id
// @param: check_in: check in date in iso format
// @param: check_out: check out date in iso format
export const getHotelInfo = async (id, check_in, check_out) => {
    try {
        let data = await Moderator.aggregate([
            {
                $addFields:
                    {
                        new_id: {$toString: "$_id"}
                    }
            },
            {
                $match:
                    {
                        new_id: id,
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
                                $addFields:
                                    {
                                        new_id: {$toString: "$_id"}
                                    }
                            },
                            {
                                $match: {
                                    isAcepeted: true,
                                }
                            },
                            {
                                $lookup:
                                    {
                                        from: "room_amenities",
                                        localField: "new_id",
                                        foreignField: "room_id",
                                        pipeline: [
                                            {
                                                $lookup:
                                                    {
                                                        from: "amenities",
                                                        localField: "amenity_id",
                                                        foreignField: "amenity_id",
                                                        pipeline: [
                                                            {
                                                                $project: {
                                                                    "_id": 0,
                                                                    "name": 1,
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
                                    "amenity_list": 1,
                                    "image": 1,
                                }
                            }

                        ],
                        as: "rooms",
                    },
            },
            {
                $lookup: {
                    from: "ratings",
                    localField: "account_id",
                    foreignField: "hotel_id",
                    pipeline: [
                        {
                            $lookup:
                                {
                                    from: "customers",
                                    localField: "customer_id",
                                    foreignField: "account_id",
                                    pipeline: [
                                        {
                                            $project:
                                                {
                                                    "full_name": 1,
                                                }
                                        }
                                    ],
                                    as: "customer"
                                }
                        },
                        {
                            $project: {
                                "star": 1,
                                "customer": 1,
                                "content": 1,

                            }
                        },
                    ],
                    as: "reviews"
                }
            },
        ])
        //console.log(`Rooms: length: ${data[0].rooms.length}`)
        // check if each room in the hotel is available
        let bookings = await Booking.aggregate([
            {
                $match: {
                    $and: [
                        {
                            status: {
                                $in: ["approved", "waiting"]
                            }
                        },
                        {
                            hotel_id: id
                        }
                    ]
                }
            },
            {
                $project: {
                    "room_id": 1,
                    "check_in": 1,
                    "check_out": 1,
                }
            }
        ])
        // mark room isBooked
        data = data.map(
            (item) => {
                item.rooms = item.rooms.map(
                    (room) => {
                        let isBooked = false;
                        bookings.forEach(
                            (booking) => {
                                check_in = new Date(check_in);
                                check_out = new Date(check_out);
                                // booking.check_in = new Date(booking.check_in);
                                // booking.check_out = new Date(booking.check_out);
                                if (booking.room_id === room._id.toString()) {
                                    if (check_in <= booking.check_out && check_out >= booking.check_in) {
                                        isBooked = true;
                                    }
                                    else if (check_in <= booking.check_in && check_out >= booking.check_out) {
                                        isBooked = true;
                                    }
                                    else if (check_in >= booking.check_in && check_out <= booking.check_out) {
                                        isBooked = true;
                                    }
                                    else if (check_in <= booking.check_in && check_out <= booking.check_out) {
                                        isBooked = true;
                                    }
                                }
                            }
                        )
                        room.isBooked = isBooked;
                        return room;
                    }
                )
                return item;
            }
        )
        console.log(JSON.stringify(data, null, 2));
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
                        localField: "new_id",
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
                    "image": 1
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
        let data = {room, user}
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
                                        "hotel_name": 1,
                                        "address": 1,
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
                },
                {
                    $sort: {
                        updated_at: -1,
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
                    item.thumbnail = (item.room.image && item.room.image.length > 0) ? item.room.image[0] : "";
                    delete item.room;
                }
                if (item.hotels) {
                    item.hotel_name = item.hotels.hotel_name;
                    item.address = item.hotels.address;
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
                        from: "room_amenities",
                        localField: "new_id",
                        foreignField: "room_id",
                        pipeline: [
                            {
                                $lookup:
                                    {
                                        from: "amenities",
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

// add review from this customer to the hotel
export const rating = async (booking_id, customer_id, star, comment) => {
    try {
        // check if this booking is completed
        console.log(booking_id);
        let booking = await Booking.findById(booking_id);
        if (!booking) {
            return {error: "Booking not found"};
        }
        if (booking.status !== "completed") {
            return {error: "Booking is not completed"};
        }
        let review = new Rating({
            hotel_id: booking.hotel_id,
            room_id: booking.room_id,
            customer_id: customer_id,
            star: star,
            content: comment,
        })
        await review.save();
        return {result: "Rating success"};
    } catch (error) {
        return {error: error.message};
    }
}

export const report = async (customer_id, booking_id, content) => {
    try {
        // get info of booking by booking_id
        let booking = await Booking.findById(booking_id);
        if (booking.status !== "completed") {
            return {error: "Booking is not completed"};
        }
        // get the name of the hotel and customer
        let hotel = await Moderator.findOne({account_id: booking.hotel_id}, {hotel_name: 1});
        let customer = await Account.findById(customer_id, {username: 1});
        // generate title of the report from content
        let title = `Report from ${customer.username}`;

        let report = new Report({
            booking_id: booking_id,
            hotel_id: booking.hotel_id,
            room_id: booking.room_id,
            customer_id: customer_id,
            title: title,
            content: content,
        })
        console.log(`Report: ${JSON.stringify(report, null, 2)}`);
        await report.save();
        return {result: "Report success"};
    }
    catch (error) {
        return {error: error.message};
    }
}

const updateInfo = async (id, full_name, email, phone) => {
    const data1 = await Account.findOneAndUpdate(
        {
            _id: id,
        },
        {
            email: email,
            phone: phone
        }
    ).lean();
    if (!data1) {
        return {error: "This account does not exist"};
    }
    const data2 = await Customer.findOneAndUpdate(
        {
            account_id: id,
        },
        {
            full_name: full_name,
        }
    );
    if (!data2) {
        return {error: "This customer does not exist"};
    }
    return {result: "success"};
};

const cancelRoom = async (id, hotel_id, room_id) => {
    const data = await Booking.findOneAndUpdate(
        {
            hotel_id: hotel_id,
            room_id: room_id,
            account_id: id
        },
        {
            status: "canceled",
        }
    ).lean();
    if (!data) {
        return {error: "This account did not book this room"};
    }
    return {result: "success"};
};

export const getUserInfo = async (id) => {
    try {
        /*
        let data = await Room.findById(id)
        if (!data) {
            return { error: `Invalid request` };
        }
        */
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
                        account_id: id
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
                                    "email": 1,
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
        return {result: user};
    } catch (error) {
        return {error: error.message};
    }
}

export default class customerService {
    static getHotelList = getHotelList;
    static getNotificationList = getNotificationList;
    static getHotelInfo = getHotelInfo;
    static getRoomAmenity = getRoomAmenity;
    static getPreBill = getPreBill;
    static getReservation = getReservation;
    static getRoomInfo = getRoomInfo;
    static rating = rating;
    static report = report;
    static updateInfo = updateInfo;
    static cancelRoom = cancelRoom;
    static getUserInfo = getUserInfo;
}
