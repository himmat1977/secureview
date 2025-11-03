import { API_CONFIG, ENDPOINTS } from '../config/api';
import { LoginCredentials, LoginResponse } from '../types/auth';

class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseURL}${ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async logout(): Promise<void> {
    // Implement logout logic
    // Clear tokens from storage
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${this.baseURL}${ENDPOINTS.REFRESH_TOKEN}`, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }
}

export default new AuthService();
