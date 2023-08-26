import { RoomType, Room, RoomAmenity, RoomImage, AmenityModel } from "../databases/room.model.js";
import { Booking, Bill } from "../databases/booking.model.js";
import { Account, Moderator } from "../databases/account.model.js";
import { Notification } from "../databases/notification.model.js";


export const getRoomType = async (id) => {
    try {
        const roomType = await RoomType.find();
        return { result: roomType };
    } catch (error) {
        return { error: error.message };
    }
}


export const updateRoomTypeName = async (data) => {
    try {
        // only update which data requested
        const result = await RoomType.findOneAndUpdate(
            {
                _id: data.room_type_id,
                hotel_id: data.hotel_id
            },
            {
                name: data.name,
                description: data.description,
                price: data.price,
                number_of_bedroom: data.number_of_bedroom,
                number_of_bathroom: data.number_of_bathroom,
                number_of_guest: data.number_of_guest,
                area: data.area
            },
            { new: true }
        );
        if (!result) {
            return { error: error };
        }
        return { result: `successful` };
    }
    catch (err) {
        return { error: err.message };
    }
}

export const deleteRoomType = async (room_type_id) => {
    try {
        // only delete which data requested
        const result = RoomType.findOneAndDelete({ _id: room_type_id });
        if (!result) {
            return { error: `Invalid request` };
        }
        return { result: `successful` };
    } catch (error) {
        return { error: error.message };
    }
}

export const getRoomInfo = async () => {
    try {
        const room = await Room.find();
        return { result: room };
    } catch (error) {
        return { error: error.message };
    }
}

const insertNewRoomAmenity = async (data, roomid) => {

    try {
        for (let i = 0; i < data.length; ++i) {
            console.log("AMDATA:" + data[i] + "ID" + roomid)
            await RoomAmenity.create({ amenity_id: data[i]["amenity_id"], room_id: roomid });
        }

    } catch (err) {
        return { error: err.message };
    }

}

export const insertNewRoom = async (hotel_id, data) => {
    const { chosenAmenities, ...roomData } = data

    try {
        try {
            const result = await Room.create({ ...roomData, hotel_id: hotel_id });
            await insertNewRoomAmenity(chosenAmenities, result._id)
        } catch (error) {
            console.error('Error inserting data', error);
        }
        return { result: `Inserted ${data.name} into Room` };
    }
    catch (err) {
        return { error: err.message };
    }
}

export const updateRoomInfo = async (id, data) => {
    try {
       
  
        const result = await Room.findOneAndUpdate(
            {
                _id: id
            },
            {
                bedroom : data.bed,
                guest : data.people,
                area : data.area,
                description : data.description
            }
        );
        if (!result) {
            return { error: `Invalid request` };
        }
        return { result: `The room info has been updated successfully!` };
    }
    catch (err) {
        return { error: err.message };
    }
}

export const deleteRoom = async (id) => {
    try {
        const result = await Room.findOneAndDelete({
            _id: id,
        });
        if (!result) {
            return { error: `Invalid request` };
        }
        return { result: `successful` };
    }
    catch (err) {
        return { error: err.message };
    }
}

export const getHotelInfo = async () => {
    const data = await Moderator.find().lean();
    if (!data) {
        return { error: `Invalid request` };
    }
    return { result: data };
}

export const getHotelById = async (id) => {
    const data = await Moderator.findOne({
        account_id: id,
    }).lean();
    if (!data) {
        return { error: `Invalid request` };
    }
    return { result: data };
}

export const getHotelRoomList = async (id) => {
    let result = await Room.aggregate([
        {
            $addFields: {
                'roomId': { $toString: '$_id' }
            }
        }, {
            $lookup: {
                from: 'room_amenities',
                localField: 'roomId',
                foreignField: 'room_id',
                as: 'amenities'
            }
        }, {
            $lookup: {
                from: 'amenities',
                localField: 'amenities.amenity_id',
                foreignField: 'amenity_id',
                as: 'amenitiesInfo'
            }
        }, {
            $match: {
                hotel_id: id,
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                room_type: 1,
                bedroom: 1,
                area: 1,
                description: 1,
                bathroom: 1,
                isAccepted: 1,
                isBooked: 1,
                price: 1,
                guest: 1,
                image: 1,
                chosenAmenities: 1,
                amenities: '$amenitiesInfo'
            }
        }
    ])
    console.log(result);
    if (!result) {
        return { error: "Internal error" };
    }
    return { result: result };


}

export const getHotelRoom = async (hotel_id, room_id) => {
    let data = await Room.findById(room_id);
    if (!data) {
        return { error: `Invalid request` };
    }
    const details = await RoomType.findOne({
        _id: data.room_type_id,
    });
    console.log(JSON.stringify(details, null, 2));
    // combine data
    data = {
        ...data._doc,
        room_type: details.name,
        guest: details.guest,
        bedroom: details.bedroom,
        bathroom: details.bathroom,
        area: details.area,
        price: details.price,
        description: details.description,
    }
    if (!data) {
        return { error: `Invalid request` };
    }
    return { result: data };
}

