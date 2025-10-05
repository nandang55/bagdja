# 📚 BAGDJA API - COMPLETE ENDPOINTS DOCUMENTATION

Daftar lengkap semua API endpoints dengan Swagger documentation.

## 🌐 Access Swagger UI

**Local:**
```
http://localhost:3001/api-docs
```

**Production:**
```
https://bagdja-api-services.vercel.app/api-docs
```

---

## 📋 COMPLETE ENDPOINT LIST

### 🏥 **HEALTH ENDPOINTS**

#### 1. API Information
```
GET /
```
- **Auth**: No
- **Description**: Basic API info and available endpoints
- **Response**: Service info, version, endpoints list

#### 2. Health Check
```
GET /api/health
```
- **Auth**: No
- **Description**: Check API health and uptime
- **Response**: Status, uptime, timestamp

---

### 🔐 **AUTH SERVICE** (`/api/auth`)

#### 3. Validate Token
```
POST /api/auth/validate
```
- **Auth**: ✅ Required (Bearer Token)
- **Description**: Validate JWT token and get user session
- **Request**: JWT in Authorization header
- **Response**: `{ valid: true, user: {...} }`
- **Errors**: 401 (Unauthorized), 404 (User not found)

#### 4. Get Profile
```
GET /api/auth/profile
```
- **Auth**: ✅ Required (Bearer Token)
- **Description**: Get current user's profile
- **Response**: `{ user: {...} }`
- **Errors**: 401 (Unauthorized), 404 (User not found)

#### 5. Auth Status
```
GET /api/auth/status
```
- **Auth**: No
- **Description**: Check auth service status
- **Response**: `{ service: 'auth-service', status: 'operational' }`

---

### 🛍️ **PRODUCTS - PUBLIC** (`/api/products`)

#### 6. List Products
```
GET /api/products
```
- **Auth**: No
- **Description**: List all published products with filtering & pagination
- **Query Params**:
  - `category` (uuid) - Filter by category ID
  - `search` (string) - Search by product name
  - `limit` (integer, default: 20) - Items per page
  - `offset` (integer, default: 0) - Skip items
- **Response**: 
  ```json
  {
    "products": [...],
    "pagination": {
      "total": 50,
      "limit": 20,
      "offset": 0
    }
  }
  ```

#### 7. Get Product by Slug
```
GET /api/products/:slug
```
- **Auth**: No
- **Description**: Get single published product details
- **Params**: `slug` (string) - Product URL slug
- **Response**: `{ product: {...} }`
- **Errors**: 404 (Product not found)

---

### 🔨 **PRODUCTS - DEVELOPER** (Protected)

#### 8. Get My Products
```
GET /api/products/developer/my-products
```
- **Auth**: ✅ Required (Developer or Admin role)
- **Description**: Fetch all products owned by authenticated developer
- **Response**: `{ products: [...] }`
- **Errors**: 401 (Unauthorized), 403 (Forbidden - wrong role)

#### 9. Create Product
```
POST /api/products/developer/products
```
- **Auth**: ✅ Required (Developer or Admin role)
- **Description**: Create new product (owner_id auto-set to current user)
- **Request Body**:
  ```json
  {
    "name": "Wireless Headphones",
    "slug": "wireless-headphones",
    "description": "Premium wireless headphones",
    "price": 99.99,
    "stock": 50,
    "categoryId": "uuid-here",
    "imageUrl": "https://...",
    "images": [],
    "status": "published"
  }
  ```
- **Required**: `name`, `slug`, `price`, `categoryId`
- **Response**: `{ product: {...} }` (201 Created)
- **Errors**: 
  - 400 (Validation error)
  - 401 (Unauthorized)
  - 403 (Forbidden)
  - 409 (Slug already exists)

#### 10. Update Product
```
PUT /api/products/developer/products/:id
```
- **Auth**: ✅ Required (Developer or Admin + Owner)
- **Description**: Update product (only if owned by current user)
- **Params**: `id` (uuid) - Product ID
- **Request Body**: Any product fields to update
- **Response**: `{ product: {...} }`
- **Owner Isolation**: ✅ Verified
- **Errors**:
  - 401 (Unauthorized)
  - 403 (Not owner)
  - 404 (Product not found)

#### 11. Delete Product
```
DELETE /api/products/developer/products/:id
```
- **Auth**: ✅ Required (Developer or Admin + Owner)
- **Description**: Delete product (only if owned by current user)
- **Params**: `id` (uuid) - Product ID
- **Response**: `{ message: 'Product deleted successfully' }`
- **Owner Isolation**: ✅ Verified
- **Errors**:
  - 401 (Unauthorized)
  - 403 (Not owner)
  - 404 (Product not found)

---

### 📦 **CATEGORIES**

#### 12. List Categories
```
GET /api/products/categories/list
```
- **Auth**: No
- **Description**: Get all active categories
- **Response**: `{ categories: [...] }`

---

## 🔑 AUTHENTICATION

### How to Get JWT Token

#### Method 1: Sign In via Console
1. Go to http://localhost:5174
2. Sign in
3. Browser DevTools → Console:
   ```javascript
   localStorage.getItem('supabase.auth.token')
   ```
4. Copy `access_token`

