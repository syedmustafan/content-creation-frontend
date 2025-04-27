// src/lib/api.ts

import axios from 'axios';
import { Content, ContentType, ContentRequest, UserProfile } from '../types';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
});

// Add request interceptor to include token in headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const api = {
  // Auth endpoints
  login: async (username: string, password: string) => {
    const response = await apiClient.post('/auth/login/', { username, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await apiClient.post('/auth/register/', { username, email, password });
    return response.data;
  },

  verifyEmail: async (userId: number, otpCode: string) => {
    const response = await apiClient.post('/auth/verify-email/', {
      user_id: userId,
      otp_code: otpCode
    });
    return response.data;
  },

  resendVerification: async (userId?: number, email?: string) => {
    const data: any = {};
    if (userId) data.user_id = userId;
    if (email) data.email = email;

    const response = await apiClient.post('/auth/resend-verification/', data);
    return response.data;
  },

  // Content types
  getContentTypes: async (): Promise<ContentType[]> => {
    const response = await apiClient.get('/content-types/');
    return response.data;
  },

  // Content generation
  generateContent: async (contentRequest: ContentRequest): Promise<Content> => {
    const response = await apiClient.post('/content/generate/', contentRequest);
    return response.data;
  },

  // User content
  getUserContent: async (): Promise<Content[]> => {
    const response = await apiClient.get('/content/');
    return response.data;
  },

  getContentById: async (id: number): Promise<Content> => {
    const response = await apiClient.get(`/content/${id}/`);
    return response.data;
  },

  deleteContent: async (id: number): Promise<void> => {
    await apiClient.delete(`/content/${id}/`);
  },

  // User profile
  getUserProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get('/profile/me/');
    return response.data;
  },

  // Premium subscription management
  upgradeToPremium: async (): Promise<any> => {
    // In a real implementation, this would likely send payment information
    // or redirect to a payment processor
    const response = await apiClient.post('/profile/upgrade/');
    return response.data;
  },

  cancelSubscription: async (): Promise<any> => {
    const response = await apiClient.post('/profile/cancel-subscription/');
    return response.data;
  },

  // Handle 401 Unauthorized globally
  setupErrorHandling: (onUnauthorized: () => void) => {
    apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          // Clear local token
          localStorage.removeItem('auth_token');
          // Call the callback
          onUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }
};