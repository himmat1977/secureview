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

      // Check for token in response headers (common for JWT authentication)
      const authHeader = response.headers.get('authorization') ||
                        response.headers.get('Authorization');
      const tokenHeader = response.headers.get('x-auth-token') ||
                         response.headers.get('x-access-token') ||
                         response.headers.get('token');

      // Extract token from Authorization header (format: "Bearer <token>")
      let headerToken = null;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        headerToken = authHeader.substring(7);
      } else if (authHeader) {
        headerToken = authHeader;
      } else if (tokenHeader) {
        headerToken = tokenHeader;
      }

      console.log('Response headers check:', {
        authorization: response.headers.get('authorization'),
        'x-auth-token': response.headers.get('x-auth-token'),
        'x-access-token': response.headers.get('x-access-token'),
        token: response.headers.get('token'),
        extractedToken: headerToken ? `Token found: ${headerToken.substring(0, 50)}...` : 'No token in headers',
        tokenLength: headerToken?.length || 0
      });

      // Add the header token to the response data if found
      if (headerToken) {
        data.token = headerToken;
        console.log('Token added to response data:', {
          tokenStart: headerToken.substring(0, 50),
          tokenLength: headerToken.length
        });
      }

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
