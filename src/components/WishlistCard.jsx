import { BsCart2, BsEye } from "react-icons/bs";
import { formatCurrency } from "../utils/formatCurrency";
import { AiOutlineClose } from "react-icons/ai";
import { useWishlistContext } from "../context/WishlistContext";
import { useCartConext } from "../context/cartContext";
import { useNavigate } from "react-router-dom";

function WishlistCard({ id, imageUrl, title, price, type }) {
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
            onClick={() => addItem({ id, imageUrl, title, price, type })}
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
          onClick={() => addItem({ id, imageUrl, title, price, type })}
        >
          <BsCart2 />
        </button>
      </div>
      <h3>{title}</h3>
      <p className="text-muted">{formatCurrency(price)}</p>
    </div>
  );
}

export default WishlistCard;
