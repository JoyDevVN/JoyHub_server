import { Schema, model } from "mongoose";
const accountSchema = new Schema({
    username: {
        type: String,
        required: true,
        min: 6,
    },
    email: {
        type: String,
        required: true,
        min: 6,
    },
    password: {
        type: String,
        required: true,
        min: 5,
    },
    role: {
        type: String,
        required: true,
    },
    bank_number: {
        type: String,
        required: false,
    },
    wallet: {
        type: Number,
        required: false,
        default: 0
    },
    phone: {
        type: String,
        required: false,
    },
});

const customerSchema = new Schema({
    account_id: {
        type: String,
        required: true,
    },
    full_name: {
        type: String,
        required: true,
    }
});

const moderatorSchema = new Schema({
    account_id: {
        type: String,
        required: true,
    },
    hotel_name: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    owner_name: {
        type: String,
        required: false,
    },
    isAccepted: {
        type: Boolean,
        default: false,
    },
    image: {
        // image url
        type: String,
        required: false,
    },
});

export const Account = model("Account", accountSchema);
export const Customer = model("Customer", customerSchema);
export const Moderator = model("Moderator", moderatorSchema);

export default {
    Account,
    Customer,
    Moderator,
}
