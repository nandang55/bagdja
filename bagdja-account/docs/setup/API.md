# 🔌 Bagdja Account - API Documentation

Dokumentasi lengkap untuk API endpoints dan integrasi dengan Bagdja Account Service.

## 🎯 Overview

Bagdja Account Service menggunakan **direct Supabase integration** untuk performa dan keamanan maksimal. Service ini menyediakan authentication dan user management untuk seluruh ecosystem Bagdja.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                CLIENT APPLICATIONS                           │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ Bagdja Store │  │ Bagdja Console│  │ Bagdja Mobile  │   │
│  └──────┬───────┘  └──────┬───────┘  └─────────┬───────┘   │
└─────────┼──────────────────┼────────────────────┼───────────┘
          │                  │                    │
          └──────────────────┼────────────────────┘
                             │ Supabase Client SDK
          ┌──────────────────▼─────────────────────────────┐
          │            BAGDJA ACCOUNT SERVICE               │
          │  ┌─────────────────┐  ┌─────────────────────┐   │
          │  │ Supabase Auth   │  │ Database Operations │   │
          │  │ • JWT Tokens    │  │ • User Profiles     │   │
          │  │ • Session Mgmt  │  │ • Security Policies │   │
          │  └─────────────────┘  └─────────────────────┘   │
          └──────────────────┬─────────────────────────────┘
                             │
          ┌──────────────────▼─────────────────────────────┐
          │              SUPABASE DATABASE                 │
          │  • PostgreSQL Database                        │
          │  • Row Level Security (RLS)                   │
          │  • Real-time subscriptions                    │
          └─────────────────────────────────────────────────┘
```

## 🔑 Authentication Flow

### 1. Registration Flow

```typescript
// 1. User fills registration form
const registrationData = {
  email: 'user@example.com',
  password: 'securePassword123',
  fullName: 'John Doe'
};

// 2. Call Supabase Auth
const { data, error } = await supabase.auth.signUp({
  email: registrationData.email,
  password: registrationData.password,
  options: {
    data: {
      full_name: registrationData.fullName
    }
  }
});

// 3. Handle response
if (error) {
  console.error('Registration failed:', error.message);
} else {
  console.log('Registration successful:', data.user);
}
```

### 2. Login Flow

```typescript
// 1. User submits login form
const loginData = {
  email: 'user@example.com',
  password: 'securePassword123'
};

// 2. Authenticate with Supabase
const { data, error } = await supabase.auth.signInWithPassword({
  email: loginData.email,
  password: loginData.password
});

// 3. Handle response
if (error) {
  console.error('Login failed:', error.message);
} else {
  console.log('Login successful:', data.user);
  // Store session for future requests
  localStorage.setItem('supabase_session', JSON.stringify(data.session));
}
```

### 3. Session Management

```typescript
// Check current session
const { data: { session }, error } = await supabase.auth.getSession();

if (session) {
  console.log('User is authenticated:', session.user);
} else {
  console.log('User is not authenticated');
}

// Refresh session
const { data, error } = await supabase.auth.refreshSession();

// Logout
const { error } = await supabase.auth.signOut();
```

## 📊 Database Schema

### Users Table (Supabase Auth)

```sql
-- Managed by Supabase Auth
auth.users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  encrypted_password TEXT,
  email_confirmed_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  raw_user_meta_data JSONB,
  raw_app_meta_data JSONB
)
```

### Profiles Table (Custom)

```sql
-- User profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  country TEXT,
  timezone TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## 🔧 API Functions

### Authentication Functions

#### `signUp(userData)`

Mendaftarkan user baru.

```typescript
interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

async function signUp(userData: SignUpData) {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        full_name: userData.fullName,
        phone: userData.phone
      }
    }
  });

  if (error) throw error;
  return data;
}
```

#### `signIn(email, password)`

Login user.

```typescript
async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}
```

#### `signOut()`

Logout user.

```typescript
async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
```

#### `resetPassword(email)`

Kirim email reset password.

