import { BsSuitHeart, BsCart2, BsEye, BsFillHeartFill } from "react-icons/bs";
import { formatCurrency } from "../lib/utils";
import { useCartConext } from "../contexts/CartContext";
import { useWishlistContext } from "../contexts/WishListContext";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/types";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, ShoppingBasket } from "lucide-react";

const ProductCard = (props: Product) => {
  const { inWishlist, addToWishlist, removeFromWishlist } =
    useWishlistContext();

  const { user } = useAuth();

  const [heartClicked, setHeartClicked] = useState(inWishlist(props.id));
  const { addItem } = useCartConext();

  const exists = inWishlist(props.id);

  const navigate = useNavigate();

  const handleView = () => navigate(`/shop/${props.id}`);

  function handleClick(item: Product) {
    if (heartClicked) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
    setHeartClicked(!heartClicked);
  }

  return (
    <div className="shop-card relative">
      {user?.role === "CUSTOMER" && (
        <Button
          className="btn wishlist"
          title="Add to wishlist"
          style={{
            backgroundColor: exists ? "#E33131" : "white",
            color: exists ? "white" : "black",
          }}
          variant="ghost"
          size="icon"
          onClick={() => handleClick(props)}
        >
          {inWishlist(props.id) ? (
            <BsFillHeartFill className="size-3" />
          ) : (
            <BsSuitHeart className="size-3" />
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
          {user?.role === "CUSTOMER" && (
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
      <p className="text-muted-foreground">{formatCurrency(props.price)}</p>
    </div>
  );
};

export default memo(ProductCard);
