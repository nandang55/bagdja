# 📁 BAGDJA MARKETPLACE - PROJECT STRUCTURE

Complete file tree and architecture documentation for the 3-layer microservices MVP.

## 🌲 Complete Directory Tree

```
bagdja/
│
├── README.md                          # Main project documentation
├── QUICKSTART.md                      # 15-min setup guide
├── DEPLOYMENT.md                      # Production deployment guide
├── PROJECT-STRUCTURE.md               # This file
├── supabase-schema.sql                # Database schema
│
├── bagdja-api-services/               # 🔧 API BACKEND (Layer 2)
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.ts            # Supabase client config
│   │   ├── middleware/
│   │   │   └── auth.ts                # JWT validation middleware
│   │   ├── services/
│   │   │   ├── auth-service.ts        # Auth endpoints
│   │   │   └── products-service.ts    # Product CRUD endpoints
│   │   └── server.ts                  # Express app entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── .gitignore
│   ├── vercel.json                    # Vercel deployment config
│   └── README.md
│
├── bagdja-store-frontend/             # 🛒 STORE FRONTEND (Layer 1)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.tsx             # Header/Footer layout
│   │   │   └── ProductCard.tsx        # Product display component
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx        # Auth state management
│   │   ├── lib/
│   │   │   ├── api.ts                 # API client
│   │   │   └── supabase.ts            # Supabase client (auth only)
│   │   ├── pages/
│   │   │   ├── HomePage.tsx           # Landing page
│   │   │   ├── StorePage.tsx          # Product listing
│   │   │   ├── ProductDetailPage.tsx  # Product details
│   │   │   └── LoginPage.tsx          # Buyer authentication
│   │   ├── config/
│   │   │   └── env.ts                 # Environment config
│   │   ├── App.tsx                    # React Router setup
│   │   ├── main.tsx                   # Entry point
│   │   └── index.css                  # Global styles
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   ├── .gitignore
│   └── README.md
│
└── bagdja-console-frontend/           # 🔨 CONSOLE FRONTEND (Layer 1)
    ├── src/
    │   ├── components/
    │   │   ├── Layout.tsx             # Sidebar navigation
    │   │   └── ProtectedRoute.tsx     # Role-based route guard
    │   ├── contexts/
    │   │   └── AuthContext.tsx        # Auth state management
    │   ├── lib/
    │   │   ├── api.ts                 # API client
    │   │   └── supabase.ts            # Supabase client (auth only)
    │   ├── pages/
    │   │   ├── LoginPage.tsx          # Developer authentication
    │   │   ├── DashboardPage.tsx      # Product overview
    │   │   ├── ProductCreatePage.tsx  # Create product form
    │   │   └── ProductEditPage.tsx    # Edit product form
    │   ├── config/
    │   │   └── env.ts                 # Environment config
    │   ├── App.tsx                    # React Router with protected routes
    │   ├── main.tsx                   # Entry point
    │   └── index.css                  # Global styles
    ├── public/
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    ├── .gitignore
    └── README.md
```

## 🏛️ Architecture Layers

### Layer 1: Frontend Applications

**Store Frontend** (Public)
- Technology: React 18 + Vite + TailwindCSS
- Port: 5173
- Purpose: Public marketplace for buyers
- Authentication: Buyer role
- Data Access: Via API only

**Console Frontend** (Protected)
- Technology: React 18 + Vite + TailwindCSS
- Port: 5174
- Purpose: Product management for developers
- Authentication: Developer/Admin role required
- Data Access: Via API only (owner-restricted)

### Layer 2: API Services (Backend)

**API Gateway**
- Technology: Node.js + Express + TypeScript
- Port: 3001
- Purpose: Business logic and security enforcement
- Features:
  - JWT token validation
  - Role-based access control
  - Owner isolation logic
  - Microservices architecture
- Security: Uses Supabase Service Role Key

### Layer 3: Database & Auth

**Supabase**
- Technology: PostgreSQL + Auth service
- Purpose: Data persistence and authentication
- Tables: users, products, categories, reviews, transactions, messages
- RLS: Disabled (security handled by API layer)
- Auth: JWT-based with roles

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND LAYER (Presentation)               │
│  ┌────────────────────────┐     ┌────────────────────────┐    │
│  │   Store Frontend       │     │   Console Frontend     │    │
│  │   (React + Vite)       │     │   (React + Vite)       │    │
│  │   Port: 5173           │     │   Port: 5174           │    │
│  │   Role: Buyer          │     │   Role: Developer      │    │
│  └───────────┬────────────┘     └────────────┬───────────┘    │
└──────────────┼──────────────────────────────┼─────────────────┘
               │                              │
               │    HTTP/REST + JWT Token     │
               └──────────────┬───────────────┘
                              │
               ┌──────────────▼──────────────┐
               │      API GATEWAY            │
