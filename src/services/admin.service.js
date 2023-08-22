import {Account, Moderator} from "../databases/account.model";
import {Room} from "../databases/room.model";
import {Report} from "../databases/notification.model";

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
        return {error: "This moderator does not exist"};
    }
    return {result: "success"};
};

const getModerators = async () => {
    const data = await Moderator.find();
    if (!data) {
        return {error: "Internal error"};
    }
    return {result: data};
};
const getUnacceptedModerators = async () => {
    const data = await Account.aggregate([
        {
            $addFields:
                {
                    account_id: {$toString: "$_id"}
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
        return {error: "Internal error"};
    }
    return {result: data};
};

const removeModerator = async (id) => {
    // check if this moderator exists
    const account = Account.findById(id);
    if (!account) {
        return {error: "This moderator does not exist"};
    }
    // delete this moderator
    const data = await Moderator.findOneAndDelete({
        account_id: id,
    });
    // delete this account
    const result = await Account.findByIdAndDelete(id);
    if (!data || !result) {
        return {error: "Internal error"};
    }

    return {result: "success"};
};

const activeRoom = async (id) => {
    const data = await Room.findByIdAndUpdate(
        id,
        {
            isAcepeted: true,
        }
    );
    if (!data) {
        return {error: "This room does not exist"};
    }
    return {result: "success"};
};

const removeRoom = async (id) => {
    const data = await Room.findByIdAndDelete(id);
    if (!data) {
        return {error: "This room does not exist"};
    }
    return {result: "success"};
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
                rooms: {$size: "$room"},
            },
        },

    ]);
    if (!result) {
        return {error: "Internal error"};
    }
    return {result};
};

// Get all rooms that are not accepted of a moderator
const getUnacceptedRooms = async (id) => {
    // console.log(`Getting unaccepted room list of ${id}`);
    let result = await Room.find({
        hotel_id: id,
        isAcepeted: false,
    }, {
        _id: 1,
        name: 1,
        price: 1,
        image: 1,
    });
    // console.log(result);
    if (!result) {
        return {error: "Internal error"};
    }
    return {result: result};
};

const getRoomInfo = async (id) => {
    const data = await Room.findById(id);
    if (!data) {
        return {error: "Internal error"};
    }
    return {result: data};
};

const getReportList = async () => {
    const data = await Report.aggregate(
        [
            {
                $group:
                    {
                        _id: "$hotel_id",
                        latest_report: {$last: "$$ROOT"},
                        count: {$sum: 1}
                    }
            },
            {
                $project:
                    {
                        _id: 0,
                        hotel_id: "$_id",
                        latest_report: {
                            title: 1,
                            content: 1,
                            created_at: 1,
                        },
                        count: 1
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
                                    _id: 0,
                                    name: "$hotel_name",
                                }
                            }
                        ],
                        as: "hotel",
                    }
            },
            {
                $unwind: "$hotel"
            }
        ]
    );

    if (!data) {
        return {error: "Internal error"};
    }
    console.log(data);
    return {result: data};
}

const getReportOfHotel = async (id) => {
    const data = await Report.find({
            hotel_id: id,
        },
        {
            _id: 0,
            title: 1,
            content: 1,
            updated_at: 1,
            hotel_id: 1,
        }
    );
    if (!data) {
        return {error: "Internal error"};
    }
    return {result: data};
}
export default {
    activeModerator,
    getModerators,
    getUnacceptedModerators,
    removeModerator,
    getRooms,
    getUnacceptedRooms,
    getRoomInfo,
    activeRoom,
    removeRoom,
    getReportList,
    getReportOfHotel,
};
