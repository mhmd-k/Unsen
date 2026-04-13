import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "./useAxiosPrivate";
import type { GetSellerInvoiceDetailsResponse } from "@/types/invoice";

const useGetInvoiceById = (invoiceId: number) => {
  const axiosPrivate = useAxiosPrivate();
  return useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: async () => {
      const response = await axiosPrivate.get<GetSellerInvoiceDetailsResponse>(
        `/seller/invoices/${invoiceId}`,
      );
      return response.data.invoice;
    },
  });
};

export default useGetInvoiceById;
