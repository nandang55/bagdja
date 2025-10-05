# 🏪 Bagdja Marketplace - Complete Ecosystem

Modern marketplace platform dengan arsitektur microservices yang scalable dan secure.

## 🎯 Overview

Bagdja adalah ecosystem marketplace lengkap yang terdiri dari:

- **🛒 Bagdja Store** - Public marketplace untuk pembeli
- **🔨 Bagdja Console** - Dashboard untuk developer/seller
- **🔧 Bagdja API Services** - Backend microservices
- **🔐 Bagdja Account** - Central authentication service

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BAGDJA ECOSYSTEM                          │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ bagdja-store    │  │ bagdja-console  │  │ bagdja-account│ │
│  │ (marketplace)   │  │ (admin panel)   │  │ (auth hub)   │ │
│  │ account.bagdja.com │ │ account.bagdja.com │ │ account.bagdja.com │ │
│  └─────────┬───────┘  └─────────┬───────┘  └──────┬───────┘ │
└────────────┼────────────────────┼──────────────────┼────────┘
             │                    │                  │
             └──────────┬─────────┴──────────────────┘
                        │ Shared Authentication
        ┌───────────────▼─────────────────────────────┐
        │          BAGDJA ACCOUNT SERVICE             │
        │  ┌─────────────────┐  ┌─────────────────┐   │
        │  │ Authentication  │  │ User Management │   │
        │  │ • Login/Logout  │  │ • Profile Data  │   │
        │  │ • Registration  │  │ • Preferences   │   │
        │  │ • Password Mgmt │  │ • Settings      │   │
        │  └─────────────────┘  └─────────────────┘   │
        └─────────────────┬───────────────────────────┘
                          │
        ┌─────────────────▼───────────────────────────┐
        │              SUPABASE DATABASE              │
        │  • User Profiles                           │
        │  • Authentication Sessions                 │
        │  • Application Permissions                 │
        │  • Audit Logs                             │
        └─────────────────────────────────────────────┘
```

## 📁 Repository Structure

```
bagdja/
├── README.md                     # This file
├── package.json                  # Workspace configuration
├── .gitignore
├── docs/                         # Shared documentation
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
├── bagdja-store-frontend/        # Public marketplace (port 5173)
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── bagdja-console-frontend/      # Developer dashboard (port 5174)
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── bagdja-api-services/          # Backend API (port 3001)
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── bagdja-account/               # Account service (port 5175)
│   ├── src/
│   ├── docs/
│   ├── package.json
│   └── README.md
│
└── shared/                       # Shared packages
    ├── types/                    # Shared TypeScript types
    ├── utils/                    # Shared utilities
    ├── components/               # Shared UI components
    └── config/                   # Shared configurations
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm atau yarn
- Supabase project

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/bagdja.git
cd bagdja

# Apply configuration to all services
npm run setup

# Setup database connection
npm run setup:database

# Setup environment files
npm run setup:env

# Edit .env files with your Supabase credentials (if needed)
# Then install all dependencies
npm run install:all
```

### Development

```bash
# Start all services
npm run dev

# Or start individual services
npm run dev:store      # http://localhost:5173
npm run dev:console    # http://localhost:5174  
npm run dev:api        # http://localhost:3001
npm run dev:account    # http://localhost:5175
```

## ⚙️ Configuration System

Bagdja menggunakan sistem konfigurasi terpusat melalui file `config.json` di root project:

```bash
# Setup configuration untuk semua services
npm run setup

# Interactive configuration editor
npm run config

# Show current configuration
npm run config:show

# Database management
npm run db:setup          # Setup database connection
npm run db:test           # Test database connection
npm run db:show           # Show database configuration

# Environment management
npm run update:env        # Update .env files with latest config
npm run env:show          # Show current environment configuration