export const getAllAmenity = async () => {
    let data = await AmenityModel.find();
    console.log(data)
    if (!data) {
        return { error: `Invalid request` };
    }

    return { result: data };
}

export const addAmenity = async () => {
    let newAmenity = new AmenityModel({
        name: "River",
        amenity_id: "A12",
    })
    await newAmenity.save();

}

export const getVerify = async (hotel_id) => {
    let data = await Booking.aggregate([
        {
            $match: {
                hotel_id: hotel_id,
                status: "waiting",
            },
        },
        {
            $addFields: {
                'roomObjId': { $toObjectId: '$room_id' }
            }
        },
        {
            $addFields: {
                'accountObjId': { $toObjectId: '$account_id' }
            }
        },
        {
            $lookup: {
                from: "customers",
                localField: "account_id",
                foreignField: "account_id",
                as: "customer",
            },
        },
        {
            $lookup: {
                from: "accounts",
                localField: "accountObjId",
                foreignField: "_id",
                as: "acc",
            },
        },
        {
            $lookup: {
                from: "rooms",
                localField: "roomObjId",
                foreignField: "_id",
                as: "room",
            },
        },
        {
            $project: {
                image: '$room.image',
                room: '$room.name',
                room_id: '$room._id',
                customer: '$customer.full_name',
                checkin: '$check_in',
                checkout: '$check_out',
                phone: '$acc.phone',
                customer_id: '$account_id'
            }
        }
    ]);


    if (!data) {
        return { error: `Invalid request` };
    }

    return { result: data };
}

export const acceptVerify = async (id) => {

    let res = await Booking.findOneAndUpdate(
        { _id: id },
        { $set: { status: "approved" } }
    ).lean();

    if (!res) {
        return { error: `Invalid request` };
    }

    // update notification of this booking
    let notification = await Notification.findOneAndUpdate({
        booking_id: id,
    },
        {
            $set: {
                from_id: res.hotel_id,
                to_id: res.account_id,
                for: "customer",
                title: "Booking accepted",
                content: "Your booking has been accepted",
                status: "accepted",
                room_id: res.room_id,
                isRead: false,
            }
        }).lean();
    if (!notification) {
        return { error: `Error when create nofication` };
    }
    return { result: res };
}

export const declineVerify = async (id) => {

    let res = await Booking.updateOne(
        { _id: id },
        { $set: { status: "rejected" } }
    )

    if (!res) {
        return { error: `Invalid request` };
    }

    // update notification of this booking
    let notification = await Notification.findOneAndUpdate({
        booking_id: id,
    },
        {
            $set: {
                from_id: res.hotel_id,
                to_id: res.account_id,
                for: "customer",
                title: "Booking declined",
                content: "Your booking has been declined",
                status: "rejected",
                room_id: res.room_id,
                isRead: false,
            }
        }).lean();
    if (!notification) {
        return { error: `Error when create nofication` };
    }

    return { result: res };
}




export const removeVerify = async (id) => {
    console.log("BOOKING:", id)
    try {
        const result = await Booking.findOneAndDelete({
            _id: id,
        });
        if (!result) {
            return { error: `Invalid request` };
        }

        return { result: `successful` };
    }
    catch (err) {
        return { error: err.message };
    }

}



export const getCheckin = async (hotel_id) => {
    let data = await Booking.aggregate([
        {
            $match: {
                hotel_id: hotel_id,
                status: "approved",
            },
        },
        {
            $addFields: {
                'roomObjId': { $toObjectId: '$room_id' }
            }
        },
        {
            $addFields: {
                'accountObjId': { $toObjectId: '$account_id' }
            }
        },
        {
            $lookup: {
                from: "customers",
                localField: "account_id",
                foreignField: "account_id",
                as: "customer",
            },
        },
        {
            $lookup: {
                from: "accounts",
                localField: "accountObjId",
                foreignField: "_id",
                as: "acc",
            },
        },
        {
            $lookup: {
                from: "rooms",
                localField: "roomObjId",
                foreignField: "_id",
                as: "room",
            },
        },
        {
            $project: {

                image: '$room.image',
                room: '$room.name',
                customer: '$customer.full_name',
                checkin: '$check_in',
                phone: '$acc.phone'
            }
        }
    ]);

    if (!data) {
        return { error: `Invalid request` };
    }


    return { result: data };
}

export const checkin = async (id) => {

    let res = await Booking.findByIdAndUpdate({
        _id: id,
    },
        {
            $set: {
                status: "staying",
            }
        }).lean();

    if (!res) {
        return { error: `Invalid request` };
    }


    // update notification of this booking
    let notification = await Notification.findOneAndUpdate({
        booking_id: id,
    },
        {
            $set: {
                from_id: res.hotel_id,
                to_id: res.account_id,
                for: "customer",
                title: "New checkin",
                content: "You have been checked in",
                status: "accepted",
                room_id: res.room_id,
                isRead: false,
            }
        }).lean();

    if (!notification) {
        return { error: `Error when create nofication` };
    }

    return { result: res };
}




