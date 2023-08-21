import { Schema, model } from 'mongoose';
const notificationSchema = new Schema({
    from_id: {
        type: String,
        required: true,
    },
    to_id: {
        type: String,
        required: true,
    },
    for: {
        type: String,
        enum: ['moderator', 'customer'],
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['accepted', 'cancelled', 'waiting', 'warning', 'approved', 'rejected'],
    },
    booking_id: {
        type: String,
    },
    room_id: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    updated_at: {
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
    updated_at: {
        type: Date,
        default: Date.now(),
    },
});

const ratingSchema = new Schema({
    customer_id: {
        type: String,
        required: true,
    },
    hotel_id: {
        type: String,
        required: true,
    },
    room_id: {
        type: String,
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
    updated_at: {
        type: Date,
    },
    star: {
        type: Number,
        default: 0,
    },
});

notificationSchema.pre('save', function (next) {
    this.update({}, { $set: { updated_at: new Date() } });
    next();
});

reportSchema.pre('save', function (next) {
    this.update({}, { $set: { updated_at: new Date() } });
    next();
});

ratingSchema.pre('save', function (next) {
    this.update({}, { $set: { updated_at: new Date() } });
    next();
});

export const Notification = model('Notification', notificationSchema);
export const Report = model('Report', reportSchema);
export const Rating = model('Rating', ratingSchema);

export default {
    Notification,
    Report,
    Rating,
};
