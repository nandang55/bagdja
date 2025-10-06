# 🚀 Deploy Monorepo Bagdja ke Vercel

Panduan deploy semua project dalam monorepo `bagdja` ke Vercel.

---

## 📦 Struktur Monorepo

```
bagdja/ (root)
├── bagdja-account/          → account.bagdja.com
├── bagdja-console-frontend/ → console.bagdja.com
├── bagdja-store-frontend/   → store.bagdja.com
├── bagdja-api-services/     → api.bagdja.com
└── shared/                  → Shared utilities
```

---

## 🎯 Deploy Strategy: Multiple Vercel Projects

Setiap subdirectory di-deploy sebagai **Vercel Project terpisah**.

### Why?
✅ Independent deployments  
✅ Isolated environment variables  
✅ Different build configurations  
✅ Separate domains/subdomains  

---

## 🚀 Quick Deploy Guide

### 1️⃣ bagdja-account (React + Vite)

```bash
# Via Vercel Dashboard
Root Directory: bagdja-account
Framework: Vite
Build Command: npm run build
Output Directory: dist

# Environment Variables
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

📖 **Detailed Guide:** [bagdja-account/DEPLOY_VERCEL.md](bagdja-account/DEPLOY_VERCEL.md)

---

### 2️⃣ bagdja-console-frontend (React + Vite)

```bash
# Via Vercel Dashboard
Root Directory: bagdja-console-frontend
Framework: Vite
Build Command: npm run build
Output Directory: dist

# Environment Variables
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_API_BASE_URL=https://api.bagdja.com
```

---

### 3️⃣ bagdja-store-frontend (React + Vite)

```bash
# Via Vercel Dashboard
Root Directory: bagdja-store-frontend
Framework: Vite
Build Command: npm run build
Output Directory: dist

# Environment Variables
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_API_BASE_URL=https://api.bagdja.com
```

---

### 4️⃣ bagdja-api-services (Node.js + Express)

```bash
# Via Vercel Dashboard
Root Directory: bagdja-api-services
Framework: Other
Build Command: npm run build (or none)
Output Directory: .

# Environment Variables
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc... (service role key!)
API_KEY_SECRET=your-secret-key
NODE_ENV=production
```

📖 **Detailed Guide:** [bagdja-api-services/DEPLOY-VERCEL.md](bagdja-api-services/DEPLOY-VERCEL.md)

---

## 🔧 vercel.json for Each Project

### Frontend Projects (React + Vite)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

### API Project (Node.js)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.ts"
    }
  ]
}
```

---

## 🌐 Domain Configuration

### Option 1: Subdomains (Recommended)

| Project | Subdomain | Vercel Project Name |
|---------|-----------|---------------------|
| Account | `account.bagdja.com` | bagdja-account |
| Console | `console.bagdja.com` | bagdja-console |
| Store | `store.bagdja.com` | bagdja-store |
| API | `api.bagdja.com` | bagdja-api |

**DNS Configuration:**
```
Type: CNAME
Name: account
Value: cname.vercel-dns.com

Type: CNAME
Name: console
Value: cname.vercel-dns.com

Type: CNAME
Name: store
Value: cname.vercel-dns.com

Type: CNAME
Name: api
Value: cname.vercel-dns.com
```

### Option 2: Path-based (Not Recommended for Monorepo)

❌ `bagdja.com/account` → Complex routing  
❌ `bagdja.com/console` → Hard to manage  
✅ Use subdomains instead!  

---

## 📊 Deployment Workflow

### Via Vercel Dashboard (Recommended for First Deploy)

1. **Login to Vercel**: https://vercel.com/dashboard
2. **Import Git Repository** (once)
3. **Create 4 Separate Projects**:
   - Project 1: `bagdja-account` → Root: `bagdja-account`
   - Project 2: `bagdja-console` → Root: `bagdja-console-frontend`
   - Project 3: `bagdja-store` → Root: `bagdja-store-frontend`
   - Project 4: `bagdja-api` → Root: `bagdja-api-services`
