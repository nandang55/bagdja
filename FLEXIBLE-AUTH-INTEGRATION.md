# 🔐 FLEXIBLE AUTH INTEGRATION GUIDE

Panduan integrasi Bagdja API dengan berbagai level authentication untuk support multiple apps.

## 🎯 3 Level Integration

Bagdja API mendukung **3 level integrasi** sesuai kebutuhan app Anda:

---

## 📊 **LEVEL 1: FULL INTEGRATION (SSO)**

**Use Case:** App baru dalam ecosystem Bagdja (bagdja-store, bagdja-console)

### **Architecture:**
```
App → Login via Bagdja/Supabase Auth
   ↓
Get JWT Token
   ↓
Use JWT for all Bagdja API calls
```

### **Implementation (React):**

```typescript
// Frontend: Login
import { supabase } from './lib/supabase';

async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  
  // Token available in data.session.access_token
  return data.session.access_token;
}

// Use token in API calls
const response = await fetch('https://bagdja-api.vercel.app/api/products', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### **Benefits:**
- ✅ Full SSO experience
- ✅ Shared user database
- ✅ Access semua features
- ✅ Real-time auth state

---

## 📊 **LEVEL 2: LINKED INTEGRATION**

**Use Case:** App sudah punya auth sendiri (my-porto) tapi mau akses Bagdja

### **Architecture:**
```
my-porto (own auth) 
   ↓
User login ke my-porto (existing system)
   ↓
Request Bagdja API Key (one-time setup)
   ↓
Link my-porto user ↔ Bagdja user
   ↓
Use API Key untuk access Bagdja data
```

### **Setup (One-time):**

#### **Step 1: Generate API Key**

User di my-porto request API key:

```typescript
// my-porto backend
const response = await fetch('https://bagdja-api.vercel.app/api/integration/link-account', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@myporto.com',          // Email di my-porto
    bagdjaEmail: 'user@bagdja.com',     // Email Bagdja (bisa sama)
    bagdjaPassword: 'password',          // Password Bagdja
    projectId: 'my-porto',
    projectName: 'My Porto Website'
  })
});

const { apiKey, linkToken } = await response.json();

// Save apiKey di my-porto database for this user
await db.users.update({ bagdjaApiKey: apiKey });
```

#### **Step 2: Use API Key**

```typescript
// my-porto: Access Bagdja products
const response = await fetch('https://bagdja-api.vercel.app/api/products', {
  headers: {
    'X-API-Key': user.bagdjaApiKey,        // API Key yang di-save
    'X-Project-ID': 'my-porto'
  }
});

const { products } = await response.json();
```

### **Benefits:**
- ✅ Keep existing auth system
- ✅ No need to migrate users
- ✅ Linked accounts (optional)
- ✅ Scoped permissions
- ✅ Easy integration

---

## 📊 **LEVEL 3: API KEY ONLY (Server-to-Server)**

**Use Case:** Server-side integration, webhooks, automation

### **Architecture:**
```
External Service (no users)
   ↓
API Key (static)
   ↓
Access Bagdja API (public + scoped endpoints)
```

### **Setup:**

```bash
# Generate via Bagdja Console or API
curl -X POST https://bagdja-api.vercel.app/api/integration/generate-api-key \
  -H "Authorization: Bearer YOUR_BAGDJA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Analytics Service",
    "projectId": "analytics-dashboard",
    "permissions": ["read:products", "read:orders"],
    "expiresInDays": 365
  }'

# Response:
{
  "apiKey": "bgdj_sk_abc123...",
  "message": "Save securely!"
}
```

### **Usage:**

```python
# Python example
import requests

API_KEY = "bgdj_sk_abc123..."

response = requests.get(
    'https://bagdja-api.vercel.app/api/products',
    headers={'X-API-Key': API_KEY}
)

products = response.json()
```

### **Benefits:**
- ✅ No user auth needed
- ✅ Server-to-server
- ✅ Simple & fast
- ✅ Rate limiting per key

---

## 🔑 **Token Format Comparison:**

### **JWT Token (Level 1):**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Contains:
- user_id
- email
- role
- expires in 1 hour
```

### **API Key (Level 2 & 3):**
```
X-API-Key: bgdj_sk_1234567890abcdef...
X-Project-ID: my-porto

Contains (in database):
- project_id
- permissions
- linked_user_id (optional)
- expires_at (optional)
```

