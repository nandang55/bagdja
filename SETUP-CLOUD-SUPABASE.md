# 🌐 SETUP SUPABASE CLOUD (TANPA DOCKER)

Panduan setup Bagdja Marketplace menggunakan Supabase Cloud.

## 📋 Prerequisites

- ✅ Akun Supabase (gratis di https://supabase.com)
- ✅ Browser
- ⛔ **TIDAK perlu Docker**
- ⛔ **TIDAK perlu Supabase CLI local**

---

## 🚀 Step 1: Create Supabase Project

### 1.1 Sign Up / Login

1. Buka https://supabase.com
2. Click **"Start your project"** atau **"Sign In"**
3. Login dengan GitHub, Google, atau Email

### 1.2 Create New Project

1. Click **"New Project"**
2. Pilih Organization (atau buat baru)
3. Fill project details:
   ```
   Name: bagdja-marketplace
   Database Password: [pilih password kuat]
   Region: [pilih terdekat, misal: Southeast Asia (Singapore)]
   Pricing Plan: Free
   ```
4. Click **"Create new project"**
5. **Tunggu ~2 menit** sampai project provisioning selesai

### 1.3 Get Your Credentials

Setelah project ready, go to **Settings → API**:

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGc...  (starts with eyJ)
service_role key: eyJhbGc...  (different from anon, KEEP SECRET!)
```

**⚠️ IMPORTANT:**
- **anon key**: Safe for frontend (public)
- **service_role key**: NEVER expose to frontend (backend only)

Go to **Settings → API → JWT Settings**:
```
JWT Secret: your-jwt-secret-here
```

**📝 Save these credentials!** You'll need them for `.env` files.

---

## 🗄️ Step 2: Setup Database Schema

### Option A: Using Migrations (Recommended)

1. **Install Supabase CLI** (one-time):
   ```bash
   brew install supabase/tap/supabase
   # or
   npm install -g supabase
   ```

2. **Link to your project:**
   ```bash
   cd /Users/nandanghermawan/Project/bagdja
   supabase login
   supabase link --project-ref your-project-ref
   ```
   
   **Find project-ref:**
   - Settings → General → Reference ID
   - Or from URL: `https://supabase.com/dashboard/project/[project-ref]`

3. **Push migrations:**
   ```bash
   supabase db push --linked
   ```

4. **Verify:**
   - Go to **Database → Tables**
   - You should see: users, categories, products, reviews, etc.

### Option B: Manual SQL (Alternative)

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **"New Query"**
3. Open file: `supabase-schema.sql`
4. Copy entire contents
5. Paste into SQL Editor
6. Click **"Run"** (or press Cmd+Enter)
7. Check for success message
8. Verify in **Table Editor**

---

## 🔧 Step 3: Configure API Backend

### 3.1 Setup Environment

```bash
cd /Users/nandanghermawan/Project/bagdja/bagdja-api-services
```

### 3.2 Create .env file

```bash
cp .env.example .env
```

### 3.3 Edit .env

```env
# Dari Supabase Dashboard → Settings → API
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...your-service-role-key...
SUPABASE_JWT_SECRET=your-jwt-secret

# Local config
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

### 3.4 Install & Run

```bash
npm install
npm run dev
```

**✅ Verify:**
```bash
curl http://localhost:3001
# Should return: {"service":"BAGDJA API Services",...}
```

---

## 🛒 Step 4: Configure Store Frontend

### 4.1 Setup Environment

```bash
cd /Users/nandanghermawan/Project/bagdja/bagdja-store-frontend
```

### 4.2 Create .env file

```bash
cp .env.example .env
```

### 4.3 Edit .env

```env
# API Backend
VITE_BAGDJA_API_URL=http://localhost:3001

# Dari Supabase Dashboard → Settings → API
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...
```

### 4.4 Install & Run

```bash
npm install
npm run dev
```

**✅ Open:** http://localhost:5173

---

## 🔨 Step 5: Configure Console Frontend

### 5.1 Setup Environment

```bash
cd /Users/nandanghermawan/Project/bagdja/bagdja-console-frontend
```

### 5.2 Create .env file

```bash
cp .env.example .env
```

### 5.3 Edit .env

```env
# API Backend
VITE_BAGDJA_API_URL=http://localhost:3001

# Dari Supabase Dashboard → Settings → API
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...
```

### 5.4 Install & Run

```bash
npm install
npm run dev
```

**✅ Open:** http://localhost:5174

---

## 🧪 Step 6: Test End-to-End

### 6.1 Create Developer Account

1. Open Console: http://localhost:5174
2. Click **"Sign Up"**
3. Fill form:
   ```
   Name: Test Developer
   Email: dev@test.com
   Password: Test123!@#
   ```
4. Click **"Create Account"**
5. **Check email** for verification (or disable in Supabase)

**Disable Email Verification (Development):**
- Supabase Dashboard → Authentication → Settings
- **Email** section
- Toggle OFF: **"Enable email confirmations"**
- Now you can login immediately

### 6.2 Create Product

1. Login to Console
2. Click **"New Product"**
3. Fill form:
   ```
   Name: Test Product
   Category: Electronics
   Price: 99.99
   Stock: 10
   Status: Published
   ```
4. Click **"Create Product"**

### 6.3 Verify in Store

1. Open Store: http://localhost:5173
2. Should see your product on home page
3. Click product to view details

**✅ If you see the product, setup is SUCCESSFUL!**

---

## 📊 Step 7: Verify Database

### In Supabase Dashboard:

1. **Table Editor** → Check tables:
   - ✅ users
   - ✅ categories (should have 5 entries)
   - ✅ products (your test product)

2. **Authentication** → Users:
   - ✅ Your developer account

3. **API Logs**:
   - Should see requests from your app

---

## 🎯 Quick Start Commands

```bash
# Terminal 1: API Backend
cd /Users/nandanghermawan/Project/bagdja/bagdja-api-services
npm run dev

# Terminal 2: Store Frontend
cd /Users/nandanghermawan/Project/bagdja/bagdja-store-frontend
npm run dev

# Terminal 3: Console Frontend
cd /Users/nandanghermawan/Project/bagdja/bagdja-console-frontend
npm run dev
```

**Open in browser:**
- Store: http://localhost:5173
- Console: http://localhost:5174
- API: http://localhost:3001

---

## 🔄 Using Migrations with Cloud

### Create New Migration

```bash
cd /Users/nandanghermawan/Project/bagdja

# Create migration
supabase migration new add_new_feature

# Edit the migration file
# supabase/migrations/[timestamp]_add_new_feature.sql

# Push to cloud
supabase db push --linked
```

### Check Migration Status

```bash
# In Supabase Dashboard
Database → Migrations

# Or via CLI
supabase migration list --linked
```

---

## 🐛 Troubleshooting

### Can't connect to API

**Check:**
```bash
# Is API running?
curl http://localhost:3001

# Check .env file
cat bagdja-api-services/.env
```

**Fix:** Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are correct

### Authentication not working

**Check:**
- Supabase project is active (not paused)
- Email confirmation disabled (for development)
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` correct in frontend `.env`

### Products not showing

**Check:**
- Product status is "published"
- API can fetch: `curl http://localhost:3001/api/products`
- Browser console for errors (F12)

### Database errors

**Check:**
- Schema is deployed (run `supabase-schema.sql` in SQL Editor)
- Service Role Key is correct
- JWT Secret matches

---

## 📋 Checklist

### ✅ Supabase Cloud Setup
- [ ] Project created
- [ ] Credentials saved
- [ ] Schema deployed (all tables created)
- [ ] Categories seeded (5 categories)

### ✅ Backend Setup
- [ ] .env file configured
- [ ] Dependencies installed (`npm install`)
- [ ] Server running (`npm run dev`)
- [ ] Health check passes (`curl localhost:3001`)

### ✅ Store Frontend Setup
- [ ] .env file configured
- [ ] Dependencies installed
- [ ] Server running (port 5173)
- [ ] Homepage loads

### ✅ Console Frontend Setup
- [ ] .env file configured
- [ ] Dependencies installed
- [ ] Server running (port 5174)
- [ ] Login page loads

### ✅ End-to-End Test
- [ ] Developer account created
- [ ] Product created in Console
- [ ] Product visible in Store
- [ ] Product details page works

---

## 🎉 You're Done!

Your Bagdja Marketplace is now running with Supabase Cloud!

**No Docker needed! ✅**

### Next Steps:

1. ✅ Create more test products
2. ✅ Test all features
3. ✅ Customize UI
4. ✅ Deploy to production (see DEPLOYMENT.md)

### Resources:

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase Docs](https://supabase.com/docs)
- [Project README](./README.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

**Happy Developing! 🚀**

