import type { Product } from "@/types";
import {
  useContext,
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { FiAlertTriangle } from "react-icons/fi";

type WishlistContextType = {
  wishlist: Product[];
  addToWishlist: (item: Product) => void;
  removeFromWishlist: (id: number) => void;
  inWishlist: (id: number) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const storedWishlist = localStorage.getItem("wishlist");
    return storedWishlist ? JSON.parse(storedWishlist) : null;
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  function addToWishlist(item: Product) {
    let inwishlist = false;
    wishlist.forEach((e) => {
      if (e.id === item.id) {
        inwishlist = true;
      }
    });
    if (inwishlist) {
      toast("Product is already in your wishlist", {
        icon: <FiAlertTriangle />,
      });
      return;
    }
    setWishlist((wl) => [...wl, item]);
    toast.success("Product has been added to your wishlist");
  }

  function removeFromWishlist(id: number) {
    setWishlist((wl) => wl.filter((e) => e.id !== id));
    toast.success("Product has been deleted from your wishlist");
  }

  function inWishlist(id: number) {
    const product = wishlist.filter((e) => e.id === id);
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
  const wishlistContext = useContext(WishlistContext);

  if (wishlistContext === undefined) {
    throw new Error(
      "useWishlistContext must be used inside a context provider"
    );
  }

  return wishlistContext;
}
