import { Account, Moderator } from "../databases/account.model";

const activeModerator = async (id) => {
    const data = await Moderator.findOneAndUpdate(
        {
            account_id: id,
        },
        {
            isAccepted: true,
        }
    );
    if (!data) {
        return { error: "This moderator does not exist" };
    }
    return { result: "success" };
};

const getModerators = async () => {
    const data = await Moderator.find();
    if (!data) {
        return { error: "Internal error" };
    }
    return { result: data };
};
const getUnacceptedModerators = async () => {
    const data = await Account.aggregate([
        {
            $addFields:
            {
                account_id: { $toString: "$_id" }
            }
        },
        {
            // Join with moderator table
            $lookup: {
                from: "moderators",
                localField: "account_id",
                foreignField: "account_id",
                as: "moderator",
            },
        },
        {
            // Where moderator is not accepted
            $match: {
                "moderator.isAccepted": false,
                "role": "moderator",
            },
        },
        {
            // Select only the following fields
            $project: {
                _id: 0,
                account_id: 1,
                username: 1,
                email: 1,
                phone: 1,
                moderator: {
                    "_id": 1,
                    "hotel_name": 1,
                    "address": 1,
                    "description": 1,
                    "owner_name": 1,
                }
            },
        }

    ]);
    if (!data) {
        return { error: "Internal error" };
    }
    return { result: data };
};

const removeModerator = async (id) => {
    // remove moderator from moderator as well as account
    // const { error: error_mod } = await db
    //     .from("moderator")
    //     .delete()
    //     .eq("account_id", username);
    // if (error_mod) {
    //     throw new Error(error_mod.message);
    // }
    // const { error_acc } = await db
    //     .from("account")
    //     .delete()
    //     .eq("account_id", username);
    // if (error_acc) {
    //     throw new Error(error_acc.message);
    // }
    const data = await Moderator.findOneAndDelete({ account_id: id });
    if (!data) {
        return { error: "This moderator does not exist" };
    }

    return { result: "success" };
};

const getRooms = async () => {
    // format data with the following format:
    // [
    //     {
    //         account_id: "moderator1",
    //         rooms: 10,
    //     }
    // ]
    let result = await Moderator.aggregate([
        {
            $lookup: {
                from: "rooms",
                localField: "account_id",
                foreignField: "hotel_id",
                as: "room",
            },
        },
        {
            // select account_id and count the number of rooms
            $project: {
                _id: 0,
                account_id: 1,
                hotel_name: 1,
                address: 1,
                rooms: { $size: "$room" },
            },
        },

    ]);
    if (!result) {
        return { error: "Internal error" };
    }
    return { result };
};

// Get all rooms that are not accepted of a moderator
const getUnacceptedRooms = async (id) => {
    let result = await Moderator.aggregate([
        {
            $lookup: {
                from: "room",
                localField: "account_id",
                foreignField: "hotel_id",
                as: "rooms",
            },
        },
        {
            $match: {
                "room.isAccepted": false,
            },
        },
        {
            $project: {
                _id: 0,
                account_id: 1,
                hotel_name: 1,
                address: 1,
                rooms: { $size: "$room" },
            },
        }
    ]);
    if (!result) {
        return { error: "Internal error" };
    }
    return { result: result };
};

export default {
    activeModerator,
    getModerators,
    getUnacceptedModerators,
    removeModerator,
    getRooms,
    getUnacceptedRooms,
};
