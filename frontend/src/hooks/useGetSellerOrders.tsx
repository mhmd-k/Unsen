import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import useAxiosPrivate from "./useAxiosPrivate";
import type { Order } from "@/types";

const useGetSellerOrders = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ["seller-orders", user?.id],
    queryFn: async () => {
      const response = await axiosPrivate.get<{ orders: Order[] }>(
        "/orders/seller/orders",
      );
      return response.data.orders;
    },
  });
};

export default useGetSellerOrders;
