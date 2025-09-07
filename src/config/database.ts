import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vejihuzhsoixppcyghdw.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error('Missing Supabase key. Please set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY in your .env file');
}

console.log('🔗 Connecting to Supabase...');
export const supabase = createClient(supabaseUrl, supabaseKey);
console.log('✅ Connected to Supabase');

// Create a simple database interface that works with Supabase
export const db = {
  // For testing database connection
  execute: async (query: any) => {
    try {
      const { data, error } = await supabase.rpc('execute_sql', { sql: query });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
};