import dotenv from 'dotenv';
import mongoose from "mongoose";

dotenv.config();

// const dbConfig = {
//     supabaseUrl: process.env.SUPABASE_URL,
//     supabaseKey: process.env.SUPABASE_KEY,
//     auth: {
//         persistSession: false
//     }
// }
// export default dbConfig;

const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => {
        console.log("Successfully connect to MongoDB.");
    }).catch(err => {
        console.error("Connection error", err.message);
        process.exit();
    });
}

export default connectDB;
