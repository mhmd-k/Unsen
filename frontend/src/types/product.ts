export type Product = {
  id: number;
  sellerId: number;
  name: string;
  description: string;
  images: string[];
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
