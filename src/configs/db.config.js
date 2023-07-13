require('dotenv').config();

module.exports = {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    auth: {
        persistSession: false
    }
}
