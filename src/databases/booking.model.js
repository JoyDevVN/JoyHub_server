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
    account_id: {
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
    created_at: {
        type: Date,
        default: Date.now(),
    },
    updated_at: {
        type: Date,
    },
    date_begin: {
        type: Date,
        default: false,
    },
    date_end: {
        type: Date,
        default: false,
    },
    isCanceled: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["waiting", "approved", "rejected", "canceled", "completed"],
        default: "waiting",
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

bookingSchema .pre("save", function (next) {
    this.updated_at = Date.now();
    next();
});

export const Booking = model("booking", bookingSchema);
export const Bill = model("bill", billSchema);

export default {
    Booking,
    Bill,
};
