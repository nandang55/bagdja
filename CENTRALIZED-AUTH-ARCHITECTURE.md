# 🔐 CENTRALIZED AUTH SERVICE ARCHITECTURE

Panduan membuat authentication service yang bisa digunakan oleh multiple projects.

## 🎯 Use Case

Anda punya multiple projects:
- **my-porto** (Portfolio website)
- **bagdja-store** (Marketplace)
- **bagdja-console** (Developer dashboard)
- **future projects**

**Goal:** Satu auth system untuk semua!

---

## 🏗️ Architecture Options

### **OPTION 1: SSO with OAuth2 (Recommended)** ⭐

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  my-porto    │  │ bagdja-store │  │ future-app   │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       │ OAuth2 Flow     │                 │
       └─────────────────┼─────────────────┘
                         │
            ┌────────────▼────────────┐
            │ Bagdja Auth Service     │
            │ (OAuth2 Provider)       │
            │                         │
            │ Endpoints:              │
            │ • /oauth/authorize      │
            │ • /oauth/token          │
            │ • /oauth/userinfo       │
            │ • /oauth/logout         │
            └────────────┬────────────┘
                         │
            ┌────────────▼────────────┐
            │ Supabase Auth           │
            │ (User Database)         │
            └─────────────────────────┘
```

**Benefits:**
- ✅ Industry standard (OAuth2/OIDC)
- ✅ Single login untuk semua apps
- ✅ Token sharing dengan scope
- ✅ Refresh token support
- ✅ Easy integration (any framework)

---

### **OPTION 2: Shared JWT Service (Simpler)**

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  my-porto    │  │ bagdja-store │  │ future-app   │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       │ POST /login     │                 │
       └─────────────────┼─────────────────┘
                         │
            ┌────────────▼────────────┐
            │ Bagdja Auth Service     │
            │                         │
            │ Endpoints:              │
            │ • POST /auth/login      │
            │ • POST /auth/signup     │
            │ • POST /auth/refresh    │
            │ • POST /auth/logout     │
            │ • POST /auth/validate   │
            └────────────┬────────────┘
                         │
            ┌────────────▼────────────┐
            │ Supabase Auth           │
            └─────────────────────────┘
```

**Benefits:**
- ✅ Simpler to implement
- ✅ Shared JWT secret across apps
- ✅ Single user database
- ✅ Easy token validation

---

## 💡 **RECOMMENDATION: Hybrid Approach**

Combine the best of both:

1. **Bagdja Auth Service** - Centralized auth API
2. **Shared JWT Secret** - Token valid across all apps
3. **Project Scopes** - Token includes project permissions

---

## 🛠️ **Implementation: Bagdja Auth Service**

### **New Repository Structure:**

```
bagdja-auth-service/
├── src/
│   ├── config/
│   │   └── supabase.ts
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── middleware/
│   │   └── validate-token.ts
│   ├── routes/
│   │   └── auth.routes.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   └── oauth.ts
│   └── server.ts
├── package.json
└── .env.example
```

### **Endpoints to Create:**

```typescript
// Authentication
POST   /api/auth/signup          - Register new user
POST   /api/auth/login           - Login user
POST   /api/auth/logout          - Logout user
POST   /api/auth/refresh         - Refresh access token

// Token Management
POST   /api/auth/validate        - Validate token
GET    /api/auth/profile         - Get user profile
PUT    /api/auth/profile         - Update profile

// OAuth2 (Advanced)
GET    /oauth/authorize          - OAuth2 authorization
POST   /oauth/token              - Get access token
GET    /oauth/userinfo           - Get user info
POST   /oauth/revoke             - Revoke token

// Multi-tenant
GET    /api/auth/projects        - List user's accessible projects
POST   /api/auth/switch-project  - Switch context
```

---

## 🔑 **Token Design untuk Multi-Project:**

### **JWT Payload Structure:**

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "Developer",
  "projects": {
    "my-porto": {
      "role": "Admin",
      "permissions": ["read", "write", "delete"]
    },
    "bagdja-marketplace": {
      "role": "Developer",
      "permissions": ["read", "write"]
    }
  },
  "current_project": "bagdja-marketplace",
  "iat": 1728136614,
  "exp": 1728140214
}
```

**Benefits:**
- ✅ Single token untuk multiple projects
- ✅ Per-project permissions
- ✅ Easy to switch context
- ✅ Audit trail

---

## 📊 **Integration Pattern:**

### **How Apps Use Centralized Auth:**

#### **1. my-porto Integration:**

```typescript
// my-porto/src/lib/auth.ts
const AUTH_SERVICE_URL = 'https://auth.bagdja.com';

export async function login(email: string, password: string) {
  const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email, 
      password,
      project: 'my-porto' // Specify which project
    })
  });
  
  const { token, user } = await response.json();
  
  // Store token
  localStorage.setItem('auth_token', token);
  
  return { token, user };
}

export async function validateToken(token: string) {
  const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/validate`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'X-Project-ID': 'my-porto'
    }
  });
  
  return response.json();
}
```

#### **2. bagdja-store Integration:**

```typescript
// Same auth service, different project ID
const response = await fetch(`${AUTH_SERVICE_URL}/api/auth/login`, {
  method: 'POST',
  body: JSON.stringify({ 
    email, 
    password,
    project: 'bagdja-marketplace'
  })
});
```

---

## 🎯 **PRACTICAL APPROACH (Start Small):**

### **Phase 1: Current Setup (Now)** ✅
```
- Frontend → Supabase Auth (direct)
- Works independently
- Quick to implement
```

### **Phase 2: Add Auth Proxy (Next)**
```
- Frontend → Bagdja Auth API → Supabase Auth
- Centralized auth logic
- Still simple
```

### **Phase 3: Full SSO (Future)**
```
- All apps → Bagdja Auth Service (OAuth2)
- Single sign-on
- Enterprise ready
```

---

## 🚀 **Want Me to Add Login/Signup Endpoints?**

Saya bisa tambahkan sekarang! Endpoint yang akan dibuat:

```typescript
POST /api/auth/signup
POST /api/auth/login  
POST /api/auth/logout
POST /api/auth/refresh-token
POST /api/auth/reset-password
POST /api/auth/change-password
```

Ini akan:
- ✅ Proxy request ke Supabase Auth
- ✅ Add custom logic (logging, analytics, etc.)
- ✅ Return token ke frontend
- ✅ Fully documented dengan Swagger
- ✅ Bisa dipakai oleh my-porto atau project lain

**Mau saya buatkan sekarang?** Atau Anda prefer current setup (frontend direct ke Supabase)?

Let me know! 😊
