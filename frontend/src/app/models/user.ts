import { Role } from './role';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  profilePhoto?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  profilePhoto?: File;
}

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  profilePhoto?: string;
}
