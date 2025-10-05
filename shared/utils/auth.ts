import { createClient } from '@supabase/supabase-js';
import { User, UserRole, AuthState, LoginCredentials, RegisterData } from '../types';

// Supabase client configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Authentication service class
export class BagdjaAuth {
  private static instance: BagdjaAuth;
  private authState: AuthState = {
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  };

  private constructor() {
    this.initializeAuth();
  }

  public static getInstance(): BagdjaAuth {
    if (!BagdjaAuth.instance) {
      BagdjaAuth.instance = new BagdjaAuth();
    }
    return BagdjaAuth.instance;
  }

  private async initializeAuth(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await this.loadUserProfile(session.user.id);
      } else {
        this.authState = {
          ...this.authState,
          loading: false,
          isAuthenticated: false,
        };
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.authState = {
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
        isAuthenticated: false,
      };
    }
  }

  // Get current authentication state
  public getAuthState(): AuthState {
    return { ...this.authState };
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return this.authState.isAuthenticated && !!this.authState.user;
  }

  // Get current user
  public getCurrentUser(): User | null {
    return this.authState.user;
  }

  // Sign in with email and password
  public async signIn(credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> {
    try {
      this.authState.loading = true;
      this.authState.error = null;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        this.authState.loading = false;
        this.authState.error = error.message;
        return { success: false, error: error.message };
      }

      if (data.user) {
        await this.loadUserProfile(data.user.id);
        return { success: true };
      }

      return { success: false, error: 'No user data received' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      this.authState.loading = false;
      this.authState.error = errorMessage;
      return { success: false, error: errorMessage };
    }
  }

  // Sign up new user
  public async signUp(userData: RegisterData): Promise<{ success: boolean; error?: string }> {
    try {
      this.authState.loading = true;
      this.authState.error = null;

      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            phone: userData.phone,
          },
        },
      });

      if (error) {
        this.authState.loading = false;
        this.authState.error = error.message;
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Create user profile
        await this.createUserProfile(data.user.id, {
          email: userData.email,
          full_name: userData.full_name,
          phone: userData.phone,
        });

        this.authState.loading = false;
        return { success: true };
      }

      return { success: false, error: 'No user data received' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      this.authState.loading = false;
      this.authState.error = errorMessage;
      return { success: false, error: errorMessage };
    }
  }

  // Sign out current user
  public async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { success: false, error: error.message };
      }

      this.authState = {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      };

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      return { success: false, error: errorMessage };
    }
  }

  // Reset password
  public async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      return { success: false, error: errorMessage };
    }
  }

  // Update password
  public async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password update failed';
      return { success: false, error: errorMessage };
    }
  }

  // Check user role
  public hasRole(requiredRole: UserRole): boolean {
    if (!this.authState.user) return false;
    
    const roleHierarchy = {
      [UserRole.BUYER]: 1,
      [UserRole.DEVELOPER]: 2,
      [UserRole.ADMIN]: 3,
    };

    const userRole = this.authState.user.role;
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  // Get user permissions
  public getPermissions(): string[] {
    if (!this.authState.user) return [];

    const permissions = {
      [UserRole.BUYER]: [
        'view_products',
        'create_reviews',
        'manage_profile',
      ],
      [UserRole.DEVELOPER]: [
        'view_products',
        'create_reviews',
        'manage_profile',
        'manage_products',
        'view_analytics',
      ],
      [UserRole.ADMIN]: [
        'view_products',
        'create_reviews',
        'manage_profile',
        'manage_products',
        'view_analytics',
        'manage_users',
        'manage_system',
      ],
    };

    return permissions[this.authState.user.role] || [];
  }

  // Load user profile from database
  private async loadUserProfile(userId: string): Promise<void> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        this.authState.loading = false;
        this.authState.error = 'Failed to load user profile';
        return;
      }

      if (profile) {
        this.authState = {
          user: profile,
          loading: false,
          error: null,
          isAuthenticated: true,
        };
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      this.authState.loading = false;
      this.authState.error = 'Failed to load user profile';
    }
  }

  // Create user profile in database
  private async createUserProfile(userId: string, profileData: any): Promise<void> {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: profileData.email,
          full_name: profileData.full_name,
          phone: profileData.phone,
          preferences: {
            theme: 'light',
            language: 'en',
            notifications: {
              email: true,
              push: true,
              marketing: false,
              security_alerts: true,
              product_updates: true,
            },
            privacy: {
              profile_visibility: 'private',
              show_email: false,
              allow_direct_messages: false,
              data_sharing: false,
            },
          },
        });

      if (error) {
        console.error('Error creating user profile:', error);
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  }

  // Listen for auth state changes
  public onAuthStateChange(callback: (state: AuthState) => void): () => void {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await this.loadUserProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        this.authState = {
          user: null,
          loading: false,
          error: null,
          isAuthenticated: false,
        };
      }
      
      callback(this.getAuthState());
    }).data.subscription.unsubscribe;
  }
}

// Export singleton instance
export const auth = BagdjaAuth.getInstance();

// Export utility functions
export const redirectToLogin = (currentUrl?: string): void => {
  const redirectUrl = currentUrl ? 
    `/login?redirect=${encodeURIComponent(currentUrl)}` :
    '/login';
  
  window.location.href = redirectUrl;
};

export const redirectToLogout = (): void => {
  window.location.href = '/logout';
};

export const requireAuth = async (): Promise<boolean> => {
  const isAuth = auth.isAuthenticated();
  if (!isAuth) {
    redirectToLogin(window.location.href);
    return false;
  }
  return true;
};

export const requireRole = async (requiredRole: UserRole): Promise<boolean> => {
  const isAuth = await requireAuth();
  if (!isAuth) return false;

  const hasRole = auth.hasRole(requiredRole);
  if (!hasRole) {
    window.location.href = '/unauthorized';
    return false;
  }
  return true;
};
