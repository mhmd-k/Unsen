import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import useAxiosPrivate from "./useAxiosPrivate";
import type { OrderStatus } from "@/types";

type SellerAnalytics = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalItemsSold: number;
  revenueOverTime: { month: string; revenue: number }[];
  top3Products: {
    productId: number;
    totalRevenue: number;
    totalSold: string;
    "product.id": number;
    "product.name": string;
  }[];
  orderStatusBreakdown: {
    status: OrderStatus;
    count: number;
  }[];
  ordersOverTime: { month: string; totalOrders: number }[];
};

const useGetSellerAnalytics = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ["sellerAnalytics", user?.id],
    queryFn: async () => {
      const response =
        await axiosPrivate.get<SellerAnalytics>(`/seller/analytics`);

      return response.data;
    },
  });
};

export default useGetSellerAnalytics;
