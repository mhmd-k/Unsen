import { BsSuitHeart, BsCart2, BsEye, BsFillHeartFill } from "react-icons/bs";
import { formatCurrency } from "../utils/formatCurrency";
import { useCartConext } from "../context/cartContext";
import { useWishlistContext } from "../context/WishlistContext";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
let ProductCard = ({ id, imageUrl, title, price, type }) => {
  const { inWishlist, addToWishlist, removeFromWishlist } =
    useWishlistContext();

  const [heartClicked, setHeartClicked] = useState(inWishlist(id));
  const { addItem } = useCartConext();

  const exists = inWishlist(id);

  const navigate = useNavigate();

  function handleView() {
    localStorage.setItem(
      "item",
      JSON.stringify({ id, imageUrl, title, price, type })
    );
    navigate(`/shop/${id}`, { state: { isLoading: true } });
  }

  function handleClick(item) {
    if (heartClicked) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
    setHeartClicked(!heartClicked);
  }

  return (
    <div className="card position-relative">
      <button
        className="btn wishlist"
        title="Add to wishlist"
        style={{
          backgroundColor: exists ? "#E33131" : "white",
          color: exists ? "white" : "black",
        }}
        onClick={() => handleClick({ id, imageUrl, title, price, type })}
      >
        {inWishlist(id) ? <BsFillHeartFill /> : <BsSuitHeart />}
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
};

ProductCard = memo(ProductCard);

export default ProductCard;
