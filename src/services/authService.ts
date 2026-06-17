import { api } from './api';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/User';

const BASE = '/api/auth';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(`${BASE}/login`, data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<string> {
    const response = await api.post<string>(`${BASE}/register`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },

  async verify(token: string): Promise<string> {
    const response = await api.get<string>(`${BASE}/verify`, {
      params: { token },
    });
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
