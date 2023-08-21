import { RoomType, Room, RoomAmenity, RoomImage, AmenityModel } from "../databases/room.model.js";
import { Moderator } from "../databases/account.model.js";

export const getRoomType = async (id) => {

    // try {
    //     const roomType = await RoomType.aggregate([
    //         {
    //             $match:
    //             {
    //                 hotel_id: id,
    //             },
    //         }
    //     ])
    //     return roomType
    // } catch (error) {
    //     return { error: error.message };
    // }

    try {
        const roomType = await RoomType.find();
        return { result: roomType };
    } catch (error) {
        return { error: error.message };
    }
}

const roomTypeValidator = (data) => {
    const rule = joi.object({
        hotel_id: joi.string().required(),
        room_type_id: joi.string().required(),
        name: joi.string().required(),
    });
    const result = rule.validate(data);
    if (result.error) {
        throw new Error(result.error.details[0].message);
    }
}

export const insertRoomType = async (data) => {
    try {
        // console.log(JSON.stringify(data, null, 2));
        const roomType = new RoomType(data);
        await roomType.save();
        return { result: `Inserted ${data.name} into data` };
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

const roomValidator = (data) => {
    const rule = joi.object({
        hotel_id: joi.string().required(),
        room_id: joi.string().required(),
        room_type_id: joi.string().required(),
        name: joi.string().required(),
        number_of_guest: joi.string().required(),
        number_of_bedroom: joi.string().required(),
        number_of_bathroom: joi.string().required(),
        area: joi.string().required(),
        price: joi.string().required(),
    });
    const result = rule.validate(data);
    if (result.error) {
        throw new Error(result.error.details[0].message);
    }
}

export const insertNewRoom = async (hotel_id, data) => {
    try {
        try {
            const result = await Room.create({...data,hotel_id: hotel_id});
            console.log('Data inserted:', result.insertedId);
        } catch (error) {
            console.error('Error inserting data', error);
        }
        return { result: `Inserted ${data.name} into Room` };
    }
    catch (err) {
        return { error: err.message };
    }
}

export const updateRoomInfo = async (data) => {
    try {
        const room_type = await RoomType.findOne({
            name: data.room_type,
            hotel_id: data.hotel_id
        }).exec();
        data.room_type_id = room_type._id;
        const result = await Room.findOneAndUpdate(
            {
                _id: data.room_id,
                hotel_id: data.hotel_id
            },
            {
                name: data.name,
                room_type_id: data.room_type_id,
                isAccepted: data.isAccepted,
                isBooked: data.isBooked,
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

export const deleteRoom = async (data) => {
    try {
        // const { data, error } = await db
        //     .from("room")
        //     .delete()
        //     .eq("room_id", data.room_id).eq("room_type_id", data.room_type_id).eq("hotel_id", data.hotel_id)
        // if (error) {
        //     return { error: error.message };
        // }
        // return { result: data };
        console.log("REMOVE DATA: ",data["room_id"])
        const result = await Room.findOneAndDelete({
            _id: data._id,
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
    // const { data, error } = await db
    //     .from("moderator")
    //     .select();
    // if (error) {
    //     return { error: error.message };
    // }
    const data = await Moderator.find();
    if (!data) {
        return { error: `Invalid request` };
    }
    return { result: data };
}

export const getHotelById = async (id) => {
    // const { data, error } = await db
    //     .from("moderator")
    //     .select()
    //     .match({
    //         account_id: id,
    //     })
    // if (error) {
    //     return { error: error.message };
    // }
    const data = await Moderator.findOne({
        account_id: id,
    });
    if (!data) {
        return { error: `Invalid request` };
    }
    return { result: data };
}

export const getHotelRoomList = async (id) => {
    //console.log(id)
    let result = await Room.find({hotel_id: (id)})
  

    // let result = await Moderator.aggregate([
    //     {
    //         $lookup: {
    //             from: "rooms",
    //             localField: "account_id",
    //             foreignField: "hotel_id",
    //             as: "rooms",
    //         },
    //     },
    //     {
    //         $unwind: "$rooms",
    //     },
    //     {
    //         $addFields: {
    //             "rooms.type_id" : {$toObjectId: "$rooms.room_type_id"}
    //         },

    //     },
    //     {
    //         $lookup: {
    //             from: "room_types",
    //             localField: "rooms.type_id",
    //             foreignField: "_id",
    //             as: "room_type",
    //         },
    //     },
    //     {
    //         $match: {
    //             account_id: id,
    //         },
    //     },

    // ]);
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
        amenity_id : "A12",
    })
    await newAmenity.save();
 
}


export default class modService {
    // Room-type
    static getRoomType = getRoomType;
    static insertRoomType = insertRoomType;
    static updateRoomTypeName = updateRoomTypeName;
    static deleteRoomType = deleteRoomType;
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
    static addAmenity  = addAmenity;
}
