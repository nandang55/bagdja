# BAGDJA PLATFORM - DEPLOYMENT GUIDE

Complete guide for deploying the Bagdja platform with 4 services to production:
1. **Bagdja Account** - Authentication & Account Management Hub
2. **API Services** - Backend microservices layer
3. **Store Frontend** - Public marketplace
4. **Console Frontend** - Developer dashboard

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] Supabase project created and configured
- [ ] GitHub account (for Vercel integration)
- [ ] Vercel account (free tier works)
- [ ] All environment variables ready

## 🗄️ Step 1: Setup Supabase (Database Layer)

### 1.1 Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Choose organization and fill project details
4. Wait for database to provision (~2 minutes)

### 1.2 Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Copy contents of `supabase-schema.sql`
3. Paste and click "Run"
4. Verify tables created in **Table Editor**

### 1.3 Get API Credentials

Go to **Settings → API** and copy:

```
Project URL: https://xxxxx.supabase.co
Anon/Public Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (keep secret!)
JWT Secret: your-jwt-secret
```

### 1.4 Configure Auth Settings

Go to **Authentication → Settings**:

- **Site URL**: Set to your frontend URLs (will update after deployment)
- **Redirect URLs**: Add frontend URLs
- **Email Confirmations**: Disable for testing, enable for production
- **Email Templates**: Customize as needed

### 1.5 Insert Sample Data (Optional)

```sql
-- Create sample developer user after signing up
-- First sign up via the Console frontend, then:
UPDATE public.users 
SET role = 'Developer' 
WHERE email = 'your-developer@email.com';
```

---

## 👤 Step 2: Deploy Bagdja Account (Authentication Hub)

### 2.1 Overview

`bagdja-account` is the central authentication and account management service. Users register here and manage their profiles, companies, and account settings.

**Technology**: React + Vite + Supabase (Direct Connection)

### 2.2 Database Setup

Before deploying, run the required migrations in **Supabase SQL Editor**:

```sql
-- Run these migrations in order:
-- 1. Create profiles table
-- File: supabase/migrations/20251007000001_create_profiles_table.sql

-- 2. Create companies table
-- File: supabase/migrations/20251007000002_create_companies_table.sql

-- 3. Create ownership logs
-- File: supabase/migrations/20251007000003_create_company_ownership_logs.sql

-- 4. Update RLS for transfer
-- File: supabase/migrations/20251007000004_update_rls_for_transfer.sql

-- 5. Sync existing profiles email
-- File: supabase/migrations/20251007000005_sync_existing_profiles_email.sql

-- 6-10. RLS fixes (run all remaining migrations)
```

Or use the all-in-one script in `bagdja-account/SETUP_DATABASE.md`.

### 2.3 Prepare Repository (Monorepo)

If deploying from monorepo:

```bash
cd /path/to/bagdja

# Push entire monorepo to GitHub
git add .
git commit -m "Ready for deployment - Bagdja Account"
git push origin main
```

### 2.4 Deploy to Vercel

**Via Vercel Dashboard** (Recommended for Monorepo):

1. Go to https://vercel.com/new
2. Import your GitHub repository (`bagdja`)
3. Configure project:
   - **Project Name**: `bagdja-account`
   - **Root Directory**: `bagdja-account` ⚠️ **CRITICAL for monorepo**
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   **Where to get these:**
   - Supabase Dashboard → Settings → API
   - Copy "Project URL" and "anon public" key

5. Click **"Deploy"**

**Via Vercel CLI**:

```bash
cd bagdja-account

# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Project name: bagdja-account
# - Framework: Vite
# - Deploy? Yes

# Add environment variables
vercel env add VITE_SUPABASE_URL
# Paste your Supabase URL

vercel env add VITE_SUPABASE_ANON_KEY
# Paste your Supabase Anon Key

# Deploy to production
vercel --prod
```

### 2.5 Configure Supabase Auth URLs

After deployment, update Supabase authentication settings:

1. Go to **Supabase Dashboard → Authentication → URL Configuration**
2. Set **Site URL**: `https://bagdja-account.vercel.app` (or your custom domain)
3. Add **Redirect URLs**:
   ```
   https://bagdja-account.vercel.app/**
   https://bagdja-account-*.vercel.app/**
   ```

### 2.6 Verify Deployment

1. **Open URL**: `https://bagdja-account.vercel.app`
2. **Test Registration**:
   - Click "Sign Up"
   - Enter email and password
   - Verify email sent (check inbox/spam)
   - Confirm account
3. **Test Login**:
   - Sign in with credentials
   - Verify redirect to dashboard