┌──────────────┴─────────────────────────────┴─────────────────┐
│              BACKEND LAYER (Business Logic)                   │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  Express.js API (TypeScript)                        │     │
│  │  Port: 3001                                         │     │
│  │  ┌────────────┐  ┌─────────────┐  ┌─────────────┐ │     │
│  │  │Auth Service│  │Product Svc  │  │Future Svcs  │ │     │
│  │  │- Validate  │  │- Public GET │  │- Reviews    │ │     │
│  │  │- Profile   │  │- CRUD       │  │- Payments   │ │     │
│  │  │            │  │- Owner Check│  │- Messages   │ │     │
│  │  └────────────┘  └─────────────┘  └─────────────┘ │     │
│  └─────────────────────────────────────────────────────┘     │
└───────────────────────────┬───────────────────────────────────┘
                            │
                            │  Service Role Key
                            │  (Bypasses RLS)
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                DATA LAYER (Persistence & Auth)                 │
│  ┌──────────────────────────────────────────────────┐         │
│  │  Supabase (PostgreSQL + Auth)                    │         │
│  │  ┌────────┐ ┌─────────┐ ┌────────┐ ┌──────────┐ │         │
│  │  │ users  │ │products │ │category│ │ reviews  │ │         │
│  │  └────────┘ └─────────┘ └────────┘ └──────────┘ │         │
│  │  ┌──────────┐ ┌─────────┐ ┌──────────────────┐  │         │
│  │  │transactions│ │messages │ │ Auth Service     │  │         │
│  │  └──────────┘ └─────────┘ └──────────────────┘  │         │
│  └──────────────────────────────────────────────────┘         │
└────────────────────────────────────────────────────────────────┘
```

## 🔐 Security Architecture

### Authentication Flow
```
1. User → Supabase Auth (Client SDK)
2. Supabase → JWT Token
3. Frontend → Store Token
4. Frontend → API (with Bearer Token)
5. API → Validate Token (JWT Secret)
6. API → Extract User ID
7. API → Enforce Permissions
8. API → Query Supabase (Service Key)
9. API → Return Data
```

### Authorization Levels

| Action | Buyer | Developer | Admin | API Enforcement |
|--------|-------|-----------|-------|-----------------|
| Browse Products | ✅ | ✅ | ✅ | Public endpoint |
| View Product | ✅ | ✅ | ✅ | Public endpoint |
| Sign In/Up | ✅ | ✅ | ✅ | Supabase Auth |
| Create Product | ❌ | ✅ | ✅ | Role check + Token |
| Edit Own Product | ❌ | ✅ | ✅ | Owner ID match |
| Edit Other's Product | ❌ | ❌ | ✅ | Admin override |
| Delete Own Product | ❌ | ✅ | ✅ | Owner ID match |
| Delete Other's Product | ❌ | ❌ | ✅ | Admin override |

## 📊 Database Schema Summary

### Core Tables

**users**
- Extends Supabase auth.users
- Columns: id, email, full_name, role, avatar_url
- Role: 'Buyer' | 'Developer' | 'Admin'

**categories**
- Product categorization
- Columns: id, name, slug, description, icon_url
- Pre-populated with 5 sample categories

**products** (Central Table)
- Columns: id, owner_id, category_id, name, slug, description, price, stock, image_url, status
- Status: 'draft' | 'published' | 'archived'
- Indexed: owner_id, category_id, status, slug

**reviews**
- Product reviews
- Columns: id, product_id, user_id, rating, comment
- Constraint: One review per user per product

**transactions**
- Order tracking
- Columns: id, buyer_id, total_amount, status, payment_method
- Status: 'pending' | 'paid' | 'shipped' | 'completed'

**transaction_items**
- Order line items
- Links products to transactions

**messages**
- Buyer-Seller communication
- Columns: id, sender_id, receiver_id, product_id, message

## 🎨 Frontend Architecture

### Component Hierarchy

**Store Frontend:**
```
App
├── AuthProvider
    └── Router
        └── Layout (Header + Footer)
            ├── HomePage
            │   ├── Hero Section
            │   ├── Categories Grid
            │   └── ProductCard[] (Featured)
            ├── StorePage
            │   ├── Category Filter
            │   ├── Search Bar
            │   └── ProductCard[] (Filtered)
            ├── ProductDetailPage
            │   ├── Product Image
            │   ├── Product Info
            │   └── Actions
            └── LoginPage
                └── Auth Form
