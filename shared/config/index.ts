// Application configuration
export const APP_CONFIG = {
  name: 'Bagdja',
  version: '1.0.0',
  description: 'Modern marketplace platform',
  
  // Environment
  environment: process.env.NODE_ENV || 'development',
  
  // API Configuration
  api: {
    baseUrl: process.env.VITE_API_URL || 'http://localhost:3001',
    timeout: 10000,
    retries: 3,
  },
  
  // Supabase Configuration
  supabase: {
    url: process.env.VITE_SUPABASE_URL || '',
    anonKey: process.env.VITE_SUPABASE_ANON_KEY || '',
  },
  
  // Feature Flags
  features: {
    registration: true,
    socialLogin: false,
    twoFactorAuth: false,
    darkMode: true,
    analytics: true,
    notifications: true,
  },
  
  // Security Configuration
  security: {
    passwordMinLength: 8,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
  },
  
  // Rate Limiting
  rateLimit: {
    login: {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    },
    registration: {
      maxAttempts: 3,
      windowMs: 60 * 60 * 1000, // 1 hour
    },
    passwordReset: {
      maxAttempts: 3,
      windowMs: 60 * 60 * 1000, // 1 hour
    },
  },
  
  // UI Configuration
  ui: {
    theme: {
      primaryColor: '#0ea5e9',
      secondaryColor: '#64748b',
      successColor: '#22c55e',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
    },
    layout: {
      headerHeight: '64px',
      sidebarWidth: '256px',
      maxContentWidth: '1200px',
    },
  },
  
  // Analytics Configuration
  analytics: {
    googleAnalyticsId: process.env.VITE_GOOGLE_ANALYTICS_ID,
    sentryDsn: process.env.VITE_SENTRY_DSN,
  },
};

// Service URLs
export const SERVICE_URLS = {
  store: process.env.VITE_STORE_URL || 'http://localhost:5173',
  console: process.env.VITE_CONSOLE_URL || 'http://localhost:5174',
  account: process.env.VITE_ACCOUNT_URL || 'http://localhost:5175',
  api: process.env.VITE_API_URL || 'http://localhost:3001',
};

// Production URLs
export const PRODUCTION_URLS = {
  store: 'https://store.bagdja.com',
  console: 'https://console.bagdja.com',
  account: 'https://account.bagdja.com',
  api: 'https://api.bagdja.com',
};

// Get current environment URLs
export const getServiceUrl = (service: keyof typeof SERVICE_URLS): string => {
  const isProduction = APP_CONFIG.environment === 'production';
  return isProduction ? PRODUCTION_URLS[service] : SERVICE_URLS[service];
};

// Validation schemas
export const VALIDATION_SCHEMAS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s-()]{10,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
};

// Error messages
export const ERROR_MESSAGES = {
  // Authentication
  auth: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_NOT_VERIFIED: 'Please verify your email address',
    ACCOUNT_LOCKED: 'Account temporarily locked',
    TOO_MANY_ATTEMPTS: 'Too many login attempts. Please try again later',
    WEAK_PASSWORD: 'Password does not meet requirements',
    EMAIL_ALREADY_EXISTS: 'Email address is already registered',
  },
  
  // Validation
  validation: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid phone number',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters',
    PASSWORD_MISMATCH: 'Passwords do not match',
    INVALID_FORMAT: 'Invalid format',
  },
  
  // Network
  network: {
    CONNECTION_ERROR: 'Connection error. Please check your internet connection',
    TIMEOUT: 'Request timeout. Please try again',
    SERVER_ERROR: 'Server error. Please try again later',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    FORBIDDEN: 'Access denied',
  },
  
  // Generic
  generic: {
    UNKNOWN_ERROR: 'An unexpected error occurred',
    LOADING_ERROR: 'Failed to load data',
    SAVE_ERROR: 'Failed to save data',
    DELETE_ERROR: 'Failed to delete data',
  },
};

// Success messages
export const SUCCESS_MESSAGES = {
  // Authentication
  auth: {
    LOGIN_SUCCESS: 'Welcome back!',
    REGISTRATION_SUCCESS: 'Account created successfully!',
    LOGOUT_SUCCESS: 'Logged out successfully',
    PASSWORD_RESET_SENT: 'Password reset email sent',
    PASSWORD_CHANGED: 'Password changed successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
  },
  
  // Generic
  generic: {
    DATA_SAVED: 'Data saved successfully',
    DATA_DELETED: 'Data deleted successfully',
    OPERATION_SUCCESS: 'Operation completed successfully',
  },
};

// Local storage keys
export const STORAGE_KEYS = {
  auth: {
    TOKEN: 'bagdja_auth_token',
    REFRESH_TOKEN: 'bagdja_refresh_token',
    USER: 'bagdja_user',
  },
  preferences: {
    THEME: 'bagdja_theme',
    LANGUAGE: 'bagdja_language',
    SIDEBAR_COLLAPSED: 'bagdja_sidebar_collapsed',
  },
  cache: {
    PRODUCTS: 'bagdja_products_cache',
    CATEGORIES: 'bagdja_categories_cache',
    USER_PROFILE: 'bagdja_user_profile_cache',
  },
};

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  profile: {
    GET: '/profile',
    UPDATE: '/profile',
    UPLOAD_AVATAR: '/profile/avatar',
    DELETE_AVATAR: '/profile/avatar',
  },
  products: {
    LIST: '/products',
    GET: '/products/:id',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id',
    SEARCH: '/products/search',
  },
  categories: {
    LIST: '/categories',
    GET: '/categories/:id',
  },
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DATETIME: 'MMM dd, yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  TIME: 'HH:mm',
};

// File upload limits
export const FILE_LIMITS = {
  AVATAR: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  PRODUCT_IMAGE: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
};

// Export default configuration
export default APP_CONFIG;
