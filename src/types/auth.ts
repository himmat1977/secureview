export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  access_token?: string;
  refresh_token?: string;
  user?: User;
  message?: string;
  data?: {
    token?: string;
    access_token?: string;
    user?: User;
  };
  [key: string]: any; // Allow any additional fields from API
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
