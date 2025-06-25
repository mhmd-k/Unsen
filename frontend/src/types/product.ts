export type Product = {
  id: number;
  sellerId: number;
  name: string;
  description: string;
  images: string[];
  price: number;
  category: string;
  brand: string;
  stock: number;
  type: string;
  imageUrl: string;
  primaryImageIndex: number;
};

export type CartItem = Product & {
  quantity: number;
};

export type createProductRequestPayload = {
  sellerId: number;
  name: string;
  description: string;
  images: string[];
  price: number;
  category: string;
  brand: string;
  stock: number;
  primaryImageIndex: number;
};
