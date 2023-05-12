import { Link, useNavigate } from "react-router-dom";
import { Stack } from "react-bootstrap";
import CartProductCard from "./CartProductCard";
import { formatCurrency } from "../utils/formatCurrency";
import { useCartConext } from "../context/cartContext";

export default function Cart({ setCartShow }) {
  const { cart, total } = useCartConext();
  const navigate = useNavigate();
  function ReturnToShop() {
    setCartShow();
    navigate("shop");
  }

  const products = cart.map((product) => (
    <CartProductCard key={product.id} {...product} />
  ));

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
        {products}
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
          <Link
            className="cart-link py-3 px-5"
            style={{ borderRadius: "30px" }}
          >
            CHECK OUT
          </Link>
        </div>
      </div>
    </div>
  );
}
