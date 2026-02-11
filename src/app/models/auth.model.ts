export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  token: string;
  message?: string;
  createdAt?: string; 
}

export interface ErrorResponse {
  error: string;
}