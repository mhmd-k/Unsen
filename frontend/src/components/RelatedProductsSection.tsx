import { FaBoxOpen } from "react-icons/fa";
import ProductCard from "@/components/ProductCard";
import { getRelatedProducts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import LoadingSpinnerInfinity from "./LoadingSpinnerInfinity";

const RelatedProductsSection = ({ id }: { id: number }) => {
  const {
    data: relatedProducts,
    isLoading: isRelatedProductLoading,
    error,
  } = useQuery({
    queryFn: () => getRelatedProducts(id),
    queryKey: ["related-products", id],
  });

  if (error) {
    return (
      <div className="container px-4 mx-auto py-8">
        <h2 className="text-3xl text-center mb-8">Related Products</h2>
        <p className="text-red-400 flex flex-col gap-2 w-full justify-center items-center">
          <AlertCircle size={50} /> Error fetching related Products -{" "}
          {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="container px-4 mx-auto py-8">
      <h2 className="text-3xl text-center mb-8">Related Products</h2>
      {isRelatedProductLoading ? (
        <LoadingSpinnerInfinity />
      ) : relatedProducts && relatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 products">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 flex flex-col gap-2 w-full justify-center items-center">
          <FaBoxOpen size={50} className="text-gray-300" /> No related Products
          found
        </p>
      )}
    </div>
  );
};

export default RelatedProductsSection;
