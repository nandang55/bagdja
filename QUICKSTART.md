# 🚀 BAGDJA MARKETPLACE - QUICK START GUIDE

Get the entire 3-layer microservices marketplace running locally in 15 minutes.

## 📋 Prerequisites

Install these before starting:
- **Node.js 18+**: [Download here](https://nodejs.org/)
- **Git**: [Download here](https://git-scm.com/)
- **Supabase Account**: [Sign up free](https://supabase.com)

## 🎯 Step-by-Step Setup

### Step 1: Setup Database (5 minutes)

1. **Create Supabase Project**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Name it "bagdja-marketplace"
   - Choose a region and password
   - Wait for provisioning

2. **Run Database Schema**
   - In Supabase dashboard, go to **SQL Editor**
   - Click "New Query"
   - Open `supabase-schema.sql` from the project root
   - Copy entire contents and paste into SQL Editor
   - Click "Run" (bottom right)
   - Verify: Go to **Table Editor** → Should see 8 tables

3. **Get Your Credentials**
   - Go to **Settings → API**
   - Copy these (you'll need them soon):
     ```
     Project URL: https://xxxxx.supabase.co
     anon/public key: eyJ... (starts with eyJ)
     service_role key: eyJ... (different from anon)
     JWT Secret: (under "JWT Settings")
     ```

---

### Step 2: Start API Backend (3 minutes)

```bash
# Navigate to API directory
cd bagdja/bagdja-api-services

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your Supabase credentials
# Use any text editor (nano, vim, VS Code, etc.)
nano .env
```

**Edit `.env` file:**
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...your-service-role-key...
SUPABASE_JWT_SECRET=your-jwt-secret
PORT=3001
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

**Start the API:**
```bash
npm run dev
```

✅ **Verify:** Open http://localhost:3001 in browser
- Should see: `{"service":"BAGDJA API Services","status":"operational"}`

**Keep this terminal running!** Open a new terminal for next step.

---

### Step 3: Start Store Frontend (3 minutes)

```bash
# Navigate to Store directory (new terminal)
cd bagdja/bagdja-store-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
nano .env
```

**Edit `.env` file:**
```env
VITE_BAGDJA_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...
```

**Start the Store:**
```bash
npm run dev
```

✅ **Verify:** Open http://localhost:5173 in browser
- Should see: Bagdja Store home page

**Keep this terminal running!** Open a new terminal for next step.

---

### Step 4: Start Developer Console (3 minutes)

```bash
# Navigate to Console directory (new terminal)
cd bagdja/bagdja-console-frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
nano .env
```

**Edit `.env` file:**
```env
VITE_BAGDJA_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...
```

**Start the Console:**
```bash
npm run dev
```

✅ **Verify:** Open http://localhost:5174 in browser
- Should see: Developer Console login page

---

## 🧪 Step 5: Test the System (5 minutes)

### Test 1: Create Developer Account

1. Go to **Console**: http://localhost:5174
2. Click "Don't have an account? Sign up"
3. Fill form:
   ```
   Name: John Developer
   Email: dev@test.com
   Password: password123
   ```
4. Click "Create Account"
5. **Important**: Check your email OR disable email confirmation:
   - Supabase Dashboard → **Authentication → Settings**
   - Disable "Enable email confirmations"
   - Then sign in with dev@test.com / password123

### Test 2: Create a Product

1. After login, you'll see the Dashboard
2. Click "New Product" button
3. Fill product form:
   ```
   Name: Wireless Headphones
   Category: Electronics
   Price: 99.99
   Stock: 50
   Description: High-quality wireless headphones
   Status: Published
   ```
4. Click "Create Product"
5. ✅ Product appears in your Dashboard

### Test 3: View Product in Store

1. Go to **Store**: http://localhost:5173
2. Browse home page
3. Should see your "Wireless Headphones" product
4. Click on it to view details
5. ✅ All information displays correctly

---

## 🎉 Success! What's Running?

You now have a complete 3-layer architecture:

```
┌─────────────────────────────────────────────┐
│  Store (http://localhost:5173)              │  ← Buyers browse here
└─────────────┬───────────────────────────────┘
              │
┌─────────────┴───────────────────────────────┐
│  Console (http://localhost:5174)            │  ← Sellers manage here
└─────────────┬───────────────────────────────┘
              │
              │ HTTPS REST API
              ↓
┌─────────────────────────────────────────────┐
│  API Services (http://localhost:3001)       │  ← Business logic
└─────────────┬───────────────────────────────┘
              │
              ↓ Service Role Key
┌─────────────────────────────────────────────┐
│  Supabase (PostgreSQL + Auth)               │  ← Data layer
└─────────────────────────────────────────────┘
```

---

## 🔍 Quick Commands Reference

### Start Everything

```bash
# Terminal 1: API
cd bagdja/bagdja-api-services && npm run dev

# Terminal 2: Store  
cd bagdja/bagdja-store-frontend && npm run dev

# Terminal 3: Console
cd bagdja/bagdja-console-frontend && npm run dev
```

### Stop Everything

Press `Ctrl+C` in each terminal

### View Logs

- **API Logs**: Check Terminal 1
- **Store Logs**: Check Terminal 2
- **Console Logs**: Check Terminal 3
- **Database Logs**: Supabase Dashboard → Logs

---

## 🐛 Common Issues & Fixes

### Issue: "Failed to load data"

**Fix**: Check API is running
```bash
curl http://localhost:3001/api/health
```

### Issue: "Invalid token" / Authentication errors

**Fix**: Verify `.env` files have correct Supabase credentials
- Check `SUPABASE_URL` matches across all three
- Anon key in frontends
- Service key only in API

### Issue: Products not appearing in Store

**Check**:
1. Product status is "published" (not draft)
2. API returns products: http://localhost:3001/api/products
3. No errors in browser console (F12)

### Issue: "Port already in use"

**Fix**: Kill existing process
```bash
# Find process on port 3001
lsof -i :3001

# Kill it
kill -9 <PID>
```

### Issue: Database connection fails

**Fix**: Check Supabase project status
- Ensure project is not paused
- Verify Service Role Key is correct
- Check JWT Secret matches

---

## 📚 Next Steps

Now that it's running:

1. **Explore the Code**
   - Check README.md in each subdirectory
   - Review `src/` folders to understand structure

2. **Add More Products**
   - Create various products in Console
   - Use different categories
   - Test published vs draft status

3. **Test User Flows**
   - Sign up as a Buyer in Store
   - Browse and view products
   - Test search and filters

4. **Customize**
   - Modify UI colors in `tailwind.config.js`
   - Add new categories in Supabase
   - Extend API with new endpoints

5. **Deploy to Production**
   - Follow `DEPLOYMENT.md` for Vercel deployment
   - Get your marketplace live!

---

## 📞 Need Help?

- **API Issues**: Check `bagdja-api-services/README.md`
- **Store Issues**: Check `bagdja-store-frontend/README.md`
- **Console Issues**: Check `bagdja-console-frontend/README.md`
- **Database Issues**: Check Supabase dashboard logs
- **Deployment**: Read `DEPLOYMENT.md`

---

## 🎊 You're All Set!

You now have a fully functional marketplace MVP with:
- ✅ Public store for buyers
- ✅ Admin console for sellers
- ✅ Secure API with JWT auth
- ✅ PostgreSQL database with RLS
- ✅ Clean 3-layer architecture

**Happy coding! 🚀**

