// Authentication related types
export interface SignupData {
  username: string;
  email: string;
  password: string;
  role?: "CUSTOMER" | "SELLER";
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
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    isVerified: boolean;
    accessToken: string;
  };
}

export interface VerifyEmailResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    isVerified: boolean;
    accessToken: string;
  };
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
  accessToken: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  updateUser: (user: AuthUser | null) => void;
}
