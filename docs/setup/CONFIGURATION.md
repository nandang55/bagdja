# ⚙️ Bagdja Configuration System

Sistem konfigurasi terpusat untuk mengatur semua aspek project Bagdja dari satu file `config.json`.

## 🎯 Overview

File `config.json` di root project berisi semua konfigurasi yang diperlukan untuk:
- ✅ **Service Configuration** - Port, URL, features
- ✅ **Environment Variables** - Database, API keys
- ✅ **Styling & Theme** - Colors, fonts, TailwindCSS
- ✅ **Security Settings** - Password rules, rate limiting
- ✅ **Feature Flags** - Enable/disable features
- ✅ **Integration Settings** - Analytics, payment, email

## 📁 File Structure

```
bagdja/
├── config.json                   # 🎛️ Central configuration
├── scripts/
│   ├── setup-config.js          # 🔧 Apply configuration
│   ├── setup-env.js             # 📝 Setup environment files
│   └── update-config.js         # ✏️ Interactive config editor
└── docs/setup/CONFIGURATION.md  # 📚 This documentation
```

## 🚀 Quick Start

### 1. Setup Initial Configuration
```bash
# Apply default configuration to all services
npm run setup

# Setup environment files
npm run setup:env

# Edit .env files with your values
# Then install dependencies
npm run install:all
```

### 2. Update Configuration
```bash
# Interactive configuration editor
npm run config

# Show current configuration
npm run config:show
```

## 📋 Configuration Sections

### 🏗️ Project Information
```json
{
  "project": {
    "name": "bagdja",
    "version": "1.0.0",
    "description": "Modern marketplace platform",
    "author": "Bagdja Team",
    "license": "MIT"
  }
}
```

### 🛠️ Services Configuration
```json
{
  "services": {
    "bagdja-store-frontend": {
      "name": "Bagdja Store",
      "port": 5173,
      "url": "http://localhost:5173",
      "production_url": "https://store.bagdja.com",
      "framework": "react",
      "features": ["product_browsing", "search", "categories"]
    }
  }
}
```

### 🗄️ Database Configuration
```json
{
  "database": {
    "supabase": {
      "development": {
        "project_name": "bagdja-dev",
        "url": "https://your-dev-project.supabase.co",
        "anon_key": "your-dev-anon-key",
        "service_role_key": "your-dev-service-role-key",
        "jwt_secret": "your-dev-jwt-secret",
        "region": "ap-southeast-1",
        "database_password": "your-dev-db-password",
        "connection_string": "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
      },
      "production": {
        "project_name": "bagdja-prod",
        "url": "https://your-prod-project.supabase.co",
        "anon_key": "your-prod-anon-key",
        "service_role_key": "your-prod-service-role-key",
        "jwt_secret": "your-prod-jwt-secret",
        "region": "ap-southeast-1",
        "database_password": "your-prod-db-password",
        "connection_string": "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
      },
      "migration": {
        "enabled": true,
        "path": "./supabase/migrations",
        "schema": "public",
        "seed_path": "./supabase/seed.sql"
      }
    }
  }
}
```

### 🎨 Styling & Theme
```json
{
  "shared": {
    "styling": {
      "framework": "tailwindcss",
      "theme": {
        "primary": "#0ea5e9",
        "secondary": "#64748b",
        "success": "#22c55e",
        "warning": "#f59e0b",
        "error": "#ef4444"
      }
    }
  }
}
```

### 🔒 Security Settings
```json
{
  "security": {
    "password": {
      "min_length": 8,
      "require_uppercase": true,
      "require_numbers": true,
      "require_symbols": true
    },
    "rate_limiting": {
      "login": {
        "max_attempts": 5,
        "window_minutes": 15
      }
    }
  }
}
```

### ✨ Feature Flags
```json
{
  "features": {
    "registration": true,
    "social_login": false,
    "two_factor_auth": false,
    "dark_mode": true,
    "analytics": true,
    "notifications": true
  }
}
```

### 🔗 Integrations
```json
{
  "integrations": {
    "analytics": {
      "google_analytics": {
        "enabled": false,
        "tracking_id": "G-XXXXXXXXXX"
      }
    },
    "payment": {
      "stripe": {
        "enabled": false,
        "public_key": "pk_test_..."
      }
    }
  }
}
```

