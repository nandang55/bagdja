import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Debug: Log loaded env vars (remove in production)
console.log('🔍 Loading Supabase config...');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Loaded' : '❌ Missing');
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? `✅ Loaded (${process.env.SUPABASE_SERVICE_KEY.substring(0, 20)}...)` : '❌ Missing');
console.log('SUPABASE_JWT_SECRET:', process.env.SUPABASE_JWT_SECRET ? '✅ Loaded' : '❌ Missing');

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'SUPABASE_JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Create Supabase client with Service Role Key
// This bypasses RLS and gives full database access
// Security is enforced in the API layer
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export const JWT_SECRET = process.env.SUPABASE_JWT_SECRET!;

