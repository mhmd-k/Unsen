import type { Invoice } from "./invoice";
import type { Product } from "./product";

export type OrderStatus =
  "WAITING_FOR_PAYMENT" |
  "PAID" |
  "CANCELLED" |
  "REFUNDED"

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
  orderId: Order;
  amount: number;
  message: string;
};

export type GetUserOrdersResponse = {
  orders: Array<{ invoice: Invoice; products: Product[] } & Order>;
  message: string;
};

export type GetOrderResponse = {
  message: string;
  order: Order & { products: Product[]; invoice: Invoice };
};
