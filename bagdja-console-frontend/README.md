# Bagdja Developer Console

Product management dashboard for sellers/developers. Built with React, TypeScript, Vite, and TailwindCSS.

## 🎯 Features

- **Dashboard**: Overview of products with stats
- **Product Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Protected Routes**: Requires Developer or Admin role
- **Owner Isolation**: Can only manage own products
- **Real-time Updates**: Changes reflect immediately
- **Modern UI**: Clean, responsive interface

## 🏗️ Architecture

### Data Flow
```
Console Frontend → API Backend → Supabase
         ↓
   (JWT Token Auth)
         ↓
   (Owner Verification)
```

**Security**: All CRUD operations go through the API backend which enforces:
1. JWT token validation
2. Developer role verification
3. Owner isolation (can only modify own products)

### Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/login` | Developer sign in/sign up | No |
| `/dashboard` | Product overview and management | Yes (Developer) |
| `/products/create` | Create new product | Yes (Developer) |
| `/products/edit/:id` | Edit existing product | Yes (Developer + Owner) |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Running Bagdja API Services (see `../bagdja-api-services`)
- Supabase project configured

### Installation

```bash
npm install
```

### Configuration

1. Copy environment template:
```bash
cp .env.example .env
```

2. Edit `.env`:
```env
VITE_BAGDJA_API_URL=http://localhost:3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Development

```bash
npm run dev
```

Open http://localhost:5174

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Layout.tsx      # Sidebar navigation layout
│   └── ProtectedRoute.tsx # Route guard for auth & role check
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── lib/                # Utilities and API clients
│   ├── api.ts          # API client for Bagdja backend
│   └── supabase.ts     # Supabase client (auth only)
├── pages/              # Route pages
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProductCreatePage.tsx
│   └── ProductEditPage.tsx
├── config/             # Configuration
│   └── env.ts          # Environment variables
├── App.tsx             # App router with protected routes
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🔒 Authentication & Authorization

### Sign Up Process
1. User creates account with email/password
2. Account is assigned `role='Developer'` automatically
3. Email verification (if enabled in Supabase)
4. User can access console

### Protected Routes
All routes except `/login` are protected:
- Requires valid JWT token
- Requires `role='Developer'` or `role='Admin'`
- Redirects to login if unauthorized

### Owner Isolation
When editing/deleting products:
1. Frontend sends request with JWT token
2. API validates token and extracts user ID
3. API verifies `product.owner_id === user.id`
4. Operation only proceeds if owner matches

## 🎨 Design System

### Colors
- **Primary**: Green (`primary-600`, `primary-700`)
- **Success**: Green (`green-600`)
- **Warning**: Yellow (`yellow-600`)
- **Danger**: Red (`red-600`)

### Components
- `btn-primary`: Primary action button (green)
- `btn-secondary`: Secondary action button
- `btn-danger`: Delete/destructive action button
- `card`: Card container
- `input-field`: Form input field
- `label`: Form label

## 📊 Product Management

### Create Product
1. Navigate to "New Product" in sidebar
2. Fill in required fields:
   - Product Name (auto-generates slug)
   - Category
   - Price & Stock
   - Status (draft/published)
3. Optional: Add description and image URL
4. Click "Create Product"

### Edit Product
1. Click "Edit" on any product in dashboard
2. Modify fields as needed
3. Click "Save Changes"

### Delete Product
1. Click "Delete" on any product in dashboard
2. Confirm deletion
3. Product is permanently removed

### Product Status
- **Draft**: Not visible to buyers (testing)
- **Published**: Visible in public store
- **Archived**: Hidden but not deleted

## 📦 Deployment to Vercel

### Via Vercel Dashboard

1. Push code to GitHub
2. Import repository to Vercel
3. Configure environment variables:
   ```
   VITE_BAGDJA_API_URL=https://your-api.vercel.app
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Deploy

### Via Vercel CLI

```bash
npm i -g vercel
vercel
```

## 🛠️ Development

### Type Checking
```bash
npm run type-check
```

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Clean separation of concerns
- Comprehensive error handling

## 🔗 API Integration

All API calls handled through `src/lib/api.ts`:

```typescript
import { api } from './lib/api';

// Fetch my products
const { products } = await api.getMyProducts();

// Create product
const { product } = await api.createProduct({
  name: 'Product Name',
  slug: 'product-name',
  price: 99.99,
  stock: 10,
  categoryId: 'category-uuid',
  status: 'published'
});

// Update product
await api.updateProduct('product-id', { price: 89.99 });

// Delete product
await api.deleteProduct('product-id');
```

## 🐛 Troubleshooting

### "Access Denied" message
- Verify your account has `role='Developer'` or `role='Admin'`
- Check the `users` table in Supabase
- Sign up through the console to automatically get Developer role

### "Product not found" when editing
- Ensure you own the product (check `owner_id`)
- API enforces owner isolation for security
- You can only edit your own products

### Failed to load products
- Verify API backend is running
- Check `VITE_BAGDJA_API_URL` in `.env`
- Ensure you're authenticated with valid token

### Images not displaying
- Verify image URL is publicly accessible
- Check URL format is correct
- Images must be hosted externally (not uploaded)

## 📚 Related Documentation

- [Bagdja API Services](../bagdja-api-services/README.md)
- [Bagdja Store Frontend](../bagdja-store-frontend/README.md)
- [Vite Documentation](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [TailwindCSS](https://tailwindcss.com/)

## 📄 License

MIT License

