// User related types
export type Role = "ADMIN" | "CUSTOMER" | "SELLER";

export type Gender = "MALE" | "FEMALE";

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

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  gender: Gender;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  bankAccount?: SellerBankAccount;
}
