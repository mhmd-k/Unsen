import type { CartItem } from "@/types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";

interface CartContextType {
  cart: CartItem[];
  total: number;
  increaseQuantity: (id: string | number) => void;
  decreaseQuantity: (id: string | number) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string | number) => void;
  setQuantity: (id: string | number, value: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(
    JSON.parse(sessionStorage.getItem("cart") || "[]")
  );
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));

    function calculateTotal(arr: CartItem[]): number {
      let t = 0;
      arr.forEach((e) => {
        t += e.quantity * e.price;
      });
      return t;
    }

    setTotal(() => calculateTotal(cart));
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
