import type { User } from "./user";

export type Category =
  | "headphones"
  | "phone-cases"
  | "speakers"
  | "game-controllers";

export type Product = {
  id: number;
  sellerId: number;
  name: string;
  description: string;
  images: { url: string; public_id: string }[];
  price: number;
  discount: number;
  category: string;
  brand: string;
  stock: number;
  primaryImageIndex: number;
};

export type CartItem = Product & {
  quantity: number;
};

export type GetProductByIdResponse = {
  product: Product;
  owner: User;
  message: string;
};

export type GetSellerProductsResponse = {
  data: Product[];
};
