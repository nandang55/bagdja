// User Types
export interface User {
  id: string;
  email: string;
  role: UserRole;
  profile: UserProfile;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: Gender;
  country?: string;
  timezone?: string;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  store_preferences?: StorePreferences;
  console_preferences?: ConsolePreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  marketing: boolean;
  security_alerts: boolean;
  product_updates: boolean;
}

export interface PrivacyPreferences {
  profile_visibility: 'public' | 'private';
  show_email: boolean;
  allow_direct_messages: boolean;
  data_sharing: boolean;
}

export interface StorePreferences {
  favorite_categories: string[];
  price_alerts: boolean;
  wishlist_public: boolean;
}

export interface ConsolePreferences {
  dashboard_layout: string;
  default_view: 'grid' | 'list';
  analytics_filters: string[];
}

// Enums
export enum UserRole {
  BUYER = 'buyer',
  DEVELOPER = 'developer',
  ADMIN = 'admin',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  category: Category;
  price: number;
  stock: number;
  image_url?: string;
  status: ProductStatus;
  owner_id: string;
  owner: User;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export enum ProductStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}

// Authentication Types
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
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
}

// Form Types
export interface FormState<T = any> {
  data: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Component Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

// Theme Types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
    };
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Event Types
export interface AppEvent<T = any> {
  type: string;
  payload: T;
  timestamp: string;
  source: string;
}

export interface SecurityEvent extends AppEvent {
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
}

// Configuration Types
export interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  api_url: string;
  supabase_url: string;
  features: Record<string, boolean>;
}

// Export all types
export * from './auth';
export * from './api';
export * from './forms';
