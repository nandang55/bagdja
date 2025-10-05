import { ENV } from '../config/env';

export interface Product {
  id: string;
  owner_id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  images: string[];
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
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

export interface ProductFormData {
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  imageUrl?: string;
  images?: string[];
  status?: 'draft' | 'published' | 'archived';
}

/**
 * API Client for Bagdja Developer Console
 * All requests require authentication
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
  // AUTH API
  // ============================================================================

  async validateAuth(): Promise<{ valid: boolean; user?: any }> {
    return this.request('/api/auth/validate', {
      method: 'POST',
    });
  }

  async getProfile(): Promise<{ user: any }> {
    return this.request('/api/auth/profile');
  }

  // ============================================================================
  // PRODUCTS API (Developer/Protected)
  // ============================================================================

  /**
   * Fetch products owned by authenticated developer
   */
  async getMyProducts(): Promise<{ products: Product[] }> {
    return this.request('/api/products/developer/my-products');
  }

  /**
   * Create a new product
   */
  async createProduct(data: ProductFormData): Promise<{ product: Product }> {
    return this.request('/api/products/developer/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update existing product (only if owned by authenticated user)
   */
  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<{ product: Product }> {
    return this.request(`/api/products/developer/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete product (only if owned by authenticated user)
   */
  async deleteProduct(id: string): Promise<{ message: string }> {
    return this.request(`/api/products/developer/products/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Fetch all categories
   */
  async getCategories(): Promise<{ categories: Category[] }> {
    return this.request('/api/products/categories/list');
  }
}

// Export singleton instance
export const api = new BagdjaAPI(ENV.API_URL);

