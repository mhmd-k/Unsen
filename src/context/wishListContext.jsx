import { useContext, createContext, useState, useEffect } from "react";
import { useAlertContext } from "./AlertContext";

const WishlistContext = createContext(undefined);

export default function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const { onOpen } = useAlertContext();

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  function addToWishlist(item) {
    let inwishlist = false;
    wishlist.forEach((e) => {
      if (e.id === item.id) {
        inwishlist = true;
      }
    });
    if (inwishlist) {
      onOpen("danger", "Product is already in your wishlist");
      return;
    }
    setWishlist((wl) => [...wl, item]);
    onOpen("primary", "Product has been added to your wishlist");
  }

  function removeFromWishlist(id) {
    setWishlist((wl) => wl.filter((e) => e.id !== id));
    onOpen("danger", "Product has been deleted from your wishlist");
  }

  function inWishlist(id) {
    let product = wishlist.filter((e) => e.id === id);
    return product.length > 0;
  }

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, inWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext() {
  return useContext(WishlistContext);
}
