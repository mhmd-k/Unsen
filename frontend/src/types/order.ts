import type { Invoice } from "./invoice";

export type OrderStatus = "WAITING_FOR_PAYMENT" | "CANCELED" | "DONE";

export type Order = {
  id: number;
  userId: number;
  totalPrice: number;
  status: OrderStatus;
  contact: string;
  address: string;
  apartment: string;
  city: string;
  state?: string | null;
  zipCode: string;
  deliveredAt?: Date | null;
  canceledAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PlaceOrderData = {
  items: { productId: number; quantity: number }[];
  contact: string;
  address: string;
  apartment?: string;
  city: string;
  state?: string;
  zipCode: string;
};

export type PlaceOrderResponse = {
  order: Order;
  invoice: Invoice;
  message: string;
};
