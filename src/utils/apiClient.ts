import { API_CONFIG } from '../config/api';
import storageService from './storage';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = API_CONFIG.HEADERS;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await storageService.getToken();
    return {
      ...this.defaultHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      // Build URL without trailing slash issues
      const baseUrl = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

      // Build query string manually to avoid trailing slash issues with URL constructor
      let fullUrl = `${baseUrl}${cleanEndpoint}`;

      if (params) {
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== null) {
            queryParams.append(key, String(params[key]));
          }
        });
        const queryString = queryParams.toString();
        if (queryString) {
          fullUrl += `?${queryString}`;
        }
      }

      const headers = await this.getAuthHeaders();

      console.log('API GET Request:', {
        url: fullUrl,
        headers: { ...headers, Authorization: headers.Authorization ? `${headers.Authorization.substring(0, 50)}...` : 'No token' },
        params,
        fullAuthHeader: headers.Authorization // Temporarily log full token for debugging
      });

      const response = await fetch(fullUrl, {
        method: 'GET',
        headers,
      });

      console.log('API GET Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('API GET Error:', {
        endpoint,
        params,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorObject: error
      });
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: any, params?: Record<string, any>): Promise<T> {
    // Build URL without trailing slash issues
    const baseUrl = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Build query string manually to avoid trailing slash issues
    let fullUrl = `${baseUrl}${cleanEndpoint}`;

    if (params) {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, String(params[key]));
        }
      });
      const queryString = queryParams.toString();
      if (queryString) {
        fullUrl += `?${queryString}`;
      }
    }

    const headers = await this.getAuthHeaders();
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    // Build URL without trailing slash issues
    const baseUrl = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    const headers = await this.getAuthHeaders();
    const response = await fetch(`${baseUrl}${cleanEndpoint}`, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    // Build URL without trailing slash issues
    const baseUrl = this.baseURL.endsWith('/') ? this.baseURL.slice(0, -1) : this.baseURL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    const headers = await this.getAuthHeaders();
    const response = await fetch(`${baseUrl}${cleanEndpoint}`, {
      method: 'DELETE',
      headers,
    });

    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });

      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      } catch {
        throw new Error(`HTTP Error: ${response.status} - ${errorText || response.statusText}`);
      }
    }

    // Handle empty responses (like DELETE)
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {} as T;
    }

    return response.json();
  }
}

export default new ApiClient();
