export interface User {
  id?: number;
  name: string;
  email: string;
  verified: boolean;
  createdAt?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
}
