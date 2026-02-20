import { create } from "zustand";
import type { Product } from "@/types";

type WishlistState = {
  wishlist: Product[];
  setWishlist: (products: Product[]) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
  inWishlist: (id: number) => boolean;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistState>()((set, get) => ({
  wishlist: [],

  setWishlist: (products) => {
    set({ wishlist: products });
  },

  addToWishlist: (product) => {
    const { wishlist } = get();
    set({ wishlist: [...wishlist, product] });
  },

  removeFromWishlist: (id) => {
    const { wishlist } = get();
    set({ wishlist: wishlist.filter((p) => p.id !== id) });
  },

  inWishlist: (id) => {
    return get().wishlist.some((p) => p.id === id);
  },

  clearWishlist: () => set({ wishlist: [] }),
}));
