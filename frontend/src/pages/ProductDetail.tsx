import { useCartConext } from "../contexts/CartContext";
import { useWishlistContext } from "../contexts/WishListContext";
import { cn, formatCurrency } from "../lib/utils";
import { BsSuitHeart } from "react-icons/bs";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import { ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getProductsById } from "@/lib/api";
import { Link, useParams } from "react-router-dom";
import LoadingSpinnerInfinity from "@/components/LoadingSpinnerInfinity";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import RelatedProductsSection from "@/components/RelatedProductsSection";

export default function ProductDetail() {
  const [primaryImage, setPrimaryImage] = useState("");

  const params = useParams();
  const id = parseInt(params.id || "");

  const { data, isLoading, isSuccess } = useQuery({
    queryFn: () => getProductsById(id),
    queryKey: ["product", id],
  });

  useEffect(() => {
    if (isSuccess && data.product?.images?.[data.product.primaryImageIndex]) {
      setPrimaryImage(data.product.images[data.product.primaryImageIndex]);
    }
  }, [isSuccess, data]);

  const { user } = useAuth();
  const { addItem } = useCartConext();
  const { addToWishlist } = useWishlistContext();

  if (isLoading) return <LoadingSpinnerInfinity />;

  if (!data) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    if (data.product) addItem({ ...data.product, quantity: 1 });
  };

  const handleAddToWishlist = () => {
    if (data.product) addToWishlist(data.product);
  };

  return (
    <>
      <div className="container px-4 mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex md:flex-col gap-4 justify-center">
                {data.product.images.length > 1 &&
                  data.product.images.map((img, i) => (
                    <button
                      className="h-22 w-22 rounded-md cursor-pointer"
                      onClick={() => setPrimaryImage(img)}
                    >
                      <img
                        key={img}
                        src={img}
                        alt={`${data.product.name}-${i}`}
                        className={cn(
                          "object-fit transition-all duration-500",
                          primaryImage !== img && "grayscale hover:filter-none",
                        )}
                      />
                    </button>
                  ))}
              </div>
              <div>
                <img
                  src={primaryImage}
                  alt={data.product.name}
                  className="w-full max-h-90 object-contain"
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-7 space-y-4">
            <div>
              <h1 className="text-2xl mb-2">{data.product.name}</h1>
              <h2 className="text-xl text-gray-500">
                {formatCurrency(data.product.price)}{" "}
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-full ms-10",
                    data.product.stock > 0
                      ? "text-green-400 border-green-400"
                      : "text-red-400 border-red-400",
                  )}
                >
                  {data.product.stock > 0 ? "In stock" : "Out of stock"}
                </Badge>
              </h2>
            </div>
            <p className="text-muted-foreground">{data.product.description}</p>

            <p className="text-muted-foreground">
              Items currently in stock:{" "}
              <span className="text-main">{data.product.stock}</span>
            </p>
            {user?.role === "CUSTOMER" && (
              <div className="space-y-4 grid">
                {data.product.stock > 0 && (
                  <Button
                    size="lg"
                    className="w-full h-[50px] md:max-w-[250px] bg-black-btn rounded-none hover:bg-main"
                    onClick={handleAddToCart}
                  >
                    ADD TO CART <ShoppingBag className="size-5" />
                  </Button>
                )}
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

            <Link
              className="ms-auto w-fit block !text-main text-xs text-end !underline italic font-semibold"
              to={`/users/${data.owner.id}`}
            >
              Owner: {data.owner.username}
            </Link>
          </div>
        </div>
      </div>

      <Separator />

      <RelatedProductsSection id={id} />
    </>
  );
}
