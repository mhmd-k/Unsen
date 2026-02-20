import { BsSuitHeart, BsCart2, BsEye, BsFillHeartFill } from "react-icons/bs";
import { formatCurrency } from "../lib/utils";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/types";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Eye, ShoppingBasket } from "lucide-react";
import { Badge } from "./ui/badge";
import { useCartStore } from "@/stores/cart";
import { useWishlistStore } from "@/stores/wishlist";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { toast } from "sonner";
import { ImSpinner8 } from "react-icons/im";

const ProductCard = (props: Product) => {
  const { inWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { user } = useAuth();
  const { addItem } = useCartStore();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [isLoading, setIsLoading] = useState(false);

  const productInWishlist = inWishlist(props.id);

  const add = async (productId: number) => {
    setIsLoading(true);

    const t = toast.loading("Adding to wishlist...");

    try {
      await axiosPrivate.post("/wishlist/add", {
        productId,
      });

      toast.success("Added Successfully to Wishlist!", { id: t });
    } catch (error) {
      console.error(error);

      toast.error("Error Adding product to wishlist!", { id: t });
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (productId: number) => {
    setIsLoading(true);

    const t = toast.loading("Adding to wishlist...");

    try {
      await axiosPrivate.delete(`/wishlist/remove/${productId}`);
      toast.success("Removed from Wishlist!", { id: t });
    } catch (error) {
      console.error(error);

      toast.error("Error Removing product from wishlist!", { id: t });
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = () => navigate(`/shop/${props.id}`);

  const handleWishlistClick = async (item: Product) => {
    if (productInWishlist) {
      removeFromWishlist(item.id);
      await remove(item.id);
    } else {
      addToWishlist(item);
      await add(item.id);
    }
  };

  return (
    <div className="shop-card relative">
      {props.stock === 0 ? (
        <Badge
          className="absolute top-2 right-2 rounded-full text-xs z-10"
          variant="destructive"
        >
          Out of stock
        </Badge>
      ) : (
        <>
          {props.discount > 0 && (
            <Badge
              className="absolute top-2 right-2 rounded-full text-xs border-red-400 text-red-400 z-10"
              variant="outline"
            >
              {props.discount}% off
            </Badge>
          )}
        </>
      )}

      {user?.role === "CUSTOMER" && (
        <Button
          className="btn wishlist"
          title="Add to wishlist"
          style={{
            backgroundColor: productInWishlist ? "#E33131" : "white",
            color: productInWishlist ? "white" : "black",
          }}
          variant="ghost"
          size="icon"
          onClick={() => handleWishlistClick(props)}
        >
          {isLoading ? (
            <ImSpinner8 className="animate-spin" />
          ) : (
            <>
              {inWishlist(props.id) ? (
                <BsFillHeartFill className="size-3" />
              ) : (
                <BsSuitHeart className="size-3" />
              )}
            </>
          )}
        </Button>
      )}
      <div className="image">
        <img src={props.images[props.primaryImageIndex]} alt={props.name} />
        <div className="buttons">
          <Button
            className="rounded-full"
            size="sm"
            variant="ghost"
            onClick={handleView}
          >
            Quick View <Eye />
          </Button>
          {user?.role === "CUSTOMER" && props.stock > 0 && (
            <Button
              className="add-to-cart"
              size="sm"
              variant="ghost"
              onClick={() => addItem({ ...props, quantity: 1 })}
            >
              Add To Cart <ShoppingBasket />
            </Button>
          )}
        </div>
      </div>

      <div className="w-full md:hidden flex border-1">
        <Button
          className="flex-1 rounded-none group hover:bg-gray-50"
          variant="link"
          onClick={handleView}
        >
          <BsEye className="group-hover:scale-150 transition-all duration-300 ease-in-out" />
        </Button>

        {user?.role === "CUSTOMER" && (
          <Button
            className="border-l-1 rounded-none flex-1 group hover:bg-gray-50"
            variant="link"
            onClick={() => addItem({ ...props, quantity: 1 })}
          >
            <BsCart2 className="group-hover:scale-150 transition-all duration-300 ease-in-out" />
          </Button>
        )}
      </div>
      <h3>{props.name}</h3>
      <p className="text-muted-foreground flex gap-2 items-center">
        {props.discount > 0 ? (
          <span className="line-through text-xs">
            {formatCurrency(props.price)}
          </span>
        ) : (
          formatCurrency(props.price)
        )}
        {props.discount > 0 && (
          <span className="text-red-400">
            {formatCurrency(props.price - (props.discount * props.price) / 100)}
          </span>
        )}
      </p>
    </div>
  );
};

export default memo(ProductCard);
