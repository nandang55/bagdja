// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  meta?: ApiMeta;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
  field?: string;
}

export interface ApiMeta {
  timestamp: string;
  request_id: string;
  version: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: ApiMeta & { pagination: PaginationMeta };
}

// Request Types
export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  query?: Record<string, any>;
}

export interface ApiRequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
}

// HTTP Status Types
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

// API Endpoint Types
export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  auth_required: boolean;
  rate_limit?: RateLimitConfig;
  permissions?: string[];
}

export interface RateLimitConfig {
  requests: number;
  window: number; // in seconds
  burst?: number;
}

// Error Types
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super('VALIDATION_ERROR', message, HttpStatus.UNPROCESSABLE_ENTITY, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super('AUTHENTICATION_ERROR', message, HttpStatus.UNAUTHORIZED);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Insufficient permissions') {
    super('AUTHORIZATION_ERROR', message, HttpStatus.FORBIDDEN);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = 'Resource') {
    super('NOT_FOUND', `${resource} not found`, HttpStatus.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super('CONFLICT', message, HttpStatus.CONFLICT);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends ApiError {
  constructor(retryAfter?: number) {
    super(
      'RATE_LIMIT_EXCEEDED',
      'Too many requests',
      HttpStatus.TOO_MANY_REQUESTS,
      { retryAfter }
    );
    this.name = 'RateLimitError';
  }
}

// API Client Types
export interface ApiClient {
  get<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  post<T>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  put<T>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  patch<T>(url: string, data?: any, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: ApiRequestConfig): Promise<ApiResponse<T>>;
}

// Middleware Types
export interface ApiMiddleware {
  name: string;
  handler: (request: ApiRequest, next: () => Promise<ApiResponse>) => Promise<ApiResponse>;
}

// Cache Types
export interface CacheConfig {
  ttl: number; // time to live in seconds
  key?: string;
  tags?: string[];
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Webhook Types
export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  timestamp: string;
  source: string;
}

export interface WebhookConfig {
  url: string;
  secret: string;
  events: string[];
  active: boolean;
}

// API Versioning Types
export interface ApiVersion {
  version: string;
  deprecated?: boolean;
  sunset_date?: string;
  endpoints: Record<string, ApiEndpoint>;
}

// Health Check Types
export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  uptime: number;
  services: ServiceHealth[];
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  response_time?: number;
  last_check: string;
  error?: string;
}

// Metrics Types
export interface ApiMetrics {
  requests: {
    total: number;
    successful: number;
    failed: number;
    average_response_time: number;
  };
  endpoints: Record<string, EndpointMetrics>;
  errors: Record<string, number>;
  users: {
    active: number;
    new: number;
    returning: number;
  };
}

export interface EndpointMetrics {
  requests: number;
  average_response_time: number;
  error_rate: number;
  last_request: string;
}
