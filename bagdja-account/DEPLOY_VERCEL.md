# 🚀 Deploy Bagdja Account ke Vercel (Monorepo)

Panduan lengkap untuk deploy project `bagdja-account` dari monorepo `bagdja` ke Vercel.

---

## 📋 Prerequisites

✅ Akun Vercel (https://vercel.com)  
✅ GitHub/GitLab/Bitbucket repository  
✅ Supabase project sudah setup (URL + Anon Key)  
✅ Database migrations sudah dijalankan  

---

## 🎯 Metode 1: Deploy via Vercel Dashboard (Recommended untuk Monorepo)

### Step 1: Push Code ke Git Repository

```bash
cd /Users/nandanghermawan/Project/bagdja
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Import Project di Vercel

1. **Buka Vercel Dashboard**: https://vercel.com/dashboard
2. **Klik "Add New..."** → **"Project"**
3. **Import Git Repository**: Pilih repository `bagdja`
4. **Configure Project**:

   ```
   Framework Preset: Vite
   Root Directory: bagdja-account  ⚠️ PENTING (untuk monorepo)
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

5. **Environment Variables** (klik "Environment Variables"):
   
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

   > 💡 **Cara mendapatkan Supabase credentials:**
   > - Login ke https://supabase.com/dashboard
   > - Pilih project Anda
   > - Settings → API
   > - Copy "Project URL" dan "anon public" key

6. **Deploy**: Klik **"Deploy"**

### Step 3: Tunggu Build Selesai

Vercel akan:
- Install dependencies dari `bagdja-account/package.json`
- Build project dengan `npm run build`
- Deploy ke production URL (contoh: `bagdja-account-xxx.vercel.app`)

---

## 🎯 Metode 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login ke Vercel

```bash
vercel login
```

### Step 3: Deploy dari Directory bagdja-account

```bash
cd /Users/nandanghermawan/Project/bagdja/bagdja-account
vercel
```

### Step 4: Follow Prompts

```bash
? Set up and deploy "bagdja-account"? [Y/n] Y
? Which scope? [Pilih account Anda]
? Link to existing project? [N]
? What's your project's name? bagdja-account
? In which directory is your code located? ./
? Want to override the settings? [y/N] y
   - Build Command: npm run build
   - Output Directory: dist
   - Development Command: npm run dev
```

### Step 5: Set Environment Variables

```bash
vercel env add VITE_SUPABASE_URL
[paste your Supabase URL]

vercel env add VITE_SUPABASE_ANON_KEY
[paste your Supabase Anon Key]
```

### Step 6: Deploy to Production

```bash
vercel --prod
```

---

## 🔧 vercel.json Configuration

File `vercel.json` sudah dibuat dengan konfigurasi optimal:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

---

## 🌐 Custom Domain (Optional)

### Step 1: Buka Project Settings di Vercel

Dashboard → Project `bagdja-account` → Settings → Domains

### Step 2: Add Domain

```
account.bagdja.com
```

### Step 3: Configure DNS

Tambahkan DNS record di domain provider Anda:

```
Type: CNAME
Name: account
Value: cname.vercel-dns.com
```

Atau untuk apex domain:

```
Type: A
Name: @
Value: 76.76.21.21
```

---

## 🔒 Environment Variables (Production)

Pastikan environment variables sudah di-set di Vercel:

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1N...` | Supabase → Settings → API |

> ⚠️ **JANGAN commit file `.env` ke Git!**

---

## 📊 Monitoring & Logs

### Lihat Deployment Logs

1. Vercel Dashboard → Project → Deployments
2. Klik deployment terakhir
3. Lihat "Build Logs" dan "Functions Logs"

### Lihat Analytics

Vercel Dashboard → Project → Analytics
- Pageviews
- Top Pages
- Visitor Locations
- Performance Metrics

---

## 🐛 Troubleshooting

### ❌ Build Error: "Could not resolve entry module"

**Fix:**
```bash
# Pastikan vercel.json ada di bagdja-account/
cd bagdja-account
cat vercel.json
```

### ❌ Environment Variables Not Working

**Fix:**
1. Pastikan variabel dimulai dengan `VITE_` (bukan `REACT_APP_`)
2. Vercel Dashboard → Settings → Environment Variables
3. Pastikan variabel applied untuk "Production", "Preview", "Development"
4. Redeploy project

### ❌ 404 on Page Refresh (React Router)

Vite + React Router sudah otomatis handle ini. Jika masih error, tambahkan di `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### ❌ CORS Error

Jika ada CORS error dari Supabase:
1. Supabase Dashboard → Settings → API
2. "Site URL" → Tambahkan URL Vercel Anda
3. "Redirect URLs" → Tambahkan `https://your-app.vercel.app/**`

---

## 🔄 Auto Deploy (Continuous Deployment)

Vercel otomatis deploy setiap kali ada push ke Git:

- **Push ke `main` branch** → Deploy ke Production
- **Push ke branch lain** → Deploy Preview URL
- **Pull Request** → Deploy Preview dengan unique URL

### Disable Auto Deploy (Optional)

Vercel Dashboard → Settings → Git → "Ignored Build Step"

---

## 📂 Multiple Projects dalam Monorepo

Jika ingin deploy semua project dari monorepo `bagdja`:

### 1. bagdja-account
```
Root Directory: bagdja-account
Project Name: bagdja-account
URL: account.bagdja.com
```

### 2. bagdja-console-frontend
```
Root Directory: bagdja-console-frontend
Project Name: bagdja-console
URL: console.bagdja.com
```

### 3. bagdja-store-frontend
```
Root Directory: bagdja-store-frontend
Project Name: bagdja-store
URL: store.bagdja.com
```

### 4. bagdja-api-services
```
Root Directory: bagdja-api-services
Project Name: bagdja-api
URL: api.bagdja.com
Framework: Node.js (bukan Vite)
```

Setiap project di-deploy sebagai **Vercel project terpisah** dengan **Root Directory berbeda**.

---

## ✅ Checklist Deployment

- [ ] Code sudah di-push ke Git
- [ ] Database migrations sudah dijalankan di Supabase
- [ ] Environment variables sudah di-set di Vercel
- [ ] `vercel.json` ada di `bagdja-account/`
- [ ] Build berhasil (check Build Logs)
- [ ] Website bisa diakses di production URL
- [ ] Login/Register berfungsi
- [ ] Dark mode berfungsi
- [ ] Favicon muncul di tab browser
- [ ] Profile page berfungsi
- [ ] Company CRUD berfungsi
- [ ] Company transfer berfungsi
- [ ] Ownership logs muncul

---

## 🎉 Production URLs

Setelah deploy, Anda akan mendapat URLs seperti:

```
Production: https://bagdja-account-xxx.vercel.app
Preview: https://bagdja-account-git-feature-xxx.vercel.app
Custom: https://account.bagdja.com
```

---

## 🚀 Next Steps After Deployment

1. **Setup Custom Domain** (optional)
2. **Enable Vercel Analytics** (free)
3. **Setup Error Monitoring** (Sentry/LogRocket)
4. **Configure Supabase Auth Redirect URLs**
5. **Test all features di production**

---

## 📞 Support

Jika ada masalah:
- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://discord.com/invite/vercel
- Supabase Docs: https://supabase.com/docs

---

**Happy Deploying! 🚀**

