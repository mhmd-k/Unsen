import { BsCart2, BsEye } from "react-icons/bs";
import { formatCurrency } from "../lib/utils";
import { AiOutlineClose } from "react-icons/ai";
import { useWishlistContext } from "../contexts/WishListContext";
import { useCartConext } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { memo } from "react";
import type { Product } from "@/types";

let WishlistCard = ({ id, imageUrl, title, price, type }: Product) => {
  const { removeFromWishlist } = useWishlistContext();

  const { addItem } = useCartConext();

  const navigate = useNavigate();

  function handleView() {
    localStorage.setItem(
      "item",
      JSON.stringify({ id, imageUrl, title, price, type })
    );
    navigate(`/shop/${id}`, { state: { isLoading: true } });
  }

  return (
    <div className="card position-relative">
      <button
        className="btn wishlist"
        title="Add to wishlist"
        onClick={() => removeFromWishlist(id)}
      >
        <AiOutlineClose />
      </button>
      <div className="image">
        <img src={imageUrl} alt="..." />
        <div className="buttons">
          <button className="btn view" onClick={handleView}>
            Quick View
          </button>
          <button
            className="btn add-top-cart"
            onClick={() =>
              addItem({ id, imageUrl, title, price, type, quantity: 1 })
            }
          >
            Add To Cart
          </button>
        </div>
      </div>
      <div className="buttons w-100">
        <button className="btn border view w-50" onClick={handleView}>
          <BsEye />
        </button>
        <button
          className="btn border add-to-cart w-50"
          onClick={() =>
            addItem({ id, imageUrl, title, price, type, quantity: 1 })
          }
        >
          <BsCart2 />
        </button>
      </div>
      <h3>{title}</h3>
      <p className="text-muted">{formatCurrency(price)}</p>
    </div>
  );
};

export default memo(WishlistCard);
