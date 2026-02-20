import { BsCart2, BsEye } from "react-icons/bs";
import { formatCurrency } from "../lib/utils";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { memo } from "react";
import type { Product } from "@/types";
import { Button } from "./ui/button";
import { useCartStore } from "@/stores/cart";
import { useWishlistStore } from "@/stores/wishlist";

const WishlistCard = (props: Product) => {
  const { id, name, images, price, primaryImageIndex } = props;

  const { removeFromWishlist } = useWishlistStore();

  const { addItem } = useCartStore();

  const navigate = useNavigate();

  function handleView() {
    localStorage.setItem("item", JSON.stringify(props));
    navigate(`/shop/${id}`, { state: { isLoading: true } });
  }

  return (
    <div className="shop-card relative">
      <Button
        className="btn wishlist rounded-full"
        variant="outline"
        title="remove from wishlist"
        size="icon"
        onClick={() => removeFromWishlist(id)}
      >
        <AiOutlineClose />
      </Button>
      <div className="image">
        <img src={images[primaryImageIndex]} alt="..." />
        <div className="buttons">
          <Button className="view" variant="ghost" onClick={handleView}>
            Quick View
          </Button>
          <Button
            className="add-top-cart"
            variant="ghost"
            onClick={() => addItem({ ...props, quantity: 1 })}
          >
            Add To Cart
          </Button>
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

        <Button
          className="border-l-1 rounded-none flex-1 group hover:bg-gray-50"
          variant="link"
          onClick={() => addItem({ ...props, quantity: 1 })}
        >
          <BsCart2 className="group-hover:scale-150 transition-all duration-300 ease-in-out" />
        </Button>
      </div>
      <h3>{name}</h3>
      <p className="text-muted-foreground">{formatCurrency(price)}</p>
    </div>
  );
};

export default memo(WishlistCard);
