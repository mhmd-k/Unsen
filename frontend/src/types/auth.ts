// Authentication related types
import type { Gender, Role, User } from "./user";

export interface SignupData {
  username: string;
  email: string;
  password: string;
  gender: Gender;
  role?: Role;
  bankName?: string;
  fullName?: string;
  accountNumber?: string;
  routingNumber?: string;
}

export interface SignupResponse {
  message: string;
  userId: number;
  email: string;
  resendEmailOption?: boolean;
  resendTokenExpired?: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface VerifyEmailResponse {
  message: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  updateUser: (user: User | null) => void;
}
