# 🚀 Bagdja Account - Setup Guide

Panduan lengkap untuk setup dan menjalankan Bagdja Account Service di development environment.

## 📋 Prerequisites

Pastikan sudah terinstall:

- **Node.js 18+** - [Download di sini](https://nodejs.org/)
- **npm** (biasanya sudah include dengan Node.js)
- **Git** - [Download di sini](https://git-scm.com/)
- **Supabase Account** - [Daftar gratis di sini](https://supabase.com)

## 🎯 Quick Start (5 menit)

### Step 1: Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd bagdja-account

# Install dependencies
npm install
```

### Step 2: Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file
nano .env
```

**Isi file `.env`:**

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Application Configuration
VITE_APP_URL=http://localhost:5175
VITE_APP_NAME=Bagdja Account
```

### Step 3: Start Development Server

```bash
npm run dev
```

✅ **Berhasil!** Buka http://localhost:5175 di browser

## 🔧 Detailed Setup

### Database Setup (Supabase)

Jika belum ada project Supabase:

1. **Buat Project Baru**
   - Buka [Supabase Dashboard](https://supabase.com/dashboard)
   - Klik "New Project"
   - Nama: `bagdja-account`
   - Pilih region terdekat
   - Set password database

2. **Setup Database Schema**

   Jalankan script SQL berikut di **SQL Editor**:

   ```sql
   -- Enable RLS
   ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

   -- Create profiles table
   CREATE TABLE IF NOT EXISTS public.profiles (
     id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     full_name TEXT,
     avatar_url TEXT,
     bio TEXT,
     phone TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable RLS on profiles
   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own profile" ON public.profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON public.profiles
     FOR UPDATE USING (auth.uid() = id);

   CREATE POLICY "Users can insert own profile" ON public.profiles
     FOR INSERT WITH CHECK (auth.uid() = id);

   -- Create updated_at trigger
   CREATE OR REPLACE FUNCTION public.handle_updated_at()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER handle_updated_at
     BEFORE UPDATE ON public.profiles
     FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
   ```

3. **Get Credentials**
   - Buka **Settings → API**
   - Copy **Project URL** dan **anon/public key**

### Authentication Setup

1. **Configure Auth Providers**
   - Buka **Authentication → Providers**
   - Enable **Email** provider
   - Optional: Enable **Google** atau **GitHub**

2. **Email Templates** (Optional)
   - Buka **Authentication → Email Templates**
   - Customize templates sesuai brand

3. **URL Configuration**
   - **Site URL**: `http://localhost:5175`
   - **Redirect URLs**: 
     - `http://localhost:5175/dashboard`
     - `http://localhost:5175/auth/callback`

## 🎨 Customization

### Branding

Edit `src/styles/globals.css` untuk custom branding:

```css
:root {
  --primary-color: #0ea5e9;
  --secondary-color: #64748b;
  --accent-color: #22c55e;
  --brand-name: 'Bagdja Account';
}
```

### Logo

1. Tambahkan logo ke `public/logo.png`
2. Update `src/components/layout/Header.tsx`

## 🧪 Testing Setup

### Unit Tests

```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm run test
```

### E2E Tests

```bash
# Install Playwright
npm install -D @playwright/test

# Run E2E tests
npm run test:e2e
```

## 🔍 Development Tools

### VS Code Extensions (Recommended)

Install extensions berikut untuk development experience yang lebih baik:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Debugging

1. **Browser DevTools**
   - F12 untuk membuka DevTools
   - Network tab untuk cek API calls
   - Console untuk error messages

2. **Supabase Dashboard**
   - Logs untuk melihat database queries
   - Auth logs untuk authentication issues

## 🐛 Troubleshooting

### Common Issues

#### Issue: "Failed to connect to Supabase"

**Solutions:**
1. Check `VITE_SUPABASE_URL` di `.env`
2. Verify internet connection
3. Check Supabase project status

#### Issue: "Invalid API key"

**Solutions:**
1. Verify `VITE_SUPABASE_ANON_KEY` di `.env`
2. Copy key dari Supabase Dashboard → Settings → API
3. Pastikan tidak ada spasi extra

#### Issue: "Port 5175 already in use"

**Solutions:**
```bash
# Find process using port 5175
lsof -i :5175

# Kill process
kill -9 <PID>

# Or use different port
npm run dev -- --port 5176
```

#### Issue: "Authentication redirect not working"

**Solutions:**
1. Check redirect URLs di Supabase Dashboard
2. Verify `VITE_APP_URL` di `.env`
3. Check browser console untuk errors

### Getting Help

1. **Check Logs**
   - Browser console (F12)
   - Terminal output
   - Supabase dashboard logs

2. **Documentation**
   - [Supabase Docs](https://supabase.com/docs)
   - [React Docs](https://react.dev)
   - [Vite Docs](https://vitejs.dev)

3. **Community**
   - [Supabase Discord](https://discord.supabase.com)
   - [GitHub Issues](https://github.com/your-repo/issues)

## ✅ Verification Checklist

Setelah setup, pastikan semua berfungsi:

- [ ] Development server berjalan di http://localhost:5175
- [ ] Tidak ada error di browser console
- [ ] Supabase connection berhasil
- [ ] Registration page bisa diakses
- [ ] Login page bisa diakses
- [ ] Database schema sudah terbuat
- [ ] Environment variables sudah di-set

## 🚀 Next Steps

Setelah setup selesai:

1. **Explore Code Structure** - Baca dokumentasi di folder `docs/`
2. **Customize UI** - Edit components di `src/components/`
3. **Add Features** - Implementasi fitur baru
4. **Test Thoroughly** - Jalankan semua test
5. **Deploy** - Follow [DEPLOYMENT.md](./DEPLOYMENT.md)

---

**Happy Coding! 🎉**