export const getCheckout = async (hotel_id) => {
    let data = await Booking.aggregate([
        {
            $match: {
                hotel_id: hotel_id,
                status: "staying",
            },
        },
        {
            $addFields: {
                'roomObjId': { $toObjectId: '$room_id' }
            }
        },
        {
            $addFields: {
                'accountObjId': { $toObjectId: '$account_id' }
            }
        },
        {
            $lookup: {
                from: "customers",
                localField: "account_id",
                foreignField: "account_id",
                as: "customer",
            },
        },
        {
            $lookup: {
                from: "accounts",
                localField: "accountObjId",
                foreignField: "_id",
                as: "acc",
            },
        },
        {
            $lookup: {
                from: "rooms",
                localField: "roomObjId",
                foreignField: "_id",
                as: "room",
            },
        },
        {
            $project: {

                image: '$room.image',
                room: '$room.name',
                customer: '$customer.full_name',
                checkout: '$check_out',
                phone: '$acc.phone'
            }
        }
    ]);


    if (!data) {
        return { error: `Invalid request` };
    }

    return { result: data };
}

export const checkout = async (id) => {

    let res = await Booking.findByIdAndUpdate(
        { _id: id },
        { $set: { status: "completed" } }
    )

    if (!res) {
        return { error: `Invalid request` };
    }

    // update notification of this booking
    let notification = await Notification.findOneAndUpdate({
        booking_id: id,
    },
        {
            $set: {
                from_id: res.hotel_id,
                to_id: res.account_id,
                for: "customer",
                title: "New checkout",
                content: "You have been checked out",
                status: "accepted",
                room_id: res.room_id,
                isRead: false,
            }
        }).lean();

    if (!notification) {
        return { error: `Error when create nofication` };
    }

    return { result: res };
}


export const getModInfo = async (id) => {
    const data = await Moderator.aggregate([
        {
            $addFields: {
                'acc_id': { $toObjectId: '$account_id' }
            }
        },
        {
            $lookup: {
                from: "accounts",
                localField: "acc_id",
                foreignField: "_id",
                as: "acc",
            },
        },
        {
            $match:{
                account_id : id
            }
        },
        {
            $project: {
                hotel_name: 1,
                address: 1,
                description: 1,
                owner_name: 1,
                isAccepted: 1,
                wallet : "$acc.wallet",
                phone: "$acc.phone",
                email: "$acc.email",
                username: "$acc.username",
                image: 1,
            }
        }
    ]);


    if (!data) {
        return { error: `Invalid request` };
    }
    return { result: data };
}

export const editInfo = async (id, newinfo) => {
    let res = null;
    if (newinfo["newImage"] == true) {
        res = await Moderator.updateOne(
            { account_id: id },
            {
                $set: {
                    hotel_name: newinfo["hotel_name"],
                    address: newinfo["address"],
                    description: newinfo["description"],
                    image: newinfo["image"],
                }
            }
        )
    }
    else {
        res = await Moderator.updateOne(
            { account_id: id },
            {
                $set: {
                    hotel_name: newinfo["hotel_name"],
                    address: newinfo["address"],
                    description: newinfo["description"],
                }
            }
        )
    }

    if (!res) {
        return { error: `Invalid request` };
    }

    res = await Account.findByIdAndUpdate({ id }, { $set: { phone: newinfo["phone"] } })
    if (!res) {
        return { error: `Invalid request` };
    }

    return { result: res };
}

export const getNotifications = async (id) => {
    let notification = await Notification.find({ to_id: id }).lean();
    console.log("NOTI:", notification)
    if (notification)
        return { result: notification }
}

export const sendNotifications = async (id,noti) =>{
    let res = null
  
    try{
        res = await Notification.create({ ...noti, from_id: id });
  
    }catch(e)
    {
        console.log("ERROR: ", e)
    }
    return {result :res}
}

export const withdraw = async (id, money) => {
    let res = await Account.findByIdAndUpdate(
        { _id: id },
        { $set: { wallet: money } }
    )

    if (!res) {
        return { error: `Invalid request` };
    }

    return { result: res };

}

export default class modService {
    // Room-type
    // static getRoomType = getRoomType;
    // static updateRoomTypeName = updateRoomTypeName;
    // static deleteRoomType = deleteRoomType;
    // Room
    static insertNewRoom = insertNewRoom;
    static getRoomInfo = getRoomInfo;
    static updateRoomInfo = updateRoomInfo;
    static deleteRoom = deleteRoom;
    // Hotel
    static getHotelInfo = getHotelInfo;
    static getHotelById = getHotelById;
    static getHotelRoomList = getHotelRoomList;
    static getHotelRoom = getHotelRoom;
    //Amenity
    static getAllAmenity = getAllAmenity;
    static addAmenity = addAmenity;
    //MainScreen
    static getVerify = getVerify;
    static acceptVerify = acceptVerify;
    static declineVerify = declineVerify;
    static removeVerify = removeVerify;

    static getCheckin = getCheckin;
    static checkin = checkin;

    static getCheckout = getCheckout;
    static checkout = checkout
    //user info
    static getModInfo = getModInfo;
    static editInfo = editInfo

    //notifications
    static getNotifications = getNotifications  
    static sendNotifications = sendNotifications

    //withdraw
    static withdraw = withdraw
}
