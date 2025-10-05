# 🚀 Bagdja Development Guide

Panduan lengkap untuk development environment dan workflow.

## 🎯 Quick Start

```bash
# Clone repository
git clone <repository-url>
cd bagdja

# Install all dependencies
npm run install:all

# Setup environment variables
npm run setup:env

# Start all services
npm run dev
```

## 📁 Project Structure

```
bagdja/
├── README.md                     # Main documentation
├── package.json                  # Workspace configuration
├── .prettierrc                   # Code formatting
├── .eslintrc.json               # Code linting
├── .gitignore                   # Git ignore rules
│
├── docs/                         # Documentation
│   ├── setup/                   # Setup guides
│   ├── deployment/              # Deployment guides
│   ├── architecture/            # Architecture docs
│   └── contributing/            # Contribution guides
│
├── shared/                       # Shared packages
│   ├── types/                   # TypeScript types
│   ├── utils/                   # Utilities
│   ├── config/                  # Configuration
│   └── package.json
│
├── bagdja-store-frontend/        # Store frontend (port 5173)
├── bagdja-console-frontend/      # Console frontend (port 5174)
├── bagdja-api-services/          # API backend (port 3001)
└── bagdja-account/               # Account service (port 5175)
```

## 🛠️ Development Commands

### Start Services
```bash
# Start all services with colored output
npm run dev

# Start individual services
npm run dev:store      # http://localhost:5173
npm run dev:console    # http://localhost:5174
npm run dev:api        # http://localhost:3001
npm run dev:account    # http://localhost:5175
```

### Build & Deploy
```bash
# Build all services
npm run build

# Build individual service
npm run build:store
npm run build:console
npm run build:api
npm run build:account
```

### Code Quality
```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint

# Type checking
npm run type-check

# Run tests
npm run test
```

### Maintenance
```bash
# Install dependencies for all services
npm run install:all

# Clean all node_modules and build folders
npm run clean

# Clean individual service
npm run clean:store
npm run clean:console
npm run clean:api
npm run clean:account
```

## 🔧 Environment Setup

### 1. Copy Environment Files
```bash
cp bagdja-api-services/env.example bagdja-api-services/.env
cp bagdja-store-frontend/env.example bagdja-store-frontend/.env
cp bagdja-console-frontend/env.example bagdja-console-frontend/.env
cp bagdja-account/env.example bagdja-account/.env
```

### 2. Configure Supabase
Edit `.env` files with your Supabase credentials:

```env
# API Services
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Frontend Services
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🎨 Code Standards

### TypeScript
- Use strict mode
- Define interfaces for all data structures
- Use shared types from `@bagdja/shared`
- Avoid `any` type

### React
- Use functional components with hooks
- Implement proper error boundaries
- Use TypeScript for all components
- Follow naming conventions

### Styling
- Use TailwindCSS utility classes
- Follow design system in `shared/config`
- Mobile-first responsive design
- Consistent spacing and colors

### File Naming
- Components: `PascalCase.tsx`
- Pages: `PascalCasePage.tsx`
- Utilities: `camelCase.ts`
- Config: `kebab-case.ts`

## 🔄 Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Work on feature
# ... make changes ...

# Format and lint
npm run format
npm run lint

# Test changes
npm run test

# Commit changes
git add .
git commit -m "feat: add amazing feature"
```

### 2. Shared Code Updates
```bash
# Update shared types
cd shared/types
# ... make changes ...
cd ../..

# Build shared package
npm run build:shared

# Update dependent services
npm run build:store
npm run build:console
```

### 3. Integration Testing
```bash
# Start all services
npm run dev

# Test integration between services
# - Store → API
# - Console → API
# - Account → API
# - Cross-service authentication
```

## 🐛 Debugging

### Browser DevTools
- Use React DevTools extension
- Check Network tab for API calls
- Monitor Console for errors
- Use Redux DevTools (if applicable)

### API Debugging
```bash
# Check API health
curl http://localhost:3001/api/health

# Test authentication
curl -X POST http://localhost:3001/api/auth/validate \
  -H "Authorization: Bearer <token>"
```

### Database Debugging
- Use Supabase Dashboard
- Check SQL logs
- Verify RLS policies
- Test queries in SQL Editor

## 📦 Package Management

### Adding Dependencies
```bash
# Add to specific service
cd bagdja-store-frontend
npm install package-name

# Add to shared package
cd shared
npm install package-name

# Add to root (dev dependencies)
npm install -D package-name
```

### Updating Dependencies
```bash
# Update all dependencies
npm update

# Update specific service
cd bagdja-store-frontend
npm update
```

## 🚀 Performance Optimization

### Frontend
- Use React.memo for expensive components
- Implement code splitting
- Optimize images
- Use virtual scrolling for large lists

### Backend
- Implement caching
- Optimize database queries
- Use connection pooling
- Monitor performance metrics

### Build Optimization
- Use tree shaking
- Minimize bundle size
- Enable compression
- Use CDN for static assets

## 🔒 Security Best Practices

### Authentication
- Validate all tokens
- Implement rate limiting
- Use HTTPS in production
- Regular security audits

### Data Protection
- Sanitize user inputs
- Use parameterized queries
- Implement CORS properly
- Encrypt sensitive data

## 📊 Monitoring & Logging

### Development
- Use console.log for debugging
- Implement error boundaries
- Monitor network requests
- Track performance metrics

### Production
- Use Sentry for error tracking
- Implement analytics
- Monitor API performance
- Set up alerts

## 🤝 Team Collaboration

### Git Workflow
- Use feature branches
- Write descriptive commit messages
- Create pull requests
- Review code thoroughly

### Code Reviews
- Check for bugs and security issues
- Ensure code follows standards
- Verify tests are included
- Check documentation updates

## 📚 Resources

### Documentation
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org)
- [TailwindCSS Docs](https://tailwindcss.com)
- [Supabase Docs](https://supabase.com/docs)

### Tools
- [VS Code Extensions](./VSCODE_EXTENSIONS.md)
- [Development Tools](./DEV_TOOLS.md)
- [Debugging Guide](./DEBUGGING.md)

---

**Happy Coding! 🚀**
