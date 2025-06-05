import { Link, useNavigate } from "react-router-dom";
import { Stack } from "react-bootstrap";
import CartProductCard from "./CartProductCard";
import { formatCurrency } from "../lib/utils";
import { useCartConext } from "../contexts/CartContext";

// eslint-disable-next-line react/prop-types
export default function Cart({ setCartShow }) {
  const { cart, total } = useCartConext();
  const navigate = useNavigate();
  function ReturnToShop() {
    setCartShow();
    navigate("shop");
  }

  if (cart.length === 0) {
    return (
      <div className="cart">
        <Stack gap={2} className="text-center mt-5">
          <h4
            className="text-muted"
            style={{
              fontSize: 14,
              fontWeight: "400",
            }}
          >
            Your cart is empty
          </h4>
          <button className="cart-link" onClick={ReturnToShop}>
            RETURN TO SHOP
          </button>
        </Stack>
      </div>
    );
  }

  return (
    <div className="cart" style={{ overflowY: "scroll" }}>
      <Stack gap={2} direction="column" style={{ flex: 0 }}>
        {/* products in cart */}
        {cart.map((product) => (
          <CartProductCard key={product.id} {...product} />
        ))}
      </Stack>
      <div className="bottom-cart-total p-3">
        <Stack direction="horizontal">
          <div style={{ fontWeight: "500", fontSize: 20 }}>Subtotal: </div>
          <span
            className="text-danger ms-auto"
            style={{ fontWeight: "600", fontSize: 20 }}
          >
            {formatCurrency(total)}
          </span>
        </Stack>
        <div className="my-5 text-center">
          <Link className="main-btn py-3 px-5">CHECK OUT</Link>
        </div>
      </div>
    </div>
  );
}