```typescript
async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });

  if (error) throw error;
}
```

### Profile Functions

#### `getProfile(userId)`

Mengambil data profile user.

```typescript
async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}
```

#### `updateProfile(userId, updates)`

Update data profile user.

```typescript
interface ProfileUpdates {
  full_name?: string;
  bio?: string;
  phone?: string;
  avatar_url?: string;
  date_of_birth?: string;
  gender?: string;
  country?: string;
  timezone?: string;
  preferences?: Record<string, any>;
}

async function updateProfile(userId: string, updates: ProfileUpdates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

#### `uploadAvatar(userId, file)`

Upload avatar user.

```typescript
async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // Upload file
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Get public URL
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  // Update profile with new avatar URL
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: data.publicUrl })
    .eq('id', userId);

  if (updateError) throw updateError;
  return data.publicUrl;
}
```

### Security Functions

#### `changePassword(newPassword)`

Ganti password user.

```typescript
async function changePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) throw error;
}
```

#### `getActiveSessions()`

Mendapatkan daftar session aktif.

```typescript
async function getActiveSessions() {
  const { data: { session } } = await supabase.auth.getSession();
  
  // In real implementation, you might want to track sessions in database
  return [session];
}
```

#### `revokeSession(sessionId)`

Revoke session tertentu.

```typescript
async function revokeSession(sessionId: string) {
  // Sign out current session
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
```

## 🔒 Security Best Practices

### 1. Row Level Security (RLS)

Semua tabel menggunakan RLS untuk keamanan data:

```sql
-- Example policy
CREATE POLICY "Users can only access own data" ON profiles
  FOR ALL USING (auth.uid() = id);
```

### 2. Input Validation

```typescript
import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters')
});

// Validate before API call
const validatedData = signUpSchema.parse(userData);
```

### 3. Error Handling

```typescript
try {
  const result = await signUp(userData);
  return { success: true, data: result };
} catch (error) {
  console.error('API Error:', error);
  return { 
    success: false, 
    error: error.message || 'An unexpected error occurred' 
  };
}
```

### 4. Rate Limiting

```typescript
// Implement client-side rate limiting
const rateLimiter = {
  attempts: 0,
  lastAttempt: 0,
  maxAttempts: 5,
  timeWindow: 60000, // 1 minute

  canAttempt() {
    const now = Date.now();
    if (now - this.lastAttempt > this.timeWindow) {
      this.attempts = 0;
    }
    return this.attempts < this.maxAttempts;
  },

  recordAttempt() {
    this.attempts++;
    this.lastAttempt = Date.now();
  }
};
```

## 🔄 Real-time Features

### Profile Updates

```typescript
// Subscribe to profile changes
const subscription = supabase
  .channel('profile-changes')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'profiles',
    filter: `id=eq.${userId}`
  }, (payload) => {
    console.log('Profile updated:', payload.new);
    // Update UI with new data
  })
  .subscribe();

// Cleanup subscription
subscription.unsubscribe();
```

## 📱 Integration Examples

### React Hook

```typescript
// useAuth.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
```

### Vue.js Integration

```typescript
// auth.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VUE_APP_SUPABASE_URL,
  process.env.VUE_APP_SUPABASE_ANON_KEY
);

export const auth = {
  async signUp(email, password, userData) {
    return await supabase.auth.signUp({
      email,
      password,
      options: { data: userData }
    });
  },

  async signIn(email, password) {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signOut() {
    return await supabase.auth.signOut();
  }
};
```

## 🧪 Testing

### Unit Tests

```typescript
// auth.test.ts
import { describe, it, expect, vi } from 'vitest';
import { signUp, signIn } from '../lib/auth';

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn()
    }
  }
}));

describe('Authentication', () => {
  it('should sign up user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User'
    };

    const result = await signUp(userData);
    expect(result).toBeDefined();
  });
});
```

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Client Library](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

---

**Need Help?** Check our [Integration Guide](./INTEGRATION.md) or open an issue on GitHub.
