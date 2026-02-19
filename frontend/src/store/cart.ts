import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/types";
import { toast } from "sonner";

interface CartState {
  cart: CartItem[];
  total: number;

  addItem: (item: CartItem) => void;
  removeItem: (id: string | number) => void;
  increaseQuantity: (id: string | number) => void;
  decreaseQuantity: (id: string | number) => void;
  setQuantity: (id: string | number, value: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      total: 0,

      addItem: (item) => {
        const { cart } = get();

        const exists = cart.some((e) => e.id === item.id);

        if (exists) {
          toast.warning("Product Already in Cart");
          return;
        }

        const updatedCart = [...cart, { ...item, quantity: 1 }];

        set({
          cart: updatedCart,
          total: calculateTotal(updatedCart),
        });

        toast.success("Product now in cart");
      },

      removeItem: (id) => {
        const updatedCart = get().cart.filter((e) => e.id !== id);

        set({
          cart: updatedCart,
          total: calculateTotal(updatedCart),
        });
      },

      increaseQuantity: (id) => {
        const updatedCart = get().cart.map((e) =>
          e.id === id ? { ...e, quantity: e.quantity + 1 } : e,
        );

        set({
          cart: updatedCart,
          total: calculateTotal(updatedCart),
        });
      },

      decreaseQuantity: (id) => {
        const cart = get().cart;

        const item = cart.find((e) => e.id === id);
        if (!item) return;

        if (item.quantity <= 1) {
          const updatedCart = cart.filter((e) => e.id !== id);

          set({
            cart: updatedCart,
            total: calculateTotal(updatedCart),
          });

          toast.success("Product has been deleted");
          return;
        }

        const updatedCart = cart.map((e) =>
          e.id === id ? { ...e, quantity: e.quantity - 1 } : e,
        );

        set({
          cart: updatedCart,
          total: calculateTotal(updatedCart),
        });
      },

      setQuantity: (id, value) => {
        if (value <= 0) return;

        const updatedCart = get().cart.map((e) =>
          e.id === id ? { ...e, quantity: value } : e,
        );

        set({
          cart: updatedCart,
          total: calculateTotal(updatedCart),
        });
      },

      clearCart: () => {
        set({ cart: [], total: 0 });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

function calculateTotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => {
    const discountedPrice = item.price - (item.discount * item.price) / 100;
    return sum + discountedPrice * item.quantity;
  }, 0);
}
