import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    auth: {
        persistSession: false
    }
}
export default dbConfig;
