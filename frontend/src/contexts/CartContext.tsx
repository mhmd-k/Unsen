import type { CartItem } from "@/types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { FiAlertTriangle } from "react-icons/fi";

interface CartContextType {
  cart: CartItem[];
  total: number;
  increaseQuantity: (id: string | number) => void;
  decreaseQuantity: (id: string | number) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string | number) => void;
  setQuantity: (id: string | number, value: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(
    JSON.parse(sessionStorage.getItem("cart") || "[]")
  );

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addItem(item: CartItem): void {
    let inCart = false;
    cart.forEach((e) => {
      if (e.id === item.id) {
        inCart = true;
      }
    });
    if (inCart) {
      toast("Product Already in Cart", {
        icon: <FiAlertTriangle />,
      });
      return;
    }
    setCart((prevCart) => [...prevCart, { ...item, quantity: 1 }]);
    toast.success("Product now in cart");
  }

  function removeItem(id: string | number): void {
    setCart((prevCart) => {
      return prevCart.filter((e) => e.id !== id);
    });
  }

  function increaseQuantity(id: string | number): void {
    setCart((prevCart) =>
      prevCart.map((e) =>
        e.id === id ? { ...e, quantity: parseInt(String(e.quantity)) + 1 } : e
      )
    );
  }

  function decreaseQuantity(id: string | number): void {
    let QuantityIsOne = false;
    cart.forEach((e) => {
      if (e.id === id && e.quantity <= 1) {
        QuantityIsOne = true;
      }
    });
    if (QuantityIsOne) {
      removeItem(id);
      toast.success("Product has been deleted");
      return;
    }
    setCart((prevCart) =>
      prevCart.map((e) =>
        e.id === id ? { ...e, quantity: parseInt(String(e.quantity)) - 1 } : e
      )
    );
  }

  function setQuantity(id: string | number, value: number): void {
    setCart((prevCart) =>
      prevCart.map((e) => (e.id === id ? { ...e, quantity: value } : e))
    );
  }

  function clearCart() {
    setCart([]);
  }

  const total = cart.reduce((sum, item) => {
    const discountedPrice = item.price - (item.discount * item.price) / 100;
    return sum + discountedPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        increaseQuantity,
        decreaseQuantity,
        addItem,
        removeItem,
        setQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartConext(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
}
