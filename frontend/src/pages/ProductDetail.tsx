import { useCartConext } from "../contexts/CartContext";
import { useWishlistContext } from "../contexts/WishListContext";
import { cn, formatCurrency } from "../lib/utils";
import { BsSuitHeart } from "react-icons/bs";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { ShoppingBag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getProductsById } from "@/lib/api";
import { useParams } from "react-router-dom";
import LoadingSpinnerInfinity from "@/components/LoadingSpinnerInfinity";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import RelatedProductsSection from "@/components/RelatedProductsSection";

export default function ProductDetail() {
  const [primaryImage, setPrimaryImage] = useState("");

  const params = useParams();
  const id = parseInt(params.id || "");

  const {
    data: product,
    isLoading,
    isSuccess,
  } = useQuery({
    queryFn: () => getProductsById(id),
    queryKey: ["product", id],
  });

  useEffect(() => {
    if (isSuccess && product?.images?.[product.primaryImageIndex]) {
      setPrimaryImage(product.images[product.primaryImageIndex]);
    }
  }, [isSuccess, product]);

  const { user } = useAuth();
  const { addItem } = useCartConext();
  const { addToWishlist } = useWishlistContext();

  const handleAddToCart = () => {
    if (product) addItem({ ...product, quantity: 1 });
  };

  const handleAddToWishlist = () => {
    if (product) addToWishlist(product);
  };

  if (isLoading) return <LoadingSpinnerInfinity />;

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <div className="container px-4 mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <div className="flex gap-4">
              <div className="flex flex-col gap-4">
                {product.images.map((img, i) => (
                  <button
                    className="h-22 w-22 rounded-md"
                    onClick={() => setPrimaryImage(img)}
                  >
                    <img
                      key={img}
                      src={img}
                      alt={`${product.name}-${i}`}
                      className={cn(
                        "object-fit transition-all duration-500",
                        primaryImage !== img && "grayscale hover:filter-none"
                      )}
                    />
                  </button>
                ))}
              </div>
              <img
                src={primaryImage}
                alt={product.name}
                className="w-full max-h-90 object-contain"
              />
            </div>
          </div>
          <div className="md:col-span-7 space-y-4">
            <div>
              <h1 className="text-2xl mb-2">{product.name}</h1>
              <h2 className="text-xl text-gray-500">
                {formatCurrency(product.price)}{" "}
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full ms-10",
                    product.stock > 0
                      ? "text-green-400 border-green-400"
                      : "text-red-400 border-red-400"
                  )}
                >
                  {product.stock > 0 ? "In stock" : "Out of stock"}
                </Badge>
              </h2>
            </div>
            <p className="text-muted-foreground">
              Cenean viverra rhoncus pede. Ut id nisl quis enim dignissim
              sagittis. Ut id nisl quis enim dignissim sagittis. Fusce ac felis
              sitpharetra condimentum...
            </p>
            <p className="text-muted-foreground">
              Items currently in stock:{" "}
              <span className="text-main">{product.stock}</span>
            </p>
            {user?.role === "CUSTOMER" && (
              <div className="space-y-4 grid">
                <Button
                  size="lg"
                  className="w-full h-[50px] md:max-w-[250px] bg-black-btn rounded-none hover:bg-main"
                  onClick={handleAddToCart}
                >
                  ADD TO CART <ShoppingBag />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="group p-0 justify-start w-full max-w-[200px] hover:text-emerald-500 hover:bg-transparent"
                  onClick={handleAddToWishlist}
                >
                  <span className="border-1 border-black p-2 rounded-full group-hover:border-emerald-500">
                    <BsSuitHeart />
                  </span>{" "}
                  Add to Wishlist
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <RelatedProductsSection id={id} />
    </>
  );
}