## 🛠️ Available Scripts

### Setup Scripts
```bash
npm run setup              # Apply configuration to all services
npm run setup:env          # Create .env files from templates
npm run setup:database     # Setup database connection
npm run setup:git          # Initialize git repository
npm run setup:vscode       # Setup VS Code configuration
```

### Database Scripts
```bash
npm run db:setup           # Interactive database setup
npm run db:test            # Test database connection
npm run db:show            # Show current database configuration
```

### Environment Scripts
```bash
npm run update:env         # Update .env files with latest config
npm run env:show           # Show current environment configuration
npm run setup:env          # Create .env files from templates
```

### Configuration Scripts
```bash
npm run config             # Interactive configuration editor
npm run config:show        # Show current configuration
```

### Development Scripts
```bash
npm run dev                # Start all services
npm run build              # Build all services
npm run install:all        # Install all dependencies
npm run clean              # Clean all node_modules
```

## 🔧 Configuration Workflow

### 1. Initial Setup
```bash
# Clone project
git clone <repository>
cd bagdja

# Apply configuration
npm run setup

# Setup database connection
npm run setup:database

# Setup environment
npm run setup:env

# Edit .env files with your values (if needed)
# Install dependencies
npm run install:all

# Start development
npm run dev
```

### 2. Update Configuration
```bash
# Edit config.json manually or use interactive editor
npm run config

# Apply changes to all services
npm run setup

# Restart services to see changes
npm run dev
```

### 3. Environment-Specific Configuration
```json
{
  "deployment": {
    "environment": {
      "development": {
        "api_url": "http://localhost:3001",
        "supabase_url": "https://dev-project.supabase.co"
      },
      "production": {
        "api_url": "https://api.bagdja.com",
        "supabase_url": "https://prod-project.supabase.co"
      }
    }
  }
}
```

## 📝 Environment Variables

The configuration system automatically generates `.env.example` files for each service:

### API Services
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
PORT=3001
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:5175
```

### Frontend Services
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_BAGDJA_API_URL=http://localhost:3001
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=Bagdja Store
```

## 🎨 Theme Customization

### Update Colors
```bash
# Use interactive editor
npm run config

# Or edit config.json directly
{
  "shared": {
    "styling": {
      "theme": {
        "primary": "#your-primary-color",
        "secondary": "#your-secondary-color"
      }
    }
  }
}

# Apply changes
npm run setup
```

### Custom Tailwind Configuration
The system automatically generates Tailwind configs based on your theme settings:

```javascript
// Generated tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#0ea5e9',  // Your configured primary color
          // ... other shades
        }
      }
    }
  }
}
```

## 🔒 Security Configuration

### Password Requirements
```json
{
  "security": {
    "password": {
      "min_length": 8,
      "require_uppercase": true,
      "require_lowercase": true,
      "require_numbers": true,
      "require_symbols": true
    }
  }
}
```

### Rate Limiting
```json
{
  "security": {
    "rate_limiting": {
      "login": {
        "max_attempts": 5,
        "window_minutes": 15
      },
      "registration": {
        "max_attempts": 3,
        "window_minutes": 60
      }
    }
  }
}
```

## 🗄️ Database Configuration

### Setup Database Connection
```bash
# Interactive database setup
npm run db:setup

# Test database connection
npm run db:test

# Show current database configuration
npm run db:show
```

### Database Settings
```json
{
  "database": {
    "supabase": {
      "development": {
        "project_name": "bagdja-dev",
        "url": "https://your-dev-project.supabase.co",
        "anon_key": "your-dev-anon-key",
        "service_role_key": "your-dev-service-role-key",
        "jwt_secret": "your-dev-jwt-secret",
        "region": "ap-southeast-1",
        "database_password": "your-dev-db-password"
      },
      "production": {
        "project_name": "bagdja-prod",
        "url": "https://your-prod-project.supabase.co",
        "anon_key": "your-prod-anon-key",
        "service_role_key": "your-prod-service-role-key",
        "jwt_secret": "your-prod-jwt-secret",
        "region": "ap-southeast-1",
        "database_password": "your-prod-db-password"
      },
      "migration": {
        "enabled": true,
        "path": "./supabase/migrations",
        "schema": "public",
        "seed_path": "./supabase/seed.sql"
      }
    }
  }
}
```

