// Environment configuration
export const ENV = {
  API_URL: import.meta.env.VITE_BAGDJA_API_URL || 'http://localhost:3001',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
};

// Validate required environment variables
if (!ENV.SUPABASE_URL || !ENV.SUPABASE_ANON_KEY) {
  console.warn('⚠️ Missing Supabase environment variables. Authentication features will not work.');
}

