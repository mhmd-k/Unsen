import { useQuery } from "@tanstack/react-query";
import { getProductsById } from "@/lib/api";

const useGetProductById = (id: string) => {
  return useQuery({
    queryKey: ["product-by-id", id],
    queryFn: () => getProductsById(id),
  });
};

export default useGetProductById;
