# 🚀 DEPLOY BAGDJA API SERVICES KE VERCEL

Panduan lengkap deploy API backend ke Vercel.

## 📋 Prerequisites

- ✅ Akun GitHub
- ✅ Akun Vercel (https://vercel.com - gratis)
- ✅ Code sudah ready (Swagger included!)

---

## 🎯 OPTION 1: Via Vercel Dashboard (Termudah) ⭐

### **Step 1: Push Code ke GitHub**

```bash
cd /Users/nandanghermawan/Project/bagdja/bagdja-api-services

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Bagdja API Services with Swagger"

# Create repo di GitHub:
# 1. Buka github.com
# 2. Click "+" → "New repository"
# 3. Name: bagdja-api-services
# 4. Public atau Private
# 5. JANGAN centang "Add README" (sudah ada)
# 6. Click "Create repository"

# Connect & push
git remote add origin https://github.com/YOUR_USERNAME/bagdja-api-services.git
git branch -M main
git push -u origin main
```

### **Step 2: Import ke Vercel**

1. **Login ke Vercel**: https://vercel.com
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Select **"bagdja-api-services"** dari list
5. Click **"Import"**

### **Step 3: Configure Project**

**Framework Preset:** Other (atau auto-detect)

**Build & Development Settings:**
- Build Command: `npm run build` (atau kosongkan)
- Output Directory: `dist` (atau kosongkan)
- Install Command: `npm install`
- Development Command: `npm run dev`

**Root Directory:** `./` (default)

### **Step 4: Add Environment Variables**

Di halaman configure, scroll ke **Environment Variables**:

Click **"Add"** untuk setiap variable:

```
Key: SUPABASE_URL
Value: https://vwtvghzabftcikbxtwad.supabase.co

Key: SUPABASE_SERVICE_KEY
Value: [paste service role key dari Supabase]

Key: SUPABASE_JWT_SECRET
Value: [paste JWT secret dari Supabase]

Key: ALLOWED_ORIGINS
Value: http://localhost:5173,http://localhost:5174

Key: NODE_ENV
Value: production
```

⚠️ **PENTING:** Service Role Key adalah SECRET! Jangan share atau commit ke git.

### **Step 5: Deploy**

Click **"Deploy"** → Tunggu 1-3 menit

✅ Deployment akan muncul di: `https://bagdja-api-services.vercel.app`

### **Step 6: Update CORS After Frontend Deploy**

Setelah frontend di-deploy, update `ALLOWED_ORIGINS`:

1. Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. Edit `ALLOWED_ORIGINS`
3. Tambahkan production URLs:
   ```
   https://bagdja-store.vercel.app,https://bagdja-console.vercel.app
   ```
4. **Redeploy**: Deployments → Latest → Three dots → Redeploy

---

## 🎯 OPTION 2: Via Vercel CLI (Power Users)

### **Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

### **Step 2: Login**

```bash
vercel login
```

Browser akan terbuka untuk authentication.

### **Step 3: Deploy (First Time)**

```bash
cd /Users/nandanghermawan/Project/bagdja/bagdja-api-services

# Deploy to preview
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - Project name? bagdja-api-services
# - In which directory? ./
# - Override settings? No
```

### **Step 4: Add Environment Variables**

```bash
# Add each env variable
vercel env add SUPABASE_URL production
# Paste value: https://vwtvghzabftcikbxtwad.supabase.co

vercel env add SUPABASE_SERVICE_KEY production
# Paste value: [your service role key]

vercel env add SUPABASE_JWT_SECRET production
# Paste value: [your jwt secret]

vercel env add ALLOWED_ORIGINS production
# Paste value: https://bagdja-store.vercel.app,https://bagdja-console.vercel.app

vercel env add NODE_ENV production
# Paste value: production
```

### **Step 5: Deploy to Production**

```bash
vercel --prod
```

**Output:**
```
✅ Production: https://bagdja-api-services.vercel.app
```

---

## ✅ VERIFY DEPLOYMENT

### **Test 1: Basic Health**

```bash
curl https://bagdja-api-services.vercel.app
```

**Expected:**
```json
{
  "service": "BAGDJA API Services",
  "version": "1.0.0",
  "status": "operational",
  "endpoints": {
    "auth": "/api/auth",
    "products": "/api/products",
    "docs": "/api-docs"
  }
}
```

### **Test 2: Health Check**

```bash
curl https://bagdja-api-services.vercel.app/api/health
```

### **Test 3: Products Endpoint**

```bash
curl https://bagdja-api-services.vercel.app/api/products
```

### **Test 4: Swagger Docs**

Buka di browser:
```
https://bagdja-api-services.vercel.app/api-docs
```

✅ Seharusnya muncul Swagger UI!

---

## 📊 PRODUCTION CHECKLIST

- [ ] API deployed successfully
- [ ] Environment variables configured
- [ ] Health check passes
- [ ] Swagger docs accessible
- [ ] CORS configured properly
- [ ] API URL saved for frontend config
- [ ] Database connection works
- [ ] JWT validation works

---

## 🔄 UPDATE & REDEPLOY

### **Method 1: Git Push (Auto Deploy)**

```bash
cd /Users/nandanghermawan/Project/bagdja/bagdja-api-services

# Make changes
git add .
git commit -m "Update: add new feature"
git push

# Vercel will auto-deploy!
```

### **Method 2: Manual Redeploy**

1. Vercel Dashboard
2. Go to project
3. **Deployments** tab
4. Click latest deployment → Three dots → **Redeploy**

### **Method 3: CLI**

```bash
vercel --prod
```

---

## 🌐 CUSTOM DOMAIN (Optional)

### **Add Custom Domain:**

1. Vercel Dashboard → Project → **Settings** → **Domains**
2. Click **"Add"**
3. Enter domain: `api.bagdja.com`
4. Follow DNS configuration instructions
5. Wait for SSL provisioning (~5 minutes)

**Update frontend .env:**
```env
VITE_BAGDJA_API_URL=https://api.bagdja.com
```

---

## 📊 MONITORING

### **Vercel Analytics**

Enable di: Settings → Analytics
- Request count
- Response times
- Error rates
- Geographic distribution

### **Vercel Logs**

View logs di: Deployments → Click deployment → **Logs**

Real-time logs:
```bash
vercel logs [deployment-url] --follow
```

### **Error Tracking**

Add Sentry (optional):
```bash
npm install @sentry/node
```

---

## 🔐 SECURITY CHECKLIST

- [ ] `.env` TIDAK di-commit ke git
- [ ] Service Role Key di environment variables Vercel
- [ ] CORS configured untuk production domains
- [ ] HTTPS enabled (automatic by Vercel)
- [ ] JWT secret secure
- [ ] No sensitive data in logs

---

## 🐛 TROUBLESHOOTING

### **Build Failed**

**Check:**
- TypeScript errors: `npm run type-check`
- Missing dependencies: `npm install`
- Build command in vercel.json

**Fix:**
```bash
# Test build locally
npm run build

# Check output
ls dist/
```

### **Runtime Error: "Cannot find module"**

**Fix:** Update `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ]
}
```

### **Database Connection Error**

**Check:**
- Environment variables configured correctly
- Supabase project not paused
- Service role key is valid

### **CORS Error**

**Fix:** Update `ALLOWED_ORIGINS`:
```
https://your-store.vercel.app,https://your-console.vercel.app
```

Then redeploy.

### **404 Errors on Routes**

**Check `vercel.json`:**
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.ts"
    }
  ]
}
```

---

## 💡 TIPS & BEST PRACTICES

### **1. Environment Variables**

Gunakan Vercel dashboard untuk manage env vars, JANGAN hardcode!

### **2. Logging**

Add console.log untuk debugging:
```typescript
console.log('API started on port', PORT);
```

View di Vercel Logs.

### **3. Error Handling**

Always return proper HTTP status codes:
- 200: Success
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Server error

### **4. Performance**

- Keep functions lightweight
- Use database indexes
- Cache frequent queries
- Optimize JSON responses

### **5. Monitoring**

Check regularly:
- Response times
- Error rates
- Database query performance

---

## 🚀 QUICK DEPLOY CHECKLIST

```bash
# 1. Build locally to test
cd /Users/nandanghermawan/Project/bagdja/bagdja-api-services
npm run build

# 2. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push

# 3. Deploy via Vercel
vercel --prod

# 4. Set environment variables
vercel env add SUPABASE_URL production
vercel env add SUPABASE_SERVICE_KEY production
vercel env add SUPABASE_JWT_SECRET production
vercel env add ALLOWED_ORIGINS production

# 5. Redeploy
vercel --prod

# 6. Test
curl https://bagdja-api-services.vercel.app/api/health
```

---

## 📚 NEXT STEPS

After API deployed:

1. **Deploy Store Frontend**
   - Update `VITE_BAGDJA_API_URL` to production
   - Deploy to Vercel
   - Update CORS in API

2. **Deploy Console Frontend**
   - Update `VITE_BAGDJA_API_URL` to production
   - Deploy to Vercel

3. **Test End-to-End**
   - Create product in Console
   - View in Store
   - Verify all works

4. **Setup Monitoring**
   - Enable Vercel Analytics
   - Check logs regularly
   - Monitor errors

---

## 🎉 SUCCESS!

Your API is now live and globally distributed via Vercel's edge network! 🌍

**Production URL**: https://bagdja-api-services.vercel.app
**Swagger Docs**: https://bagdja-api-services.vercel.app/api-docs

---

**Ready to deploy? Follow the steps above!** 🚀

