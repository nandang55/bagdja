import { ENV } from '../config/env';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  images: string[];
  is_featured: boolean;
  created_at: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  owner?: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  is_active: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * API Client for Bagdja Marketplace
 * All data fetching goes through the API backend
 */
class BagdjaAPI {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // ============================================================================
  // PUBLIC PRODUCTS API
  // ============================================================================

  /**
   * Fetch public products
   */
  async getProducts(params?: {
    category?: string;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<{ products: Product[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.search) queryParams.append('search', params.search);

    const query = queryParams.toString();
    return this.request(`/api/products${query ? `?${query}` : ''}`);
  }

  /**
   * Fetch single product by slug
   */
  async getProductBySlug(slug: string): Promise<{ product: Product }> {
    return this.request(`/api/products/${slug}`);
  }

  /**
   * Fetch all categories
   */
  async getCategories(): Promise<{ categories: Category[] }> {
    return this.request('/api/products/categories/list');
  }

  // ============================================================================
  // AUTH API
  // ============================================================================

  /**
   * Validate authentication token
   */
  async validateAuth(): Promise<{ valid: boolean; user?: any }> {
    return this.request('/api/auth/validate', {
      method: 'POST',
    });
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<{ user: any }> {
    return this.request('/api/auth/profile');
  }
}

// Export singleton instance
export const api = new BagdjaAPI(ENV.API_URL);

