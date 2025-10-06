# 🚀 Bagdja Platform - Quick Deployment Summary

## 📦 Platform Overview

Bagdja platform consists of **4 independent services**:

| Service | Technology | Purpose | Deployment |
|---------|-----------|---------|------------|
| **Bagdja Account** | React + Vite + Supabase | Authentication & Account Management | Vercel |
| **API Services** | Node.js + Express + Supabase | Backend Microservices | Vercel |
| **Store Frontend** | React + Vite | Public Marketplace | Vercel |
| **Console Frontend** | React + Vite | Developer Dashboard | Vercel |

---

## ⚡ Quick Deploy Checklist

### 1️⃣ Setup Supabase
- [ ] Create Supabase project
- [ ] Run database migrations (see `supabase/migrations/`)
- [ ] Get API credentials (URL, Anon Key, Service Key)
- [ ] Configure auth settings

### 2️⃣ Deploy Bagdja Account
- [ ] Push code to GitHub
- [ ] Import to Vercel with **Root Directory**: `bagdja-account`
- [ ] Add environment variables:
  ```
  VITE_SUPABASE_URL=https://xxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJ...
  ```
- [ ] Run migrations in Supabase (10 migration files)
- [ ] Test: Login, Profile, Companies, Dark mode
- [ ] URL: `https://bagdja-account.vercel.app`

### 3️⃣ Deploy API Services
- [ ] Push code to GitHub
- [ ] Import to Vercel
- [ ] Add environment variables:
  ```
  SUPABASE_URL=https://xxx.supabase.co
  SUPABASE_SERVICE_KEY=eyJ... (service role!)
  SUPABASE_JWT_SECRET=your-jwt-secret
  ALLOWED_ORIGINS=https://store.vercel.app,https://console.vercel.app
  NODE_ENV=production
  ```
- [ ] Test: `curl https://api.vercel.app/api/health`
- [ ] URL: `https://bagdja-api-services.vercel.app`

### 4️⃣ Deploy Store Frontend
- [ ] Push code to GitHub
- [ ] Import to Vercel
- [ ] Add environment variables:
  ```
  VITE_BAGDJA_API_URL=https://api.vercel.app
  VITE_SUPABASE_URL=https://xxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJ...
  ```
- [ ] Test: Browse products, Sign up, View details
- [ ] URL: `https://bagdja-store.vercel.app`

### 5️⃣ Deploy Console Frontend
- [ ] Push code to GitHub
- [ ] Import to Vercel
- [ ] Add environment variables:
  ```
  VITE_BAGDJA_API_URL=https://api.vercel.app
  VITE_SUPABASE_URL=https://xxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJ...
  ```
- [ ] Test: Sign up as Developer, Create product
- [ ] URL: `https://bagdja-console.vercel.app`

### 6️⃣ Update CORS & Auth URLs
- [ ] Update API `ALLOWED_ORIGINS` in Vercel
- [ ] Update Supabase Site URL: `https://bagdja-account.vercel.app`
- [ ] Add all redirect URLs in Supabase

### 7️⃣ End-to-End Testing
- [ ] Test Bagdja Account features
- [ ] Test Store browsing and auth
- [ ] Test Console product creation
- [ ] Verify products appear in Store

---

## 🔑 Environment Variables Quick Reference

### Bagdja Account
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### API Services
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (service role)
SUPABASE_JWT_SECRET=your-jwt-secret
ALLOWED_ORIGINS=https://bagdja-store.vercel.app,https://bagdja-console.vercel.app
NODE_ENV=production
```

### Store Frontend
```env
VITE_BAGDJA_API_URL=https://bagdja-api-services.vercel.app
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Console Frontend
```env
VITE_BAGDJA_API_URL=https://bagdja-api-services.vercel.app
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🌐 Production URLs

After deployment, you'll have:

```
Authentication Hub: https://bagdja-account.vercel.app
Backend API:        https://bagdja-api-services.vercel.app
Public Store:       https://bagdja-store.vercel.app
Developer Console:  https://bagdja-console.vercel.app
```

---

## ⚠️ Common Issues

### Monorepo Deployment
**Problem**: Build fails or wrong package.json used  
**Solution**: Set **Root Directory** to specific folder (e.g., `bagdja-account`)

### Environment Variables Not Working
**Problem**: Variables undefined in production  
**Solution**: 
- Vite apps: Use `VITE_` prefix
- Redeploy after adding variables
- Check applied to "Production" environment

### Authentication Errors
**Problem**: Can't sign up or login  
**Solution**:
- Verify Supabase URL and keys are correct
- Check redirect URLs in Supabase auth settings
- Ensure Site URL points to bagdja-account deployment

### CORS Errors
**Problem**: API calls blocked by CORS  
**Solution**: Update `ALLOWED_ORIGINS` in API environment variables

---

## 📚 Detailed Guides

- **Full Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Monorepo Strategy**: [DEPLOYMENT_MONOREPO.md](DEPLOYMENT_MONOREPO.md)
- **Quick Start**: [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
- **Account Setup**: [bagdja-account/DEPLOY_VERCEL.md](bagdja-account/DEPLOY_VERCEL.md)
- **Database Setup**: [bagdja-account/SETUP_DATABASE.md](bagdja-account/SETUP_DATABASE.md)

---

## ✅ Post-Deployment Checklist

- [ ] All 4 services deployed successfully
- [ ] Environment variables configured
- [ ] Database migrations executed
- [ ] Supabase auth URLs updated
- [ ] CORS configured correctly
- [ ] Test user can sign up on Account
- [ ] Test user can create profile
- [ ] Test user can create company
- [ ] Test developer can create product in Console
- [ ] Test product appears in Store
- [ ] Enable Vercel Analytics (optional)
- [ ] Configure custom domains (optional)

---

## 🎉 You're Done!

Your complete Bagdja platform is live and ready for users!

**Next Steps:**
1. Create sample products in Console
2. Test buyer experience in Store
3. Monitor with Vercel Analytics
4. Plan feature enhancements

---

**Need Help?** Check the detailed guides linked above or review deployment logs in Vercel dashboard.

