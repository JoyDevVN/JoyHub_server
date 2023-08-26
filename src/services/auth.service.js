import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Account, Customer, Moderator } from "../databases/account.model.js";

const isExist = async (username, email) => {
    const account = await Account.findOne({
        $or: [{ username: username }, { email: email }],
    }).lean();
    if (account) {
        throw new Error("Username or email is already exist");
    }
};

const register = async (data) => {
    try {
        const { username, email, password, role } = data;
        // console.log(`[INFO] Registering account ${JSON.stringify(data)}`);
        // check if username or email already exists
        await isExist(username);
        const salt = await bcrypt.genSalt(10);
        const account = new Account({
            username: username,
            email: email,
            password: bcrypt.hashSync(password, salt),
            role: role,
        });
        const savedAccount = await account.save();
        // insert account to customer or hotel
        if (role === "customer") {
            const customer = new Customer({
                account_id: savedAccount._id,
                full_name: data.full_name,
            });
            await customer.save();
        } else if (role === "moderator") {
            const moderator = new Moderator({
                account_id: savedAccount._id,
                hotel_name: data.hotel_name,
                address: data.address,
                description: data.description,
                owner_name: data.owner_name,
            });
            await moderator.save();
        }

        return { result: `Account ${username} is created`, error: null };
    } catch (error) {
        return { result: null, error: error.message };
    }
};

const login = async (data) => {
    try {
        const { username, password } = data;
        console.log(`[INFO] Login account ${JSON.stringify(data)}`);
        // find an account by username
        const account = await Account.findOne({ username: username }).lean();
        if (!account) {
            return { result: null, token: null, role: null, error: "Username is not exist" };
        }
        // check password
        const validPassword = await bcrypt.compare(password, account.password);
        if (!validPassword) {
            return { result: null, token: null, role: null, error: "Password is not correct" };
        }
        console.log(`[INFO] Login successfully`);
        // create and assign token
        const token = jwt.sign({account_id: account._id, role: account.role }, process.env.TOKEN_SECRET, { expiresIn: "24h" });
        return { result: "Login successfully", token: token, role: account.role, error: null };
    } catch (error) {
        return { result: null, token: null, role: null, error: error };
    }
};

const verifyToken = (token) => {
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET, { maxAge: "24h" });
        return { result: { account_id: verified.account_id, role: verified.role }, error: null };
    } catch (error) {
        return { result: null, error: error };
    }
};

export default { register, login, verifyToken };
