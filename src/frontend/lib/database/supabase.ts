import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase instance
export const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);

// Server-side helper to create a new Supabase client
export function createClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
}