---

## 🔧 **Database Schema for API Keys:**

Create migration untuk support API keys:

```sql
-- Migration: add api_keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    project_id TEXT NOT NULL,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    permissions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_api_keys_project_id ON public.api_keys(project_id);
CREATE INDEX idx_api_keys_key_hash ON public.api_keys(key_hash);

-- RLS
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role has full access" ON public.api_keys
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
```

---

## 📖 **Integration Examples:**

### **Example 1: my-porto Integration (Level 2)**

```typescript
// my-porto/lib/bagdja-integration.ts
export class BagdjaIntegration {
  private apiKey: string;
  private baseUrl = 'https://bagdja-api.vercel.app';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getProducts(filters?: any) {
    const response = await fetch(`${this.baseUrl}/api/products`, {
      headers: {
        'X-API-Key': this.apiKey,
        'X-Project-ID': 'my-porto'
      }
    });
    return response.json();
  }

  async createOrder(productId: string, quantity: number) {
    const response = await fetch(`${this.baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        'X-Project-ID': 'my-porto',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, quantity })
    });
    return response.json();
  }
}

// Usage in my-porto
const bagdja = new BagdjaIntegration(user.bagdjaApiKey);
const products = await bagdja.getProducts({ category: 'electronics' });
```

### **Example 2: Analytics Dashboard (Level 3)**

```javascript
// analytics-dashboard/bagdja-connector.js
const BAGDJA_API_KEY = process.env.BAGDJA_API_KEY;

async function getDailySales() {
  const response = await fetch('https://bagdja-api.vercel.app/api/analytics/sales', {
    headers: {
      'X-API-Key': BAGDJA_API_KEY
    }
  });
  return response.json();
}
```

---

## 🎨 **Comparison Table:**

| Feature | Level 1 (Full) | Level 2 (Linked) | Level 3 (API-only) |
|---------|----------------|------------------|-------------------|
| **User Auth** | Bagdja Auth | Own Auth | No Auth |
| **Token Type** | JWT | API Key | API Key |
| **User Linking** | Native | Linked | None |
| **SSO** | Yes | No | No |
| **Complexity** | Low | Medium | Low |
| **Best For** | New apps | Existing apps | Server jobs |
| **Permissions** | Role-based | Scoped | Scoped |
| **Token Expiry** | 1 hour | Custom | Custom |

---

## 🚀 **Recommended Strategy:**

### **For Bagdja Ecosystem (store, console):**
→ Use **Level 1** (Full Integration)

### **For my-porto:**
→ Use **Level 2** (Linked)
- Keep existing auth
- Generate API key for Bagdja access
- Link user accounts (optional)

### **For External Services:**
→ Use **Level 3** (API-only)
- Analytics, webhooks, automation

---

## 📝 **Implementation Roadmap:**

### **Phase 1: Current (JWT Only)** ✅ Done
```
- JWT authentication
- Works for Bagdja apps
```

### **Phase 2: Add API Key Support** ← Recommended Next
```
- Create api_keys table
- Generate API key endpoint
- Validate API key middleware
- Support both JWT & API Key
```

### **Phase 3: Account Linking**
```
- Link external users to Bagdja
- Cross-app permissions
- Unified profile
```

### **Phase 4: Full SSO (Optional)**
```
- OAuth2 provider
- Social logins
- Enterprise features
```

---

## 🎯 **SARAN SAYA:**

**Implementasi Phase 2 sekarang:**
1. ✅ Buat migration untuk `api_keys` table
2. ✅ Tambah endpoint generate API key
3. ✅ Tambah middleware validate API key
4. ✅ Support flexible auth (JWT OR API Key)

**Keuntungan:**
- ✅ my-porto bisa keep auth sendiri
- ✅ Tinggal generate API key
- ✅ Integrasi mudah
- ✅ Flexible untuk future projects

**Mau saya implement Phase 2 sekarang?** Saya bisa buatkan:
1. Migration file untuk api_keys table
2. Endpoints untuk manage API keys
3. Middleware flexible auth
4. Integration guide untuk my-porto

**Atau explain dulu lebih detail approach mana yang cocok untuk use case Anda?** 🤔