#### Method 2: Via Supabase Auth API
```bash
curl -X POST 'https://vwtvghzabftcikbxtwad.supabase.co/auth/v1/token?grant_type=password' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev@test.com",
    "password": "yourpassword"
  }'
```

### Using Token in Requests

**Authorization Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example cURL:**
```bash
curl http://localhost:3001/api/products/developer/my-products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**In Swagger UI:**
1. Click **"Authorize"** button (top right)
2. Enter: `Bearer YOUR_JWT_TOKEN`
3. Click **"Authorize"**
4. Now you can test protected endpoints

---

## 📊 ENDPOINT SUMMARY

| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/` | GET | No | - | API info |
| `/api/health` | GET | No | - | Health check |
| `/api/auth/status` | GET | No | - | Auth service status |
| `/api/auth/validate` | POST | ✅ | Any | Validate token |
| `/api/auth/profile` | GET | ✅ | Any | Get profile |
| `/api/products` | GET | No | - | List products (public) |
| `/api/products/:slug` | GET | No | - | Get product (public) |
| `/api/products/categories/list` | GET | No | - | List categories |
| `/api/products/developer/my-products` | GET | ✅ | Dev/Admin | Get my products |
| `/api/products/developer/products` | POST | ✅ | Dev/Admin | Create product |
| `/api/products/developer/products/:id` | PUT | ✅ | Dev/Admin+Owner | Update product |
| `/api/products/developer/products/:id` | DELETE | ✅ | Dev/Admin+Owner | Delete product |

**Total: 12 endpoints**

---

## 🎯 RESPONSE FORMATS

### Success Response
```json
{
  "product": {...},
  "user": {...},
  "message": "Success"
}
```

### Error Response
```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (wrong role or not owner)
- **404**: Not Found
- **409**: Conflict (duplicate)
- **500**: Server Error

---

## 🔒 SECURITY FEATURES

### Authentication
- ✅ JWT token validation
- ✅ Token expiry check
- ✅ User ID extraction

### Authorization
- ✅ Role-based access control (RBAC)
- ✅ Developer/Admin role requirement
- ✅ Owner isolation verification

### Owner Isolation
```
Developer A → Can only modify → Products owned by A
Developer B → Can only modify → Products owned by B
Admin → Can modify → All products
```

---

## 🧪 TESTING ENDPOINTS

### Test Public Endpoints (No Auth)

```bash
# List products
curl http://localhost:3001/api/products

# Get product by slug
curl http://localhost:3001/api/products/wireless-headphones

# List categories
curl http://localhost:3001/api/products/categories/list

# Health check
curl http://localhost:3001/api/health
```

### Test Protected Endpoints (With Auth)

```bash
# Set token variable
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get my products
curl http://localhost:3001/api/products/developer/my-products \
  -H "Authorization: Bearer $TOKEN"

# Create product
curl -X POST http://localhost:3001/api/products/developer/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "slug": "test-product",
    "price": 29.99,
    "stock": 100,
    "categoryId": "uuid-here",
    "status": "published"
  }'

# Update product
curl -X PUT http://localhost:3001/api/products/developer/products/PRODUCT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price": 24.99}'

# Delete product
curl -X DELETE http://localhost:3001/api/products/developer/products/PRODUCT_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📖 SWAGGER DOCUMENTATION STRUCTURE

### Tags (Grouping)
- 🏥 **Health** - System health endpoints
- 🔐 **Auth** - Authentication endpoints
- 🛍️ **Products (Public)** - Public product browsing
- 🔨 **Products (Developer)** - Protected CRUD operations
- 📦 **Categories** - Category management

### Security Schemes
- **BearerAuth** (JWT) - For protected endpoints

### Schemas
- **Error** - Error response format
- **User** - User object
- **Category** - Category object
- **Product** - Product object (full details)
- **ProductInput** - Product creation/update schema

---

## 🎨 SWAGGER UI FEATURES

### Interactive Testing
1. **Select endpoint** from list
2. Click **"Try it out"**
3. Fill in parameters/body
4. Click **"Execute"**
5. View **Response**

### Authentication
1. Click **"Authorize"** (🔒 icon, top right)
2. Enter JWT token
3. Click **"Authorize"**
4. Click **"Close"**
5. Protected endpoints now accessible

### Export
- **OpenAPI JSON**: http://localhost:3001/api-docs.json
- **Copy as cURL**: Click endpoint → Execute → Copy cURL

---

## 🚀 NEXT STEPS

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure .env:**
   ```bash
   cp .env.example .env
   nano .env
   ```

3. **Run server:**
   ```bash
   npm run dev
   ```

4. **Open Swagger UI:**
   ```
   http://localhost:3001/api-docs
   ```

5. **Test all endpoints!**

---

## 📝 NOTES

- ✅ All endpoints documented with JSDoc
- ✅ Documentation inline with code (easy to maintain)
- ✅ Auto-generated Swagger UI
- ✅ Request/response examples included
- ✅ Error codes documented
- ✅ Authentication requirements clear
- ✅ Owner isolation explained

---

**Swagger Documentation is now complete and matches all API endpoints!** 🎉

Open http://localhost:3001/api-docs to explore! 🚀

