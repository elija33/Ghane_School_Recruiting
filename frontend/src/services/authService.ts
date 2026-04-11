import api, { saveTokens, clearTokens } from './api';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const authService = {
  async register(request: RegisterRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', request);
    await saveTokens(data.accessToken, data.refreshToken);
    return data;
  },

  async login(request: LoginRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', request);
    await saveTokens(data.accessToken, data.refreshToken);
    return data;
  },

  async logout(): Promise<void> {
    await clearTokens();
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/refresh-token', { refreshToken });
    await saveTokens(data.accessToken, data.refreshToken);
    return data;
  },
};
