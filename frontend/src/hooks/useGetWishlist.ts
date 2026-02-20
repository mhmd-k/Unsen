import { useEffect } from "react";
import { useAuth } from "./useAuth";
import useAxiosPrivate from "./useAxiosPrivate";
import { useWishlistStore } from "@/stores/wishlist";
import type { Product } from "@/types";
import { toast } from "sonner";

const useGetWishlist = () => {
  const { user } = useAuth();
  const { setWishlist } = useWishlistStore();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getWishlist = async () => {
      if (!user || user.role !== "CUSTOMER") return;

      try {
        const data = await axiosPrivate.get<{ data: Product[] }>("/wishlist");

        setWishlist(data.data.data);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching wishlist items!");
      }
    };

    getWishlist();
  }, [axiosPrivate, setWishlist, user]);

  return null;
};

export default useGetWishlist;
