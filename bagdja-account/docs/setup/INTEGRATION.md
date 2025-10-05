# 🔗 Bagdja Account - Integration Guide

Panduan lengkap untuk mengintegrasikan Bagdja Account Service dengan aplikasi lain dalam ecosystem Bagdja.

## 🎯 Overview

Bagdja Account Service dirancang sebagai **central authentication hub** untuk seluruh ecosystem Bagdja. Service ini menyediakan Single Sign-On (SSO) dan user management untuk semua aplikasi.

## 🏗️ Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BAGDJA ECOSYSTEM                          │
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ bagdja-store    │  │ bagdja-console  │  │ bagdja-apps  │ │
│  │ (marketplace)   │  │ (admin panel)   │  │ (mobile/web) │ │
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
                          │ Shared Database
        ┌─────────────────▼───────────────────────────┐
        │              SUPABASE DATABASE              │
        │  • User Profiles                           │
        │  • Authentication Sessions                 │
        │  • Application Permissions                 │
        │  • Audit Logs                             │
        └─────────────────────────────────────────────┘
```

## 🔑 Authentication Integration

### 1. Shared Authentication Flow

Semua aplikasi Bagdja menggunakan authentication yang sama melalui Bagdja Account Service.

```typescript
// Shared authentication configuration
const AUTH_CONFIG = {
  accountServiceUrl: 'https://account.bagdja.com',
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
};
```

### 2. Cross-Domain Authentication

```typescript
// lib/auth.ts - Shared across all Bagdja apps
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  AUTH_CONFIG.supabaseUrl,
  AUTH_CONFIG.supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

export class BagdjaAuth {
  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  }

  // Get current user
  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  // Redirect to login
  static redirectToLogin(currentUrl?: string): void {
    const redirectUrl = currentUrl ? 
      `${AUTH_CONFIG.accountServiceUrl}/login?redirect=${encodeURIComponent(currentUrl)}` :
      `${AUTH_CONFIG.accountServiceUrl}/login`;
    
    window.location.href = redirectUrl;
  }

  // Redirect to logout
  static redirectToLogout(): void {
    window.location.href = `${AUTH_CONFIG.accountServiceUrl}/logout`;
  }

  // Handle authentication callback
  static async handleAuthCallback(): Promise<void> {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    if (data.session) {
      // User is authenticated, redirect to app
      const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
      window.location.href = redirectUrl || '/dashboard';
    }
  }
}
```

## 📱 App-Specific Integration

### Bagdja Store Integration

```typescript
// bagdja-store/src/lib/auth.ts
import { BagdjaAuth } from '@bagdja/shared-auth';

export class StoreAuth extends BagdjaAuth {
  // Store-specific authentication logic
  static async requireAuthentication(): Promise<void> {
    const isAuth = await this.isAuthenticated();
    if (!isAuth) {
      this.redirectToLogin(window.location.href);
    }
  }

  // Get user profile with store preferences
  static async getUserProfile() {
    const user = await this.getCurrentUser();
    if (!user) return null;

    // Fetch user profile with store-specific data
    const { data } = await supabase
      .from('profiles')
      .select(`
        *,
        store_preferences:user_preferences!inner(*)
      `)
      .eq('id', user.id)
      .single();

    return data;
  }
}
```

### Bagdja Console Integration

```typescript
// bagdja-console/src/lib/auth.ts
import { BagdjaAuth } from '@bagdja/shared-auth';

export class ConsoleAuth extends BagdjaAuth {
  // Console-specific role checking
  static async requireDeveloperRole(): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) {
      this.redirectToLogin(window.location.href);
      return;
    }

    // Check user role
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!data || !['developer', 'admin'].includes(data.role)) {
      throw new Error('Access denied: Developer role required');
    }
  }

  // Get console-specific user data
  static async getConsoleProfile() {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data } = await supabase
      .from('profiles')
      .select(`
        *,
        products(count),
        console_preferences:user_preferences!inner(*)
      `)
      .eq('id', user.id)
      .single();

    return data;
  }
}
```

## 🔄 Session Management

### Cross-App Session Sharing

```typescript
// lib/session.ts
export class SessionManager {
  // Check session across all apps
  static async validateSession(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return false;
      }