4. **Test Features**:
   - ✅ Dashboard displays user info
   - ✅ Profile page loads
   - ✅ Create company works
   - ✅ Company detail page accessible
   - ✅ Dark/Light mode toggle works
   - ✅ Logout redirects to login

### 2.7 Note Your Account URL

Save your Bagdja Account URL for integration:
```
https://bagdja-account.vercel.app
```

---

## 🔧 Step 3: Deploy API Services (Backend Layer)

### 3.1 Prepare Repository

```bash
cd bagdja-api-services

# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit - API Services"

# Push to GitHub
git remote add origin https://github.com/yourusername/bagdja-api-services.git
git branch -M main
git push -u origin main
```

### 3.2 Deploy to Vercel

**Option A: Vercel Dashboard**

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   ```
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key
   SUPABASE_JWT_SECRET=your-jwt-secret
   ALLOWED_ORIGINS=https://your-store.vercel.app,https://your-console.vercel.app
   NODE_ENV=production
   ```

5. Click "Deploy"

**Option B: Vercel CLI**

```bash
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? bagdja-api-services
# - Directory? ./
# - Override settings? Yes
#   - Build Command: npm run build
#   - Output Directory: dist
```

Add environment variables:
```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_KEY
vercel env add SUPABASE_JWT_SECRET
vercel env add ALLOWED_ORIGINS
vercel env add NODE_ENV
```

Deploy to production:
```bash
vercel --prod
```

### 3.3 Verify API Deployment

```bash
curl https://your-api.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "uptime": 123,
  "timestamp": "2025-10-05T..."
}
```

### 3.4 Note Your API URL

Save your API URL for frontend configuration:
```
https://bagdja-api-services.vercel.app
```

---

## 🏪 Step 4: Deploy Store Frontend (Public Store)

### 4.1 Prepare Repository

```bash
cd bagdja-store-frontend

git init
git add .
git commit -m "Initial commit - Store Frontend"
git remote add origin https://github.com/yourusername/bagdja-store-frontend.git
git branch -M main
git push -u origin main
```

### 4.2 Deploy to Vercel

1. Go to https://vercel.com/new
2. Import `bagdja-store-frontend` repository
3. Configure:
   - **Framework Preset**: Vite
   - Vercel auto-detects settings

4. Add Environment Variables:
   ```
   VITE_BAGDJA_API_URL=https://your-api.vercel.app
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. Click "Deploy"

### 4.3 Verify Store Deployment

1. Open your store URL: `https://bagdja-store.vercel.app`
2. Check home page loads
3. Verify products fetch from API
4. Test authentication (sign up/sign in)

---

## 🔨 Step 5: Deploy Console Frontend (Developer Dashboard)

### 5.1 Prepare Repository

```bash
cd bagdja-console-frontend

git init
git add .
git commit -m "Initial commit - Console Frontend"
git remote add origin https://github.com/yourusername/bagdja-console-frontend.git
git branch -M main
git push -u origin main
```

### 5.2 Deploy to Vercel

1. Go to https://vercel.com/new
2. Import `bagdja-console-frontend` repository
3. Configure:
   - **Framework Preset**: Vite

4. Add Environment Variables:
   ```
   VITE_BAGDJA_API_URL=https://your-api.vercel.app
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. Click "Deploy"

### 5.3 Verify Console Deployment

1. Open console URL: `https://bagdja-console.vercel.app`
2. Sign up with a new account
3. Verify Dashboard loads
4. Test creating a product
5. Check product appears in Store Frontend

---

## 🔄 Step 6: Update CORS & URLs

### 6.1 Update API CORS Settings

In Vercel dashboard for API Services:
1. Go to **Settings → Environment Variables**
2. Edit `ALLOWED_ORIGINS`:
   ```
   https://bagdja-store.vercel.app,https://bagdja-console.vercel.app
   ```
3. Redeploy: **Deployments → Three dots → Redeploy**

### 6.2 Update Supabase Auth URLs

In Supabase dashboard:
1. Go to **Authentication → URL Configuration**
2. Set **Site URL**: `https://bagdja-account.vercel.app` (primary auth service)
3. Add **Redirect URLs**:
   ```
   https://bagdja-account.vercel.app/**
   https://bagdja-store.vercel.app/**
   https://bagdja-console.vercel.app/**
   ```

---

## ✅ Step 7: Testing End-to-End

### 7.1 Test Bagdja Account (Authentication)

1. Visit account: `https://bagdja-account.vercel.app`
2. Sign up with new email
3. Verify email confirmation
4. Sign in successfully
5. Test profile creation
6. Create a company
7. Test company transfer
8. Verify ownership logs
9. Test dark/light mode toggle
10. Test logout

