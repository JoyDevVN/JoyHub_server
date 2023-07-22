const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = "https://yuknrzdtxcyxftntubba.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1a25yemR0eGN5eGZ0bnR1YmJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkyMzA0NDcsImV4cCI6MjAwNDgwNjQ0N30.6f4rVzoWu-JVw917b7MJLWWolW_0WyPRsjweKgCzl8c";

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

// show all data in the Account table
async function printTableNames() {
    const { data, error } = await supabase
        .from('Account')
        .select('*');
    if (error) console.log(error);
    console.log(data);
}


printTableNames();
