import { createClient } from '@supabase/supabase-js';
import { ENV } from '../config/env';

// Supabase client - ONLY for authentication
// All data fetching must go through the API
export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

