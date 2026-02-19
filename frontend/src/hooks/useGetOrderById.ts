import { skipToken, useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "./useAxiosPrivate";
import type { GetOrderResponse } from "@/types";

export const useGetOrderById = (id: number) => {
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ["order-details", id],
    queryFn: id
      ? async () => {
          const res = await axiosPrivate.get<GetOrderResponse>(`/orders/${id}`);
          return res.data.order;
        }
      : skipToken,
  });
};
