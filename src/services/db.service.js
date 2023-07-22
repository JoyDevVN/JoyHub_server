import { createClient } from '@supabase/supabase-js';
import dbConfig from '../configs/db.config.js';

const supabase = createClient(dbConfig.supabaseUrl, dbConfig.supabaseKey, {auth: {persistSession: false}});

export default supabase;
