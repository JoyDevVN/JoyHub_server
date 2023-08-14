import { Schema, model } from "mongoose";
const bookingSchema = new Schema({
    hotel_id: {
        type: String,
        required: true,
    },
    room_id: {
        type: String,
        required: true,
    },
    room_type_id: {
        type: String,
        required: true,
    },
    account_id: {
        type: String,
        required: true,
    },
    room_type_id: {
        type: String,
        required: true,
    },
    check_in: {
        type: Date,
        required: true,
    },
    check_out: {
        type: Date,
        required: true,
    },
});

const billSchema = new Schema({
    customer_id: {
        type: String,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    isCanceled: {
        type: Boolean,
        default: false,
    },
    list_booking: {
        type: Array,
        required: true,
    },
});

export const bookingModel = model("booking", bookingSchema);
export const billModel = model("bill", billSchema);

export default {
    bookingModel,
    billModel,
};
