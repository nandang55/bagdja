# 🚀 Bagdja Account - Deployment Guide

Panduan lengkap untuk deploy Bagdja Account Service ke production environment.

## 🎯 Overview

Bagdja Account Service akan di-deploy ke **Vercel** untuk performa optimal dan mudah maintenance. Service ini akan accessible di domain `account.bagdja.com`.

## 🏗️ Production Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION ENVIRONMENT                    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                VERCEL CDN                            │   │
│  │  • Global Edge Network                              │   │
│  │  • Automatic HTTPS                                  │   │
│  │  • Custom Domain Support                           │   │
│  └─────────────────┬───────────────────────────────────┘   │
└─────────────────────┼───────────────────────────────────────┘
                      │
        ┌─────────────▼─────────────────────────────┐
        │         BAGDJA ACCOUNT SERVICE             │
        │  • React SPA (Static Generation)          │
        │  • Client-side Supabase Integration       │
        │  • Service Worker for Offline Support     │
        │  • Environment Variables                   │
        └─────────────────┬─────────────────────────┘
                          │
        ┌─────────────────▼─────────────────────────┐
        │            SUPABASE CLOUD                  │
        │  • PostgreSQL Database                    │
        │  • Supabase Auth                          │
        │  • Row Level Security                     │
        │  • Real-time Features                     │
        │  • Email Templates                        │
        └───────────────────────────────────────────┘
```

## 📋 Prerequisites

Pastikan sudah memiliki:

- **Vercel Account** - [Daftar gratis di sini](https://vercel.com)
- **Domain** - `account.bagdja.com` (atau subdomain lain)
- **Supabase Project** - Sudah setup dan berjalan
- **GitHub Repository** - Code sudah di-push

## 🚀 Deployment Steps

### Step 1: Prepare Production Environment

#### 1.1 Update Environment Variables

Buat file `.env.production`:

```env
# Production Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key

# Production App Configuration
VITE_APP_URL=https://account.bagdja.com
VITE_APP_NAME=Bagdja Account
VITE_APP_ENV=production

# Analytics (Optional)
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn
```

#### 1.2 Update Supabase Configuration

Di Supabase Dashboard:

1. **Authentication → Settings**
   - Site URL: `https://account.bagdja.com`
   - Redirect URLs: 
     - `https://account.bagdja.com/dashboard`
     - `https://account.bagdja.com/auth/callback`
     - `https://account.bagdja.com/reset-password`

2. **Email Templates**
   - Customize email templates dengan branding Bagdja
   - Update sender information

3. **Database → Settings**
   - Enable connection pooling
   - Configure backup settings

#### 1.3 Build Optimization

Update `vite.config.ts` untuk production:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
    sourcemap: false,
    minify: 'terser',
  },
  server: {
    port: 5175,
  },
});
```

### Step 2: Deploy to Vercel

#### 2.1 Connect Repository

1. **Login ke Vercel Dashboard**
   - Buka [vercel.com/dashboard](https://vercel.com/dashboard)
   - Klik "New Project"

2. **Import GitHub Repository**
   - Pilih repository `bagdja-account`
   - Framework Preset: **Vite**
   - Root Directory: `./` (default)

3. **Configure Build Settings**
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

#### 2.2 Set Environment Variables

Di Vercel Dashboard → Project → Settings → Environment Variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_APP_URL=https://account.bagdja.com
VITE_APP_NAME=Bagdja Account
VITE_APP_ENV=production
```

#### 2.3 Deploy

```bash
# Deploy via Vercel CLI (Alternative)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Step 3: Configure Custom Domain

#### 3.1 Add Domain di Vercel

1. **Vercel Dashboard → Project → Settings → Domains**
2. **Add Domain**: `account.bagdja.com`
3. **Configure DNS Records**

#### 3.2 DNS Configuration

Di DNS provider (Cloudflare/GoDaddy/etc):

```
Type: CNAME
Name: account
Value: cname.vercel-dns.com
TTL: 300
```

Atau jika menggunakan A record:

```
Type: A
Name: account
Value: 76.76.19.61
TTL: 300
```

### Step 4: SSL & Security

#### 4.1 SSL Certificate

Vercel otomatis menyediakan SSL certificate via Let's Encrypt. Pastikan:

- ✅ **HTTPS redirect** enabled
- ✅ **HSTS headers** configured
- ✅ **Security headers** setup

#### 4.2 Security Headers

Buat `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

## 🔧 Production Optimizations

