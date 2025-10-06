# ⚡ Quick Deploy - Bagdja Monorepo ke Vercel

## 🎯 Deploy dalam 5 Menit

### Step 1: Push ke Git

```bash
cd /Users/nandanghermawan/Project/bagdja
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Import di Vercel

1. **Login**: https://vercel.com/dashboard
2. **New Project** → Import Git Repository → Pilih `bagdja`

### Step 3: Deploy bagdja-account

| Setting | Value |
|---------|-------|
| **Project Name** | `bagdja-account` |
| **Root Directory** | `bagdja-account` ⚠️ |
| **Framework** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

**Environment Variables:**
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

4. **Click Deploy** 🚀

---

## 🔑 Cara Ambil Supabase Credentials

1. Login: https://supabase.com/dashboard
2. Pilih project Anda
3. **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

## 📂 Deploy Project Lainnya

Ulangi **Step 3** dengan **Root Directory berbeda**:

| Project | Root Directory | Framework |
|---------|----------------|-----------|
| bagdja-account | `bagdja-account` | Vite |
| bagdja-console-frontend | `bagdja-console-frontend` | Vite |
| bagdja-store-frontend | `bagdja-store-frontend` | Vite |
| bagdja-api-services | `bagdja-api-services` | Node.js |

---

## ✅ Checklist

- [ ] Code di-push ke Git
- [ ] Database migrations sudah dijalankan
- [ ] Root Directory **benar** (bukan `.` atau `/`)
- [ ] Environment variables sudah diisi
- [ ] Build berhasil (check logs)
- [ ] Website bisa diakses

---

## 🐛 Troubleshooting

### ❌ Build Error: "Cannot find module"
**Fix:** Pastikan `Root Directory` = `bagdja-account` (bukan `.`)

### ❌ Blank Page / 404
**Fix:** Check Console → Pastikan `VITE_SUPABASE_URL` sudah benar

### ❌ "Package.json not found"
**Fix:** Vercel Dashboard → Settings → Root Directory → Set ke `bagdja-account`

---

## 📖 Detailed Guides

- **bagdja-account**: [DEPLOY_VERCEL.md](bagdja-account/DEPLOY_VERCEL.md)
- **Monorepo Full Guide**: [DEPLOYMENT_MONOREPO.md](DEPLOYMENT_MONOREPO.md)

---

**Done! 🎉**

Your app will be live at: `https://bagdja-account-xxx.vercel.app`

