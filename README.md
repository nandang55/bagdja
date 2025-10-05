# BAGDJA MARKETPLACE - 3-Layer Microservices MVP

A secure and scalable marketplace demonstrating clean separation of concerns with a 3-layer architecture.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
│  ┌──────────────────────┐  ┌──────────────────────────┐    │
│  │  Store Frontend      │  │  Console Frontend        │    │
│  │  (Public Buyers)     │  │  (Developers/Sellers)    │    │
│  └──────────┬───────────┘  └───────────┬──────────────┘    │
└─────────────┼──────────────────────────┼────────────────────┘
              │                          │
              └──────────┬───────────────┘
                         │ HTTPS/REST
              ┌──────────▼──────────────────────────────────┐
              │         API SERVICES LAYER                  │
              │  ┌────────────┐  ┌────────────┐            │
              │  │Auth Service│  │Product Svc │            │
              │  └────────────┘  └────────────┘            │
              │  - JWT Validation  - Owner Isolation       │
              └──────────┬──────────────────────────────────┘
                         │ Service Role Key
              ┌──────────▼──────────────────────────────────┐
              │         DATA LAYER (SUPABASE)               │
              │  - PostgreSQL Database                      │
              │  - Auth Management                          │
              │  - Storage                                  │
              └─────────────────────────────────────────────┘
```

## 📁 Repository Structure

```
bagdja/
├── bagdja-store-frontend/      # Public marketplace (Buyers)
├── bagdja-console-frontend/    # Developer dashboard (Sellers)
├── bagdja-api-services/        # Microservices API Gateway
└── supabase-schema.sql         # Database schema
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase Account
- Supabase CLI (for migrations)
- Vercel Account (for deployment)

### 1. Setup Database

**Option A: Cloud Supabase (No Docker Required)** ⭐ Recommended
1. Create project at https://supabase.com
2. Run `supabase-schema.sql` in SQL Editor
3. Get credentials from Settings → API
4. Follow: **[SETUP-CLOUD-SUPABASE.md](./SETUP-CLOUD-SUPABASE.md)**

**Option B: Local Supabase (Requires Docker)**
```bash
# Install Supabase CLI & Docker Desktop first
brew install supabase/tap/supabase

# Start local development
cd bagdja
supabase start
supabase db push
```

📚 **Full Migration Guide**: [MIGRATIONS.md](./MIGRATIONS.md) | [Cloud Setup](./SETUP-CLOUD-SUPABASE.md)

### 2. Setup API Services
```bash
cd bagdja-api-services
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

### 3. Setup Store Frontend
```bash
cd bagdja-store-frontend
npm install
cp .env.example .env
# Edit .env with API URL
npm run dev
```

### 4. Setup Console Frontend
```bash
cd bagdja-console-frontend
npm install
cp .env.example .env
# Edit .env with API URL
npm run dev
```

## 🔒 Security Model

### Data Flow Rules
1. **Frontend → API Only**: Frontends NEVER call Supabase directly
2. **API → Supabase**: API uses Service Role Key with business logic enforcement
3. **JWT Validation**: All protected routes validate tokens
4. **Owner Isolation**: Developers can only modify their own products

### Authentication Flow
1. User signs in via Supabase Auth (client-side)
2. Frontend receives JWT token
3. Frontend sends token in `Authorization: Bearer {token}` header
4. API validates token and extracts user ID
5. API enforces owner-based access control

## 📊 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite + TailwindCSS |
| **API** | Node.js + Express + TypeScript |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth + JWT |
| **Deployment** | Vercel (Frontend) + Vercel Serverless (API) |

## 🎯 MVP Features

### Store Frontend
- ✅ Public product browsing
- ✅ Category filtering
- ✅ Product detail pages
- ✅ Buyer authentication

### Console Frontend
- ✅ Developer authentication
- ✅ Product management (CRUD)
- ✅ Owner-restricted access
- ✅ Protected routes

### API Services
- ✅ Auth service (token validation)
- ✅ Products service (public + protected CRUD)
- ✅ Owner isolation logic
- ✅ Microservices architecture

## 📝 Environment Variables

### API Services
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
SUPABASE_JWT_SECRET=your-jwt-secret
PORT=3001
```

### Frontends
```
VITE_BAGDJA_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## 🚢 Deployment

### API Services (Vercel)
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Frontends (Vercel)
1. Push code to GitHub
2. Import each frontend separately to Vercel
3. Add environment variables
4. Deploy

## 📖 Documentation

### Getting Started
- [START HERE](./START-HERE.md) - Begin here!
- [Quick Start Guide](./QUICKSTART.md) - 15-minute setup
- [Project Structure](./PROJECT-STRUCTURE.md) - Architecture details
- [Deployment Guide](./DEPLOYMENT.md) - Deploy to production

### Database Migrations
- [Migration Guide](./MIGRATIONS.md) - Complete migration documentation
- [Migration Quick Start](./MIGRATIONS-QUICKSTART.md) - 5-minute setup

### Component Documentation
- [Store Frontend README](./bagdja-store-frontend/README.md)
- [Console Frontend README](./bagdja-console-frontend/README.md)
- [API Services README](./bagdja-api-services/README.md)

### Additional Resources
- [Checklist](./CHECKLIST.md) - Verification checklist
- [Contributing](./CONTRIBUTING.md) - Contribution guidelines

## 🤝 Contributing

This is an MVP project. For production use, consider:
- Rate limiting
- Caching layer (Redis)
- API versioning
- Comprehensive error handling
- Unit and integration tests
- CI/CD pipelines

## 📄 License

MIT License - See LICENSE file in each repository

