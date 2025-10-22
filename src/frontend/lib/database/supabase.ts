import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase instance
export const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);

// Server-side helper to create a new Supabase client (uses anon key)
export function createClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Server-side admin client (bypasses RLS) - USE WITH CAUTION!
export function createServiceClient() {
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for service client');
  }
  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey);
}