```

**Console Frontend:**
```
App
├── AuthProvider
    └── Router
        ├── LoginPage
        └── ProtectedRoute
            └── Layout (Sidebar)
                ├── DashboardPage
                │   ├── Stats Cards
                │   └── Products Table
                ├── ProductCreatePage
                │   └── Product Form
                └── ProductEditPage
                    └── Product Form (Pre-filled)
```

## 🔧 API Endpoints Reference

### Public Endpoints (No Auth)
```
GET  /                              # API info
GET  /api/health                    # Health check
GET  /api/products                  # List products
GET  /api/products/:slug            # Get product by slug
GET  /api/products/categories/list  # List categories
GET  /api/auth/status               # Auth service status
```

### Protected Endpoints (JWT Required)
```
POST /api/auth/validate             # Validate token
GET  /api/auth/profile              # Get user profile

GET  /api/products/developer/my-products     # Developer's products
POST /api/products/developer/products        # Create product
PUT  /api/products/developer/products/:id    # Update product (owner only)
DELETE /api/products/developer/products/:id  # Delete product (owner only)
```

## 🚀 Tech Stack Summary

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Frontend** | React | 18.2 | UI framework |
| | TypeScript | 5.3 | Type safety |
| | Vite | 5.0 | Build tool |
| | TailwindCSS | 3.4 | Styling |
| | React Router | 6.21 | Routing |
| **Backend** | Node.js | 18+ | Runtime |
| | Express | 4.18 | Web framework |
| | TypeScript | 5.3 | Type safety |
| | JWT | 9.0 | Authentication |
| **Database** | PostgreSQL | (Supabase) | Relational DB |
| | Supabase | Latest | BaaS platform |
| **Deployment** | Vercel | Latest | Hosting |

## 📦 Package Dependencies

### Shared Frontend Dependencies
```json
{
  "@supabase/supabase-js": "^2.39.3",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.21.3",
  "tailwindcss": "^3.4.1",
  "typescript": "^5.3.3",
  "vite": "^5.0.12"
}
```

### Backend Dependencies
```json
{
  "@supabase/supabase-js": "^2.39.3",
  "express": "^4.18.2",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "typescript": "^5.3.3"
}
```

## 🔍 Key Files Explained

### Environment Files (.env)

**API Backend:**
- `SUPABASE_SERVICE_KEY`: Full database access (keep secret!)
- `SUPABASE_JWT_SECRET`: Token validation
- `ALLOWED_ORIGINS`: CORS configuration

**Frontends:**
- `VITE_BAGDJA_API_URL`: API endpoint
- `VITE_SUPABASE_ANON_KEY`: Public auth key (safe for frontend)

### Configuration Files

**tsconfig.json**: TypeScript compiler settings
**vite.config.ts**: Vite build configuration
**tailwind.config.js**: Tailwind theme customization
**vercel.json**: Vercel deployment settings

## 📝 Naming Conventions

### Files
- Components: PascalCase (ProductCard.tsx)
- Pages: PascalCase + "Page" suffix (HomePage.tsx)
- Utilities: camelCase (api.ts, supabase.ts)
- Config: kebab-case (vite.config.ts)

### Code
- React Components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase

### Database
- Tables: lowercase plural (products, categories)
- Columns: snake_case (owner_id, created_at)
- Enums: lowercase (draft, published)

## 🎯 MVP Scope

### ✅ Included Features
- User authentication (Buyer/Developer roles)
- Product CRUD with owner isolation
- Public product browsing
- Category filtering
- Search functionality
- Responsive design
- JWT-based security

### ❌ Not Included (Future)
- Shopping cart
- Payment processing
- Order management
- Product reviews
- Seller ratings
- Image uploads
- Email notifications
- Admin dashboard
- Analytics
- Rate limiting

## 📚 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| README.md | Project overview | Everyone |
| QUICKSTART.md | Local setup guide | Developers |
| DEPLOYMENT.md | Production deployment | DevOps |
| PROJECT-STRUCTURE.md | Architecture details | Developers |
| bagdja-api-services/README.md | API documentation | Backend devs |
| bagdja-store-frontend/README.md | Store docs | Frontend devs |
| bagdja-console-frontend/README.md | Console docs | Frontend devs |

---

**Last Updated**: October 5, 2025  
**Project Version**: 1.0.0 (MVP)  
**License**: MIT

