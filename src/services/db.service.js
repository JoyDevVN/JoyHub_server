// import { createClient } from '@supabase/supabase-js';
// import dbConfig from '../configs/db.config.js';

// const supabase = createClient(dbConfig.supabaseUrl, dbConfig.supabaseKey, {auth: {persistSession: false}});

// export default supabase;

import mongoose from 'mongoose';
// import dbConfig from '../configs/db.config.js';

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
      .then(() => {
        console.log('Database connection successful');
      })
      .catch(err => {
        console.error('Database connection error');
      });
  }
}

export default new Database();
