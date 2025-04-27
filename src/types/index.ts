// src/types/index.ts

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface UserProfile {
  user: User;
  api_requests_count: number;
  premium_user: boolean;
}

export interface ContentType {
  id: number;
  name: string;
  description?: string;
}

export interface Content {
  id: number;
  title: string;
  content_type: ContentType;
  topic: string;
  tone: string;
  target_audience: string;
  length: number;
  generated_content: string;
  created_at: string;
  updated_at: string;
}

export interface ContentRequest {
  content_type: number;
  topic: string;
  tone: string;
  target_audience: string;
  length: number;
  title?: string;
  additional_instructions?: string;
}
