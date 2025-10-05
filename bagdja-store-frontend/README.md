# Bagdja Store Frontend

Public marketplace storefront for buyers. Built with React, TypeScript, Vite, and TailwindCSS.

## 🎯 Features

- **Home Page**: Featured products and category browsing
- **Store/Listing Page**: Filter products by category and search
- **Product Detail Page**: Full product information
- **Authentication**: Buyer sign in/sign up via Supabase Auth
- **Responsive Design**: Mobile-first, modern UI

## 🏗️ Architecture

### Data Flow
```
Store Frontend → API Backend → Supabase
```

**IMPORTANT**: This frontend **NEVER** calls Supabase directly for data. All product data flows through the Bagdja API Services for security and business logic enforcement.

### Routes

| Route | Description | Auth Required |
|-------|-------------|---------------|
| `/` | Home page with featured products | No |
| `/store/:category` | Category-filtered product listing | No |
| `/product/:slug` | Single product detail page | No |
| `/login` | Buyer sign in/sign up | No |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Running Bagdja API Services (see `../bagdja-api-services`)

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

Open http://localhost:5173

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Layout.tsx      # Header/Footer layout
│   └── ProductCard.tsx # Product card component
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── lib/                # Utilities and API clients
│   ├── api.ts          # API client for Bagdja backend
│   └── supabase.ts     # Supabase client (auth only)
├── pages/              # Route pages
│   ├── HomePage.tsx
│   ├── StorePage.tsx
│   ├── ProductDetailPage.tsx
│   └── LoginPage.tsx
├── config/             # Configuration
│   └── env.ts          # Environment variables
├── App.tsx             # App router
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🔒 Authentication

This frontend uses **Supabase Auth** for user authentication:

1. Users sign up/sign in via Supabase
2. Supabase returns a JWT token
3. Token is stored in `AuthContext`
4. Token is sent to API in `Authorization` header for protected routes

**Default Role**: All users who sign up via this frontend get `role='Buyer'`

## 🎨 Design System

### Colors
- **Primary**: Blue (`primary-600`, `primary-700`)
- **Background**: Light gray (`gray-50`)
- **Text**: Dark gray (`gray-900`)

### Components
- `btn-primary`: Primary action button
- `btn-secondary`: Secondary action button
- `card`: Card container
- `input-field`: Form input field

### Responsive Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

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
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused

## 🔗 API Integration

All API calls are handled through `src/lib/api.ts`:

```typescript
import { api } from './lib/api';

// Fetch products
const { products } = await api.getProducts({ limit: 10 });

// Fetch single product
const { product } = await api.getProductBySlug('my-product');

// Fetch categories
const { categories } = await api.getCategories();
```

## 🐛 Troubleshooting

### "Failed to load data" errors
- Ensure API backend is running on correct URL
- Check `VITE_BAGDJA_API_URL` in `.env`
- Check browser console for network errors

### Authentication not working
- Verify Supabase credentials in `.env`
- Check Supabase project is active
- Ensure email confirmation is disabled for development

### Products not showing
- Verify API is returning data
- Check database has sample products
- Look for errors in browser console

## 📚 Related Documentation

- [Bagdja API Services](../bagdja-api-services/README.md)
- [Vite Documentation](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

## 📄 License

MIT License

