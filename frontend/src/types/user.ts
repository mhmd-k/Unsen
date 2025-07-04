// User related types
export type UserRole = "ADMIN" | "CUSTOMER" | "SELLER";

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SellerBankAccount {
  id: number;
  userId: number;
  bankName: string;
  fullName: string;
  accountNumber: string;
  routingNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserWithBankAccount extends User {
  bankAccount?: SellerBankAccount;
}