### Performance Optimization

#### 1. Code Splitting

```typescript
// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

// Route with Suspense
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
</Suspense>
```

#### 2. Service Worker

Buat `public/sw.js`:

```javascript
const CACHE_NAME = 'bagdja-account-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      }
    )
  );
});
```

#### 3. Image Optimization

```typescript
// Use WebP format with fallback
<img
  src="/images/logo.webp"
  alt="Bagdja Logo"
  onError={(e) => {
    e.currentTarget.src = '/images/logo.png';
  }}
/>
```

### Monitoring & Analytics

#### 1. Error Tracking

Setup Sentry untuk error monitoring:

```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
});

export default Sentry;
```

#### 2. Performance Monitoring

```typescript
// src/lib/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to Google Analytics or your analytics service
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    event_label: metric.id,
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## 🔒 Production Security

### 1. Environment Variables Security

- ✅ **Never commit** `.env` files
- ✅ **Use Vercel Environment Variables**
- ✅ **Rotate keys** regularly
- ✅ **Monitor access logs**

### 2. Supabase Security

```sql
-- Enable additional security policies
CREATE POLICY "Prevent profile deletion" ON public.profiles
  FOR DELETE USING (false);

-- Add audit logging
CREATE TABLE public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Rate Limiting

```typescript
// Client-side rate limiting
const rateLimiter = {
  attempts: new Map(),
  
  canAttempt(key: string, maxAttempts = 5, windowMs = 60000) {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || { count: 0, resetTime: now + windowMs };
    
    if (now > userAttempts.resetTime) {
      userAttempts.count = 0;
      userAttempts.resetTime = now + windowMs;
    }
    
    return userAttempts.count < maxAttempts;
  },
  
  recordAttempt(key: string) {
    const userAttempts = this.attempts.get(key) || { count: 0, resetTime: Date.now() + 60000 };
    userAttempts.count++;
    this.attempts.set(key, userAttempts);
  }
};
```

## 📊 Monitoring & Maintenance

### 1. Health Checks

Buat health check endpoint:

```typescript
// src/pages/HealthCheck.tsx
export default function HealthCheck() {
  const [status, setStatus] = useState('checking');
  
  useEffect(() => {
    // Check Supabase connection
    supabase.from('profiles').select('count').limit(1)
      .then(() => setStatus('healthy'))
      .catch(() => setStatus('unhealthy'));
  }, []);
  
  return (
    <div>
      <h1>Health Check</h1>
      <p>Status: {status}</p>
    </div>
  );
}
```

### 2. Logging

```typescript
// src/lib/logger.ts
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
    // Send to error tracking service
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  }
};

export default logger;
```

### 3. Backup Strategy

- ✅ **Database backups** via Supabase (automatic)
- ✅ **Code backups** via Git repository
- ✅ **Environment variables** documented
- ✅ **Deployment logs** maintained

## 🚨 Troubleshooting

### Common Production Issues

#### Issue: "Build fails on Vercel"

**Solutions:**
1. Check Node.js version in `package.json`
2. Verify all dependencies are listed
3. Check build logs in Vercel dashboard

#### Issue: "Environment variables not working"

**Solutions:**
1. Verify variables set in Vercel dashboard
2. Redeploy after changing variables
3. Check variable names match exactly

#### Issue: "Supabase connection fails"

**Solutions:**
1. Verify production Supabase URL
2. Check CORS settings
3. Verify API keys are correct

#### Issue: "Custom domain not working"

**Solutions:**
1. Check DNS propagation (can take 24-48 hours)
2. Verify DNS records are correct
3. Check SSL certificate status

## ✅ Post-Deployment Checklist

- [ ] **Site accessible** at custom domain
- [ ] **HTTPS working** (green lock icon)
- [ ] **All pages loading** correctly
- [ ] **Authentication working** (register/login)
- [ ] **Database operations** successful
- [ ] **Performance metrics** acceptable
- [ ] **Error monitoring** active
- [ ] **Analytics tracking** working
- [ ] **Backup strategy** in place
- [ ] **Documentation** updated

## 🔄 CI/CD Pipeline

### GitHub Actions

Buat `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
      
      - name: Build project
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./
```

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Production Guide](https://supabase.com/docs/guides/platform)
- [React Production Best Practices](https://react.dev/learn)
- [Web Performance Best Practices](https://web.dev/performance/)

---

**Production Ready! 🎉**

Your Bagdja Account Service is now live at `https://account.bagdja.com`