### 7.2 Test Store Frontend (Public)

1. Visit store: `https://bagdja-store.vercel.app`
2. Browse products
3. View product detail
4. Sign up as Buyer
5. Sign in and verify session

### 7.3 Test Developer Console

1. Visit console: `https://bagdja-console.vercel.app`
2. Sign up as Developer
3. Create a product
4. Edit the product
5. Set status to "published"

### 7.4 Verify Data Flow

1. Open Store Frontend
2. Navigate to category of created product
3. Verify product appears in listing
4. Click product to view details
5. Confirm all data displays correctly

---

## 🚀 Optional: Custom Domains

### Add Custom Domain to Store

1. In Vercel, go to Store project
2. **Settings → Domains**
3. Add domain: `store.yourdomain.com`
4. Configure DNS (follow Vercel instructions)
5. Update Supabase redirect URLs

### Add Custom Domain to Console

1. In Vercel, go to Console project
2. **Settings → Domains**
3. Add domain: `console.yourdomain.com`
4. Configure DNS
5. Update API CORS settings

### Add Custom Domain to API

1. In Vercel, go to API project
2. **Settings → Domains**
3. Add domain: `api.yourdomain.com`
4. Update frontend environment variables

---

## 📊 Monitoring & Maintenance

### Vercel Analytics

Enable in project settings:
- **Analytics**: Track visitor data
- **Speed Insights**: Monitor performance
- **Logs**: Debug production issues

### Supabase Monitoring

Check regularly:
- **Database → Usage**: Monitor database size
- **Authentication → Users**: Track signups
- **API → Logs**: Debug API issues

### Update Deployments

**For API Changes:**
```bash
cd bagdja-api-services
git add .
git commit -m "Update: description"
git push
# Vercel auto-deploys on push
```

**For Frontend Changes:**
```bash
cd bagdja-store-frontend  # or bagdja-console-frontend
git add .
git commit -m "Update: description"
git push
# Vercel auto-deploys on push
```

---

## 🔐 Security Checklist

- [ ] Never commit `.env` files
- [ ] Service Role Key only in API backend (never in frontends)
- [ ] HTTPS enabled on all deployments (Vercel default)
- [ ] CORS properly configured
- [ ] Email verification enabled in production
- [ ] Strong JWT secret used
- [ ] Database backups enabled (Supabase Pro)
- [ ] Rate limiting configured (future enhancement)

---

## 🐛 Troubleshooting

### API Returns CORS Errors

**Solution**: Update `ALLOWED_ORIGINS` in API environment variables
```bash
# In Vercel dashboard
ALLOWED_ORIGINS=https://store.vercel.app,https://console.vercel.app
```

### Frontend Can't Connect to API

**Check**:
1. API URL in frontend `.env` is correct
2. API is deployed and healthy: `curl https://api.vercel.app/api/health`
3. Rebuild frontend after changing env vars

### Authentication Not Working

**Check**:
1. Supabase URL and Anon Key are correct
2. Redirect URLs configured in Supabase
3. JWT Secret matches in API and Supabase

### Products Not Appearing in Store

**Check**:
1. Product status is "published"
2. API can fetch products: `curl https://api.vercel.app/api/products`
3. Frontend is calling correct API endpoint

---

## 📝 Environment Variables Summary

### API Services
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ... (service role)
SUPABASE_JWT_SECRET=your-jwt-secret
ALLOWED_ORIGINS=https://store.vercel.app,https://console.vercel.app
NODE_ENV=production
```

### Store Frontend
```env
VITE_BAGDJA_API_URL=https://api.vercel.app
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (anon key)
```

### Console Frontend
```env
VITE_BAGDJA_API_URL=https://api.vercel.app
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (anon key)
```

### Bagdja Account
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (anon key)
```

---

## 🎉 Deployment Complete!

Your complete Bagdja platform is now live:

- **Account**: `https://bagdja-account.vercel.app` (Authentication Hub)
- **Store**: `https://bagdja-store.vercel.app` (Public Marketplace)
- **Console**: `https://bagdja-console.vercel.app` (Developer Dashboard)
- **API**: `https://bagdja-api.vercel.app` (Backend Services)

### Next Steps

1. Create sample products in Console
2. Test buyer experience in Store
3. Configure custom domains (optional)
4. Enable email notifications
5. Set up analytics and monitoring
6. Plan feature enhancements

---

## 📞 Support

For issues or questions:
- Check individual README files in each repository
- Review Vercel logs for deployment issues
- Check Supabase logs for database issues
- Consult API documentation at `/api` endpoint