4. **Configure Environment Variables** for each
5. **Deploy All Projects**

### Via Vercel CLI (For Subsequent Deploys)

```bash
# Deploy bagdja-account
cd bagdja-account
vercel --prod

# Deploy bagdja-console-frontend
cd ../bagdja-console-frontend
vercel --prod

# Deploy bagdja-store-frontend
cd ../bagdja-store-frontend
vercel --prod

# Deploy bagdja-api-services
cd ../bagdja-api-services
vercel --prod
```

---

## 🔄 Continuous Deployment

Vercel otomatis deploy setiap kali ada push ke Git **jika ada perubahan di directory project tersebut**.

### Git Workflow

```bash
# Push changes
git add .
git commit -m "Update bagdja-account"
git push origin main

# Vercel akan otomatis:
# ✅ Detect changes di bagdja-account/
# ✅ Build & deploy bagdja-account project
# ❌ Skip project lain yang tidak berubah
```

### Branch Strategy

- `main` → Production deployment
- `develop` → Preview deployment
- `feature/*` → Preview URL per PR

---

## 🐛 Common Issues

### ❌ "Could not find package.json"

**Fix:** Pastikan `Root Directory` di-set dengan benar di Vercel Dashboard.

```
✅ Root Directory: bagdja-account
❌ Root Directory: . (salah!)
```

### ❌ Build Error: Module Not Found

**Fix:** Pastikan `shared/` dependencies tidak dipakai, atau copy ke masing-masing project.

```bash
# Option 1: Copy shared utils
cp -r shared/ bagdja-account/src/shared/

# Option 2: Use npm workspace (advanced)
```

### ❌ Environment Variables Not Working

**Fix:**
1. Pastikan prefix sesuai framework:
   - Vite: `VITE_`
   - Next.js: `NEXT_PUBLIC_`
   - Node.js: No prefix
2. Redeploy setelah menambah env var

### ❌ CORS Error Between Projects

**Fix:** Configure CORS di `bagdja-api-services`:

```javascript
app.use(cors({
  origin: [
    'https://account.bagdja.com',
    'https://console.bagdja.com',
    'https://store.bagdja.com'
  ]
}))
```

---

## ✅ Pre-Deployment Checklist

### For All Projects
- [ ] Code pushed to Git
- [ ] `.env` NOT committed (in `.gitignore`)
- [ ] `vercel.json` created
- [ ] Dependencies installed locally (test build)

### For bagdja-account
- [ ] Database migrations run
- [ ] Supabase Auth URLs configured
- [ ] Environment variables ready

### For bagdja-api-services
- [ ] Swagger docs accessible
- [ ] API keys configured
- [ ] Service role key (not anon key!)

---

## 🎉 Post-Deployment

1. **Test All URLs**
   ```
   ✅ https://account.bagdja.com
   ✅ https://console.bagdja.com
   ✅ https://store.bagdja.com
   ✅ https://api.bagdja.com/health
   ```

2. **Configure Supabase Redirect URLs**
   ```
   Site URL: https://account.bagdja.com
   Redirect URLs:
   - https://account.bagdja.com/**
   - https://console.bagdja.com/**
   - https://store.bagdja.com/**
   ```

3. **Update API_BASE_URL in Frontends**
   ```
   VITE_API_BASE_URL=https://api.bagdja.com
   ```

4. **Enable Vercel Analytics** (optional)
   - Vercel Dashboard → Analytics → Enable

5. **Setup Error Monitoring** (optional)
   - Sentry, LogRocket, or Vercel Monitoring

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs/concepts/monorepos
- **Vercel CLI**: https://vercel.com/docs/cli
- **Monorepo Guide**: https://vercel.com/blog/monorepos

---

**Happy Deploying! 🚀**

Each project is independent, scalable, and ready for production.

