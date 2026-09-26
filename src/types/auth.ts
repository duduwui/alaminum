export type UserRole = 'admin' | 'user' | 'super_admin';

export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  password?: string;
  role: UserRole;
  phone: string;
  company?: string;
  city?: string;
  status: 'active' | 'disabled';
  createdAt: string;
  lastLogin?: string;
  requestsCount?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
  company?: string;
  city?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
