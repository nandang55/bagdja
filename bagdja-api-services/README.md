# BAGDJA API Services

Microservices API Gateway for the Bagdja Marketplace. This backend service provides secure REST APIs with JWT authentication and owner isolation logic.

## 🏗️ Architecture

This API follows a **microservices pattern** with modular services:

```
bagdja-api-services/
├── src/
│   ├── config/
│   │   └── supabase.ts          # Supabase client configuration
│   ├── middleware/
│   │   └── auth.ts               # JWT validation middleware
│   ├── services/
│   │   ├── auth-service.ts       # Authentication & user validation
│   │   └── products-service.ts   # Product CRUD & public listings
│   └── server.ts                 # Express app entry point
├── package.json
├── tsconfig.json
└── .env.example
```

## 🔒 Security Model

### 1. Service Role Key
- API uses Supabase **Service Role Key** (bypasses RLS)
- Security enforced at application layer

### 2. JWT Authentication
- All protected routes validate JWT tokens from Supabase Auth
- Token extracted from `Authorization: Bearer {token}` header

### 3. Owner Isolation
- **CREATE**: `owner_id` automatically set to authenticated user
- **UPDATE/DELETE**: Only allowed if `owner_id` matches authenticated user
- Prevents developers from modifying other users' products

### 4. Role-Based Access Control
- **Buyer**: Can browse public products
- **Developer**: Can manage own products
- **Admin**: Full access (future expansion)

## 📡 API Endpoints

### Auth Service (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/status` | No | Check service status |
| POST | `/validate` | Yes | Validate JWT token |
| GET | `/profile` | Yes | Get user profile |

### Products Service (`/api/products`)

#### Public Routes (No Auth Required)

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/` | List published products | `category`, `limit`, `offset`, `search` |
| GET | `/:slug` | Get single product by slug | - |
| GET | `/categories/list` | List active categories | - |

#### Protected Routes (Developer Role Required)

| Method | Endpoint | Description | Body/Params |
|--------|----------|-------------|-------------|
| GET | `/developer/my-products` | Get own products | - |
| POST | `/developer/products` | Create product | `name`, `slug`, `price`, `categoryId`, etc. |
| PUT | `/developer/products/:id` | Update own product | Any product fields |
| DELETE | `/developer/products/:id` | Delete own product | - |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase project with schema deployed

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...  # From Supabase Settings → API
SUPABASE_JWT_SECRET=your-jwt-secret  # From Supabase Settings → API
PORT=3001
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
```

3. **Run development server:**
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

### Build for Production

```bash
npm run build
npm start
```

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:3001/
```

### Get Public Products
```bash
curl http://localhost:3001/api/products
```

### Create Product (Protected)
```bash
curl -X POST http://localhost:3001/api/products/developer/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "slug": "test-product",
    "description": "A test product",
    "price": 99.99,
    "stock": 10,
    "categoryId": "CATEGORY_UUID",
    "status": "published"
  }'
```

## 🔐 Authentication Flow

1. **User signs in** via Supabase Auth (from frontend)
2. **Frontend receives JWT token**
3. **Frontend includes token** in API requests:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. **API validates token** using JWT_SECRET
5. **API extracts user ID** from token
6. **API enforces owner isolation** on protected routes

## 📦 Deployment to Vercel

### Option 1: Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2: GitHub Integration

1. Push code to GitHub
2. Import repository in Vercel dashboard
3. Configure environment variables in Vercel
4. Deploy

### Environment Variables in Vercel

Add these in your Vercel project settings:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_JWT_SECRET=your-jwt-secret
ALLOWED_ORIGINS=https://store.yourdomain.com,https://console.yourdomain.com
```

### Vercel Configuration

Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ]
}
```

## 🛠️ Development

### TypeScript Type Checking
```bash
npm run type-check
```

### Project Structure Best Practices

- **Services**: Each service is a separate Express router
- **Middleware**: Reusable auth logic in middleware
- **Config**: Centralized configuration in `config/`
- **Types**: TypeScript interfaces for type safety

### Adding a New Service

1. Create `src/services/your-service.ts`
2. Export Express router
3. Import in `src/server.ts`
4. Mount with `app.use('/api/your-service', yourService)`

## 🐛 Troubleshooting

### "Missing required environment variable"
- Ensure `.env` file exists and contains all required variables
- Check that variables match `.env.example`

### "Invalid token" errors
- Verify JWT_SECRET matches Supabase project
- Check token is valid and not expired
- Ensure `Authorization` header format: `Bearer {token}`

### CORS errors
- Add frontend origin to `ALLOWED_ORIGINS` in `.env`
- Restart API server after changing CORS settings

### Database errors
- Verify Supabase Service Role Key is correct
- Check that schema is properly deployed
- Ensure foreign keys (category_id, owner_id) are valid UUIDs

## 📚 API Response Format

### Success Response
```json
{
  "products": [...],
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

## 🔗 Related Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [JWT.io](https://jwt.io/)

## 📄 License

MIT License

