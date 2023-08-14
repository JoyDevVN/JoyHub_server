import { Schema, model } from 'mongoose';
const notificationSchema = new Schema({
    account_id: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
});

const reportSchema = new Schema({
    booking_id: {
        type: String,
        required: true,
    },
    hotel_id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
});

const ratingSchema = new Schema({
    account_id: {
        type: String,
        required: true,
    },
    hotel_id: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
});

export const Notification = model('Notification', notificationSchema);
export const Report = model('Report', reportSchema);
export const Rating = model('Rating', ratingSchema);

export default {
    Notification,
    Report,
    Rating,
};
