import { User, UserRole } from './index';

// Authentication Types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  accept_terms: boolean;
}

export interface ResetPasswordData {
  email: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

// Session Types
export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

export interface JWTPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
  iss: string;
}

// Permission Types
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface RolePermission {
  role: UserRole;
  permissions: Permission[];
}

// Security Types
export interface SecurityEvent {
  id: string;
  user_id?: string;
  event_type: SecurityEventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export enum SecurityEventType {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  LOGOUT = 'logout',
  PASSWORD_CHANGE = 'password_change',
  PROFILE_UPDATE = 'profile_update',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
}

// Two-Factor Authentication Types
export interface TwoFactorAuth {
  enabled: boolean;
  secret?: string;
  backup_codes?: string[];
  last_used?: string;
}

export interface TwoFactorSetup {
  secret: string;
  qr_code: string;
  backup_codes: string[];
}

// OAuth Types
export interface OAuthProvider {
  id: string;
  name: string;
  icon: string;
  enabled: boolean;
}

export interface OAuthConfig {
  providers: OAuthProvider[];
  redirect_url: string;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Rate Limiting Types
export interface RateLimit {
  key: string;
  limit: number;
  window: number; // in milliseconds
  current: number;
  reset_time: number;
}

export interface RateLimitConfig {
  login: {
    max_attempts: number;
    window_ms: number;
  };
  registration: {
    max_attempts: number;
    window_ms: number;
  };
  password_reset: {
    max_attempts: number;
    window_ms: number;
  };
}

// Account Verification Types
export interface EmailVerification {
  email: string;
  token: string;
  expires_at: string;
  verified: boolean;
}

export interface PhoneVerification {
  phone: string;
  code: string;
  expires_at: string;
  verified: boolean;
}