### Authentication Providers
```json
{
  "database": {
    "supabase": {
      "auth": {
        "providers": {
          "email": {
            "enabled": true,
            "confirm_email": true,
            "double_confirm_changes": true
          },
          "google": {
            "enabled": false,
            "client_id": "",
            "client_secret": ""
          },
          "github": {
            "enabled": false,
            "client_id": "",
            "client_secret": ""
          }
        }
      }
    }
  }
}
```

### Storage Buckets
```json
{
  "database": {
    "supabase": {
      "storage": {
        "buckets": [
          {
            "name": "avatars",
            "description": "User profile pictures",
            "public": false,
            "file_size_limit": 2097152,
            "allowed_mime_types": ["image/jpeg", "image/png", "image/webp"]
          },
          {
            "name": "product-images",
            "description": "Product images",
            "public": true,
            "file_size_limit": 5242880,
            "allowed_mime_types": ["image/jpeg", "image/png", "image/webp"]
          }
        ]
      }
    }
  }
}
```

## ✨ Feature Management

### Enable/Disable Features
```json
{
  "features": {
    "registration": true,
    "social_login": false,
    "two_factor_auth": false,
    "dark_mode": true,
    "analytics": true,
    "notifications": true,
    "real_time": true,
    "file_upload": true,
    "email_verification": true
  }
}
```

### Integration Features
```json
{
  "integrations": {
    "analytics": {
      "google_analytics": {
        "enabled": true,
        "tracking_id": "G-XXXXXXXXXX"
      },
      "sentry": {
        "enabled": true,
        "dsn": "https://your-sentry-dsn"
      }
    },
    "payment": {
      "stripe": {
        "enabled": true,
        "public_key": "pk_live_...",
        "secret_key": "sk_live_..."
      }
    }
  }
}
```

## 🚀 Deployment Configuration

### Vercel Settings
```json
{
  "deployment": {
    "provider": "vercel",
    "domains": {
      "store": "store.bagdja.com",
      "console": "console.bagdja.com",
      "api": "api.bagdja.com",
      "account": "account.bagdja.com"
    }
  }
}
```

### Environment-Specific URLs
```json
{
  "deployment": {
    "environment": {
      "development": {
        "api_url": "http://localhost:3001",
        "supabase_url": "https://dev-project.supabase.co"
      },
      "production": {
        "api_url": "https://api.bagdja.com",
        "supabase_url": "https://prod-project.supabase.co"
      }
    }
  }
}
```

## 🔄 Configuration Updates

### Automatic Updates
When you run `npm run setup`, the system will:
1. ✅ Update all TypeScript configurations
2. ✅ Update all Tailwind configurations  
3. ✅ Update all Vercel configurations
4. ✅ Update all environment templates
5. ✅ Update shared package configurations

### Manual Updates
You can also manually edit `config.json` and then run:
```bash
npm run setup  # Apply all changes
```

### Backup System
The system automatically creates `.backup` files before overwriting existing configurations.

## 🐛 Troubleshooting

### Configuration Not Applied
```bash
# Check if scripts are executable
chmod +x scripts/*.js

# Run setup manually
node scripts/setup-config.js
```

### Environment Variables Not Working
```bash
# Regenerate environment files
npm run setup:env

# Check .env files exist
ls -la bagdja-*/env.example
ls -la bagdja-*/.env
```

### Theme Changes Not Visible
```bash
# Apply configuration changes
npm run setup

# Restart development servers
npm run dev
```

## 📚 Best Practices

### 1. Version Control
- ✅ Commit `config.json` to version control
- ✅ Never commit `.env` files
- ✅ Use `.env.example` as templates

### 2. Environment Management
- ✅ Use different Supabase projects for dev/prod
- ✅ Keep API keys secure
- ✅ Use environment-specific configurations

### 3. Team Collaboration
- ✅ Document configuration changes
- ✅ Use consistent naming conventions
- ✅ Test configuration changes thoroughly

### 4. Security
- ✅ Rotate API keys regularly
- ✅ Use strong passwords
- ✅ Enable rate limiting
- ✅ Monitor security events

---

**Configuration system makes Bagdja easy to customize and deploy! 🚀**
