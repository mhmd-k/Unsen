import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import useAxiosPrivate from "./useAxiosPrivate";
import type { Invoice } from "@/types";

const useGetSellerInvoices = () => {
  const { user } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  return useQuery({
    queryKey: ["seller-invoices", user?.id],
    queryFn: async () => {
      const response = await axiosPrivate.get<{ invoices: Invoice[] }>(
        "/seller/invoices",
      );
      return response.data.invoices;
    },
  });
};

export default useGetSellerInvoices;
