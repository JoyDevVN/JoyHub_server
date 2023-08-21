import { ObjectId, Schema, model } from "mongoose";

const roomTypeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    hotel_id: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    guest: {
        type: Number,
        required: true,
    },
    bedroom: {
        type: Number,
        required: true,
    },
    bathroom: {
        type: Number,
        required: true,
    },
    area: {
        type: Number,
        required: true,
    },
});

const roomSchema = new Schema({
    hotel_id: {
        type: String,
        required: true,
    },
    room_type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    isAcepeted: {
        type: Boolean,
        default: false,
    },
    isBooked: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true,
    },
    guest: {
        type: Number,
        required: true,
    },
    bedroom: {
        type: Number,
        required: true,
    },
    bathroom: {
        type: Number,
        required: true,
    },
    area: {
        type: Number,
        required: true,
    },
    image:{
        type: Array,
    }
});

const amenitySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    amenity_id: {
        type: String,
        required: true,
    },
});

const roomAmenitySchema = new Schema({
    room_id: {
        type: String,
        required: true,
    },
    amenity_id: {
        type: String,
        required: true,
    },
});

const roomImageSchema = new Schema({
    room_id: {
        type: String,
        required: true,
    },
    hotel_id: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});


export const RoomType = model("room_type", roomTypeSchema);
export const Room = model("room", roomSchema);
export const AmenityModel = model("amenity", amenitySchema);
export const RoomAmenity = model("room_amenity", roomAmenitySchema);
export const RoomImage = model("room_image", roomImageSchema);

export default {
    RoomType,
    Room,
    AmenityModel,
    RoomAmenity,
    RoomImage,
}
