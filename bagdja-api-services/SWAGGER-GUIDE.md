# 📚 SWAGGER DOCUMENTATION GUIDE

Bagdja API Services sekarang dilengkapi dengan Swagger/OpenAPI documentation!

## 🎯 Access Documentation

### **Local Development:**
```
http://localhost:3001/api-docs
```

### **Production:**
```
https://bagdja-api-services.vercel.app/api-docs
```

### **JSON Spec:**
```
http://localhost:3001/api-docs.json
```

---

## ✨ Features

✅ **Interactive API Explorer**: Test endpoints directly from browser
✅ **Auto-generated Documentation**: Based on JSDoc comments
✅ **JWT Authentication Support**: Built-in auth testing
✅ **Schema Validation**: Request/response models
✅ **Try It Out**: Execute real API calls
✅ **Copy as cURL**: Generate curl commands

---

## 🚀 How to Use

### **1. Open Swagger UI**

Navigate to: http://localhost:3001/api-docs

### **2. Authenticate (For Protected Endpoints)**

1. Click **"Authorize"** button (top right)
2. Enter JWT token from Supabase Auth:
   ```
   Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Click **"Authorize"**
4. Click **"Close"**

### **3. Test Endpoints**

1. Select an endpoint (e.g., GET `/api/products`)
2. Click **"Try it out"**
3. Fill in parameters (if any)
4. Click **"Execute"**
5. View response

---

## 📖 API Sections

### **🏥 Health**
- `GET /` - API information
- `GET /api/health` - Health check

### **🔐 Auth**
- `POST /api/auth/validate` - Validate JWT token
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/status` - Auth service status

### **🛍️ Products (Public)**
- `GET /api/products` - List published products
- `GET /api/products/:slug` - Get product by slug
- `GET /api/products/categories/list` - List categories

### **🔨 Products (Developer)**
- `GET /api/products/developer/my-products` - Get own products
- `POST /api/products/developer/products` - Create product
- `PUT /api/products/developer/products/:id` - Update product
- `DELETE /api/products/developer/products/:id` - Delete product

---

## 🔑 Get JWT Token for Testing

### **Method 1: From Console Frontend**

1. Sign in to Console: http://localhost:5174
2. Open Browser DevTools (F12)
3. Console tab, run:
   ```javascript
   localStorage.getItem('supabase.auth.token')
   ```
4. Copy the `access_token`

### **Method 2: From Supabase Dashboard**

1. Supabase Dashboard → Authentication → Users
2. Click user
3. Copy JWT token

### **Method 3: Via API**

```bash
curl -X POST https://vwtvghzabftcikbxtwad.supabase.co/auth/v1/token \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dev@test.com",
    "password": "password123",
    "gotrue_meta_security": {}
  }'
```

---

## 📝 Adding Documentation to New Endpoints

### **Example: Document a New Endpoint**

```typescript
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticateToken, async (req, res) => {
  // Handler implementation
});
```

---

## 🎨 Customization

### **Update API Info**

Edit `src/config/swagger.ts`:

```typescript
info: {
  title: 'Your API Name',
  version: '2.0.0',
  description: 'Your description'
}
```

### **Add New Schema**

```typescript
components: {
  schemas: {
    Order: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        productId: { type: 'string', format: 'uuid' },
        quantity: { type: 'integer' },
        total: { type: 'number' }
      }
    }
  }
}
```

### **Add New Tag**

```typescript
tags: [
  {
    name: 'Orders',
    description: 'Order management endpoints'
  }
]
```

---

## 🔧 Configuration Files

### **swagger.ts**
Main configuration file with:
- API metadata
- Server URLs
- Security schemes
- Schemas
- Tags

### **server.ts**
Swagger UI setup and endpoint documentation

---

## 📊 Response Examples

### **Success Response**
```json
{
  "product": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Wireless Headphones",
    "price": 99.99,
    "stock": 50,
    "status": "published"
  }
}
```

### **Error Response**
```json
{
  "error": "Validation Error",
  "message": "Required fields: name, price, categoryId"
}
```

---

## 🌐 Export Documentation

### **Export as JSON (OpenAPI 3.0)**
```bash
curl http://localhost:3001/api-docs.json > openapi.json
```

### **Generate Client SDK**

Use OpenAPI Generator:
```bash
# Install
npm install -g @openapitools/openapi-generator-cli

# Generate TypeScript client
openapi-generator-cli generate \
  -i http://localhost:3001/api-docs.json \
  -g typescript-axios \
  -o ./client-sdk
```

---

## 🐛 Troubleshooting

### **Swagger UI not loading**
- Check server is running
- Verify `/api-docs` route is accessible
- Check console for errors

### **Endpoints not showing**
- Verify JSDoc comments syntax
- Check `apis` path in `swagger.ts`
- Restart server after changes

### **Authentication not working**
- Use correct token format: `Bearer {token}`
- Token must be valid and not expired
- Check JWT secret configuration

---

## 📚 Resources

- [Swagger UI Docs](https://swagger.io/tools/swagger-ui/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)
- [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)

---

## ✅ Best Practices

1. **Document all public endpoints**
2. **Include request/response examples**
3. **Use proper HTTP status codes**
4. **Group endpoints with tags**
5. **Define reusable schemas**
6. **Add security requirements**
7. **Keep documentation up-to-date**

---

**Happy Documenting! 📚**

