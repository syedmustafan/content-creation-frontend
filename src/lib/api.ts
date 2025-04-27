import axios from 'axios';
import { ContentRequest, Content, ContentType, UserProfile } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://content-creation-app-c3e91f98caef.herokuapp.com/api';

// Create axios instance with authentication
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// API functions
export const api = {
  // Auth
  login: async (username: string, password: string) => {
    const response = await apiClient.post('/auth/login/', { username, password });
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await apiClient.post('/auth/register/', { username, email, password });
    return response.data;
  },

  // User Profile
  getUserProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get('/profile/me/');
    return response.data;
  },

  // Content Types
  getContentTypes: async (): Promise<ContentType[]> => {
    const response = await apiClient.get('/content-types/');
    return response.data;
  },

  // Content
  generateContent: async (contentRequest: ContentRequest): Promise<Content> => {
    const response = await apiClient.post('/content/generate/', contentRequest);
    return response.data;
  },

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
  }
};
