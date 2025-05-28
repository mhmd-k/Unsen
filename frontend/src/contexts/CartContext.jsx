import { createContext, useContext, useEffect, useState } from "react";
import { useAlertContext } from "./AlertContext";

const CartContext = createContext(undefined);

// eslint-disable-next-line react/prop-types
export default function CartProvider({ children }) {
  const [cart, setCart] = useState(
    JSON.parse(sessionStorage.getItem("cart")) || []
  );
  const [total, setTotal] = useState(0);

  const { onOpen } = useAlertContext();

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));

    function calculateTotal(arr) {
      let t = 0;
      arr.forEach((e) => {
        t += e.quantity * e.price;
      });
      return t;
    }

    setTotal(() => calculateTotal(cart));
  }, [cart]);

  function addItem(item) {
    let inCart = false;
    cart.forEach((e) => {
      if (e.id === item.id) {
        inCart = true;
      }
    });
    if (inCart) {
      onOpen("danger", "Product Already in Cart");
      return;
    }
    setCart((prevCart) => [...prevCart, { ...item, quantity: 1 }]);
    onOpen("primary", "Product now in cart");
  }

  function removeItem(id) {
    setCart((prevCart) => {
      return prevCart.filter((e) => e.id !== id);
    });
  }

  function increaseQuantity(id) {
    setCart((prevCart) =>
      prevCart.map((e) =>
        e.id === id ? { ...e, quantity: parseInt(e.quantity) + 1 } : e
      )
    );
  }

  function decreaseQuantity(id) {
    let QuantityIsOne = false;
    cart.forEach((e) => {
      if (e.id === id && e.quantity <= 1) {
        QuantityIsOne = true;
      }
    });
    if (QuantityIsOne) {
      removeItem(id);
      onOpen("danger", "Product has been deleted");
      return;
    }
    setCart((prevCart) =>
      prevCart.map((e) =>
        e.id === id ? { ...e, quantity: parseInt(e.quantity) - 1 } : e
      )
    );
  }

  function setQuantity(id, value) {
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

export function useCartConext() {
  return useContext(CartContext);
}