      // Verify session is still valid
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      return !userError && !!user;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }

  // Refresh session if needed
  static async refreshSession(): Promise<void> {
    const { error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Session refresh failed:', error);
      throw error;
    }
  }

  // Clear session across all apps
  static async clearSession(): Promise<void> {
    await supabase.auth.signOut();
    
    // Clear any app-specific data
    localStorage.removeItem('bagdja_user_preferences');
    localStorage.removeItem('bagdja_app_state');
  }
}
```

## 🛡️ Security Integration

### Role-Based Access Control

```typescript
// lib/rbac.ts
export enum UserRole {
  BUYER = 'buyer',
  DEVELOPER = 'developer',
  ADMIN = 'admin',
}

export class RBAC {
  // Check if user has required role
  static async hasRole(requiredRole: UserRole): Promise<boolean> {
    const user = await BagdjaAuth.getCurrentUser();
    if (!user) return false;

    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const userRole = data?.role as UserRole;
    
    // Role hierarchy: admin > developer > buyer
    const roleHierarchy = {
      [UserRole.BUYER]: 1,
      [UserRole.DEVELOPER]: 2,
      [UserRole.ADMIN]: 3,
    };

    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  // Get user permissions
  static async getPermissions(): Promise<string[]> {
    const user = await BagdjaAuth.getCurrentUser();
    if (!user) return [];

    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = data?.role as UserRole;
    
    const permissions = {
      [UserRole.BUYER]: [
        'view_products',
        'create_reviews',
        'manage_profile'
      ],
      [UserRole.DEVELOPER]: [
        'view_products',
        'create_reviews',
        'manage_profile',
        'manage_products',
        'view_analytics'
      ],
      [UserRole.ADMIN]: [
        'view_products',
        'create_reviews',
        'manage_profile',
        'manage_products',
        'view_analytics',
        'manage_users',
        'manage_system'
      ],
    };

    return permissions[role] || [];
  }
}
```

## 📊 Data Sharing

### User Profile Synchronization

```typescript
// lib/profile-sync.ts
export class ProfileSync {
  // Sync user profile across all apps
  static async syncProfile(profileData: any): Promise<void> {
    const user = await BagdjaAuth.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Update main profile
    const { error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) throw error;

    // Trigger profile sync event for other apps
    await this.broadcastProfileUpdate(profileData);
  }

  // Broadcast profile updates to other apps
  static async broadcastProfileUpdate(profileData: any): Promise<void> {
    // Use Supabase real-time to notify other apps
    await supabase
      .channel('profile-updates')
      .send({
        type: 'broadcast',
        event: 'profile-updated',
        payload: profileData,
      });
  }

  // Listen for profile updates from other apps
  static subscribeToProfileUpdates(callback: (data: any) => void): void {
    supabase
      .channel('profile-updates')
      .on('broadcast', { event: 'profile-updated' }, (payload) => {
        callback(payload.payload);
      })
      .subscribe();
  }
}
```

## 🔧 Configuration Management

### App-Specific Configuration

```typescript
// lib/config.ts
export interface AppConfig {
  name: string;
  version: string;
  features: string[];
  permissions: string[];
  theme: {
    primaryColor: string;
    logo: string;
  };
}

export class ConfigManager {
  // Get app configuration from user preferences
  static async getAppConfig(appName: string): Promise<AppConfig> {
    const user = await BagdjaAuth.getCurrentUser();
    if (!user) return this.getDefaultConfig(appName);

    const { data } = await supabase
      .from('user_preferences')
      .select('config')
      .eq('user_id', user.id)
      .eq('app_name', appName)
      .single();

    return data?.config || this.getDefaultConfig(appName);
  }

  // Update app configuration
  static async updateAppConfig(appName: string, config: Partial<AppConfig>): Promise<void> {
    const user = await BagdjaAuth.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        app_name: appName,
        config,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
  }