# Setup environment files
npm run setup:env
```

### 🎛️ Central Configuration
- **Service URLs & Ports** - Configure all service endpoints
- **Database Connection** - Supabase credentials and settings
- **Theme & Styling** - Customize colors, fonts, TailwindCSS
- **Security Settings** - Password rules, rate limiting
- **Feature Flags** - Enable/disable features
- **Integration Settings** - Analytics, payment, email

📚 **[Configuration Guide](./docs/setup/CONFIGURATION.md)**

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Routing
- **React Hook Form** - Form management
- **Zustand** - State management
- **TanStack Query** - Server state

### Backend
- **Node.js** + **Express** + **TypeScript**
- **Supabase** - Database & Authentication
- **JWT** - Token-based authentication

### Database
- **PostgreSQL** (via Supabase)
- **Row Level Security (RLS)**
- **Real-time subscriptions**

### Deployment
- **Vercel** - Frontend & API hosting
- **Custom domains** - account.bagdja.com, store.bagdja.com, etc.

## 🔒 Security Features

- ✅ **JWT Authentication** dengan refresh tokens
- ✅ **Row Level Security** untuk data isolation
- ✅ **Input Validation** dengan Zod schemas
- ✅ **XSS & CSRF Protection**
- ✅ **Rate Limiting** untuk API endpoints
- ✅ **Audit Logging** untuk security events

## 📱 Services Overview

### 🛒 Bagdja Store (Public Marketplace)
- **URL**: http://localhost:5173
- **Purpose**: Public marketplace untuk pembeli
- **Features**: Product browsing, search, categories, reviews

### 🔨 Bagdja Console (Developer Dashboard)  
- **URL**: http://localhost:5174
- **Purpose**: Dashboard untuk developer/seller
- **Features**: Product management, analytics, settings

### 🔧 Bagdja API Services (Backend)
- **URL**: http://localhost:3001
- **Purpose**: Backend API untuk semua services
- **Features**: Authentication, product CRUD, business logic

### 🔐 Bagdja Account (Authentication Hub)
- **URL**: http://localhost:5175
- **Purpose**: Central authentication service
- **Features**: Registration, login, password management, profile settings

## 🚢 Deployment

### Production URLs

- **Store**: https://store.bagdja.com
- **Console**: https://console.bagdja.com  
- **Account**: https://account.bagdja.com
- **API**: https://api.bagdja.com

### Deploy Commands

```bash
# Build all services
npm run build

# Deploy individual services
cd bagdja-store-frontend && vercel --prod
cd bagdja-console-frontend && vercel --prod
cd bagdja-api-services && vercel --prod
cd bagdja-account && vercel --prod
```

## 📚 Documentation

### Service-Specific Docs
- [Store Frontend](./bagdja-store-frontend/README.md)
- [Console Frontend](./bagdja-console-frontend/README.md)
- [API Services](./bagdja-api-services/README.md)
- [Account Service](./bagdja-account/README.md)

### Documentation
- [Development Guide](./docs/setup/DEVELOPMENT.md)
- [Configuration System](./docs/setup/CONFIGURATION.md)
- [Setup Guide](./docs/setup/)
- [Architecture Guide](./docs/architecture/)
- [Deployment Guide](./docs/deployment/)
- [Contributing Guide](./docs/contributing/)

### Account Service Docs
- [Setup Guide](./bagdja-account/docs/SETUP.md)
- [API Documentation](./bagdja-account/docs/API.md)
- [Integration Guide](./bagdja-account/docs/INTEGRATION.md)
- [Security Guide](./bagdja-account/docs/SECURITY.md)

## 🔄 Development Workflow

### Adding New Features

1. **Create feature branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Develop in relevant service**
   ```bash
   cd bagdja-account  # or relevant service
   npm run dev
   ```

3. **Test across all services**
   ```bash
   npm run dev  # Start all services
   npm run test # Run all tests
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

### Shared Code Management

```bash
# Add shared dependency
npm install package-name --workspace=shared

# Use in specific service
npm install shared --workspace=bagdja-account
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

## 🆘 Support

- **Documentation**: Check service-specific README files
- **Issues**: [GitHub Issues](https://github.com/your-username/bagdja/issues)
- **Discord**: [Join our community](https://discord.gg/bagdja)
- **Email**: support@bagdja.com

---

**Built with ❤️ for the Bagdja Ecosystem**

**Version**: 1.0.0  
**Last Updated**: October 2024  
**License**: MIT