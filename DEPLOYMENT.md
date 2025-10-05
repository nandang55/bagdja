# BAGDJA MARKETPLACE - DEPLOYMENT GUIDE

Complete guide for deploying the 3-layer microservices architecture to production.

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

## 🔧 Step 2: Deploy API Services (Backend Layer)

### 2.1 Prepare Repository

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

### 2.2 Deploy to Vercel

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

### 2.3 Verify API Deployment

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

### 2.4 Note Your API URL

Save your API URL for frontend configuration:
```
https://bagdja-api-services.vercel.app
```

---

## 🏪 Step 3: Deploy Store Frontend (Public Store)

### 3.1 Prepare Repository

```bash
cd bagdja-store-frontend

git init
git add .
git commit -m "Initial commit - Store Frontend"
git remote add origin https://github.com/yourusername/bagdja-store-frontend.git
git branch -M main
git push -u origin main
```

### 3.2 Deploy to Vercel

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

### 3.3 Verify Store Deployment

1. Open your store URL: `https://bagdja-store.vercel.app`
2. Check home page loads
3. Verify products fetch from API
4. Test authentication (sign up/sign in)

---

## 🔨 Step 4: Deploy Console Frontend (Developer Dashboard)

### 4.1 Prepare Repository

```bash
cd bagdja-console-frontend

git init
git add .
git commit -m "Initial commit - Console Frontend"
git remote add origin https://github.com/yourusername/bagdja-console-frontend.git
git branch -M main
git push -u origin main
```

### 4.2 Deploy to Vercel

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

### 4.3 Verify Console Deployment

1. Open console URL: `https://bagdja-console.vercel.app`
2. Sign up with a new account
3. Verify Dashboard loads
4. Test creating a product
5. Check product appears in Store Frontend

---

## 🔄 Step 5: Update CORS & URLs

### 5.1 Update API CORS Settings

In Vercel dashboard for API Services:
1. Go to **Settings → Environment Variables**
2. Edit `ALLOWED_ORIGINS`:
   ```
   https://bagdja-store.vercel.app,https://bagdja-console.vercel.app
   ```
3. Redeploy: **Deployments → Three dots → Redeploy**

### 5.2 Update Supabase Auth URLs

In Supabase dashboard:
1. Go to **Authentication → URL Configuration**
2. Set **Site URL**: `https://bagdja-store.vercel.app`
3. Add **Redirect URLs**:
   ```
   https://bagdja-store.vercel.app/**
   https://bagdja-console.vercel.app/**
   ```

---

## ✅ Step 6: Testing End-to-End

### 6.1 Test Store Frontend (Public)

1. Visit store: `https://bagdja-store.vercel.app`
2. Browse products
3. View product detail
4. Sign up as Buyer
5. Sign in and verify session

### 6.2 Test Developer Console

1. Visit console: `https://bagdja-console.vercel.app`
2. Sign up as Developer
3. Create a product
4. Edit the product
5. Set status to "published"

### 6.3 Verify Data Flow

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

---

## 🎉 Deployment Complete!

Your 3-layer microservices marketplace is now live:

- **Store**: `https://bagdja-store.vercel.app`
- **Console**: `https://bagdja-console.vercel.app`
- **API**: `https://bagdja-api.vercel.app`

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

