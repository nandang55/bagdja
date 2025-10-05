# Bagdja Account Service

Modern account management service untuk ecosystem Bagdja. Built dengan React, TypeScript, Vite, dan TailwindCSS dengan direct connection ke Supabase.

## 🎯 Overview

Bagdja Account Service adalah "pintu utama" untuk semua aplikasi dalam ecosystem Bagdja. Service ini menyediakan:

- **User Registration & Authentication**
- **Password Management** (forgot password, reset)
- **Account Settings & Profile Management**
- **Security Features** (2FA, session management)
- **Single Sign-On (SSO)** untuk semua Bagdja apps

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                BAGDJA-ACCOUNT SERVICE                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           React Frontend (Vite)                     │   │
│  │  • Registration Page                                │   │
│  │  • Login/Logout                                     │   │
│  │  • Forgot Password                                  │   │
│  │  • Account Settings                                 │   │
│  │  • Profile Management                               │   │
│  │  • Security Settings                                │   │
│  └─────────────────┬───────────────────────────────────┘   │
└─────────────────────┼───────────────────────────────────────┘
                      │ Direct Connection
        ┌─────────────▼─────────────────────────────┐
        │         SUPABASE DATABASE                 │
        │  • PostgreSQL Database                   │
        │  • Supabase Auth                         │
        │  • Row Level Security (RLS)              │
        │  • Real-time subscriptions               │
        │  • Email templates                        │
        └───────────────────────────────────────────┘
```

## 📁 Project Structure

```
bagdja-account/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Basic UI components (Button, Input, Card)
│   │   ├── forms/          # Form components
│   │   ├── layout/         # Layout components (Header, Sidebar)
│   │   └── features/       # Feature-specific components
│   ├── pages/              # Route pages
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities, Supabase client
│   ├── stores/             # Zustand stores
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles, Tailwind config
├── public/                 # Static assets
├── docs/                   # Documentation
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm atau yarn
- Supabase project (gunakan yang sama dengan Bagdja utama)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd bagdja-account

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=http://localhost:5175
```

## 🎨 Design System

### Color Palette

```css
:root {
  --primary: #0ea5e9;      /* Blue - untuk CTA buttons */
  --secondary: #64748b;    /* Slate - untuk secondary elements */
  --success: #22c55e;      /* Green - untuk success states */
  --warning: #f59e0b;      /* Amber - untuk warnings */
  --error: #ef4444;        /* Red - untuk errors */
  --background: #f8fafc;   /* Light gray - untuk background */
  --surface: #ffffff;      /* White - untuk cards/surfaces */
}
```

### Typography

- **Font Family**: Inter (system font fallback)
- **Headings**: Font weight 600-700
- **Body Text**: Font weight 400
- **Small Text**: Font weight 500

## 📱 Features

### ✅ Core Features

- [x] **User Registration** - Multi-step form dengan validation
- [x] **Login/Logout** - Secure authentication flow
- [x] **Forgot Password** - Email-based password reset
- [x] **Account Settings** - Profile management
- [x] **Security Settings** - Password change, session management
- [x] **Responsive Design** - Mobile-first approach

### 🔄 Planned Features

- [ ] **Two-Factor Authentication** - TOTP support
- [ ] **Social Login** - Google, GitHub integration
- [ ] **Email Verification** - Account verification flow
- [ ] **Audit Logs** - Security activity tracking
- [ ] **Connected Apps** - OAuth app management
- [ ] **Dark Mode** - Theme switching

## 🔒 Security

### Supabase RLS Policies

```sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

### Frontend Security

- **JWT token management** dengan secure storage
- **Route protection** dengan auth guards
- **Form validation** dengan Zod schemas
- **Rate limiting** untuk sensitive operations

## 🚢 Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

## 🔗 Integration

### Dengan Bagdja Apps

```typescript
// Redirect ke account service untuk login
const loginUrl = `${ACCOUNT_SERVICE_URL}/login?redirect=${encodeURIComponent(currentUrl)}`;

// Check authentication status
const isAuthenticated = await checkAuthStatus();
```

### API Endpoints (Internal)

```typescript
// Authentication status check
GET /api/auth/status

// User profile data
GET /api/user/profile

// Session validation
POST /api/auth/validate-session
```

## 📚 Documentation

- [Setup Guide](./docs/SETUP.md)
- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Integration Guide](./docs/INTEGRATION.md)
- [Security Guide](./docs/SECURITY.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

---

**Built with ❤️ for Bagdja Ecosystem**