  private static getDefaultConfig(appName: string): AppConfig {
    const defaultConfigs = {
      'bagdja-store': {
        name: 'Bagdja Store',
        version: '1.0.0',
        features: ['product_browsing', 'reviews', 'wishlist'],
        permissions: ['view_products'],
        theme: {
          primaryColor: '#0ea5e9',
          logo: '/logos/bagdja-store.svg',
        },
      },
      'bagdja-console': {
        name: 'Bagdja Console',
        version: '1.0.0',
        features: ['product_management', 'analytics', 'settings'],
        permissions: ['manage_products'],
        theme: {
          primaryColor: '#22c55e',
          logo: '/logos/bagdja-console.svg',
        },
      },
    };

    return defaultConfigs[appName] || defaultConfigs['bagdja-store'];
  }
}
```

## 🚀 Implementation Examples

### React Hook untuk Authentication

```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { BagdjaAuth, SessionManager } from '../lib/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const isValid = await SessionManager.validateSession();
        if (isValid) {
          const user = await BagdjaAuth.getCurrentUser();
          if (mounted) setUser(user);
        } else {
          if (mounted) setUser(null);
        }
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          const user = await BagdjaAuth.getCurrentUser();
          setUser(user);
          setError(null);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, error };
}
```

### Protected Route Component

```typescript
// components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RBAC, UserRole } from '../lib/rbac';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [hasRole, setHasRole] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);

  useEffect(() => {
    if (user && requiredRole) {
      setRoleLoading(true);
      RBAC.hasRole(requiredRole)
        .then(setHasRole)
        .finally(() => setRoleLoading(false));
    }
  }, [user, requiredRole]);

  if (loading || roleLoading) {
    return fallback || <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
```

## 📚 Best Practices

### 1. Error Handling

```typescript
// lib/error-handler.ts
export class ErrorHandler {
  static handleAuthError(error: any): string {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Email atau password salah';
      case 'Email not confirmed':
        return 'Silakan konfirmasi email terlebih dahulu';
      case 'Too many requests':
        return 'Terlalu banyak percobaan login. Coba lagi nanti';
      default:
        return 'Terjadi kesalahan. Silakan coba lagi';
    }
  }

  static async handleApiError(error: any): Promise<void> {
    console.error('API Error:', error);
    
    // Send to error tracking service
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
      });
    }
  }
}
```

### 2. Performance Optimization

```typescript
// lib/cache.ts
export class CacheManager {
  private static cache = new Map();

  static set(key: string, value: any, ttl = 300000): void { // 5 minutes default
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl,
    });
  }

  static get(key: string): any {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  static clear(): void {
    this.cache.clear();
  }
}
```

### 3. Testing Integration

```typescript
// __tests__/auth.integration.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { BagdjaAuth } from '../lib/auth';

describe('Bagdja Auth Integration', () => {
  beforeEach(() => {
    // Reset auth state
    localStorage.clear();
  });

  it('should authenticate user across apps', async () => {
    // Mock successful authentication
    const mockUser = { id: '123', email: 'test@example.com' };
    
    // Simulate login
    await BagdjaAuth.signIn('test@example.com', 'password');
    
    // Verify user is authenticated
    const isAuth = await BagdjaAuth.isAuthenticated();
    expect(isAuth).toBe(true);

    // Verify user data
    const user = await BagdjaAuth.getCurrentUser();
    expect(user).toEqual(mockUser);
  });
});
```

## 🔄 Migration Guide

### Migrating Existing Apps

1. **Install shared auth package**
   ```bash
   npm install @bagdja/shared-auth
   ```

2. **Update authentication logic**
   ```typescript
   // Before
   import { createClient } from '@supabase/supabase-js';
   
   // After
   import { BagdjaAuth } from '@bagdja/shared-auth';
   ```

3. **Update environment variables**
   ```env
   VITE_BAGDJA_ACCOUNT_URL=https://account.bagdja.com
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Update routing**
   ```typescript
   // Redirect to account service for auth
   if (!isAuthenticated) {
     BagdjaAuth.redirectToLogin(window.location.href);
   }
   ```

## 📞 Support

### Getting Help

1. **Documentation**: Check this guide and related docs
2. **GitHub Issues**: Report bugs or request features
3. **Discord**: Join our community for real-time help
4. **Email**: Contact support@bagdja.com

### Common Integration Issues

1. **CORS Errors**: Ensure Supabase CORS settings include all app domains
2. **Session Not Shared**: Check if apps use same Supabase project
3. **Permission Denied**: Verify user roles and RLS policies
4. **Profile Not Syncing**: Check real-time subscriptions and database triggers

---

**Happy Integrating! 🚀**
