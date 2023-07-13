const { createClient } = require('@supabase/supabase-js');
const dbConfig = require('../configs/db.config');

const supabase = createClient(dbConfig.supabaseUrl, dbConfig.supabaseKey, {auth: {persistSession: false}});

module.exports = supabase;
