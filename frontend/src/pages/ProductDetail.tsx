import { useCartConext } from "../contexts/CartContext";
import { useWishlistContext } from "../contexts/WishListContext";
import { formatCurrency } from "../lib/utils";
import { BsSuitHeart } from "react-icons/bs";
import { data } from "../data/data";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import ProductCard from "@/components/ProductCard";
import { ShoppingBag } from "lucide-react";

interface Product {
  id: number;
  imageUrl: string;
  title: string;
  type: string;
  price: number;
}

export default function ProductDetail() {
  const item = localStorage.getItem("item");

  const { imageUrl, id, title, type, price } = JSON.parse(
    item || "{}"
  ) as Product;

  const { addItem } = useCartConext();
  const { addToWishlist } = useWishlistContext();

  const handleAddToCart = () => {
    addItem({ id, imageUrl, title, type, price, quantity: 1 });
  };

  const handleAddToWishlist = () => {
    addToWishlist({ id, imageUrl, title, type, price });
  };

  if (!item) {
    return <div>Product not found</div>;
  }

  return (
    <>
      <div className="container px-2 mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <div className="relative overflow-hidden">
              <img src={imageUrl} alt={title} className="h-96 object-contain" />
            </div>
          </div>
          <div className="md:col-span-7 space-y-4">
            <div>
              <h1 className="text-2xl mb-2">{title}</h1>
              <h2 className="text-xl text-gray-500">{formatCurrency(price)}</h2>
            </div>
            <p className="text-muted-foreground">
              Cenean viverra rhoncus pede. Ut id nisl quis enim dignissim
              sagittis. Ut id nisl quis enim dignissim sagittis. Fusce ac felis
              sitpharetra condimentum...
            </p>
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
          </div>
        </div>
      </div>

      <Separator />

      <div className="container px-2 mx-auto py-8">
        <h2 className="text-3xl text-center mb-8">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 products">
          {data
            .filter((product) => product.type === type && product.id !== id)
            .map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
        </div>
      </div>
    </>
  );
}
