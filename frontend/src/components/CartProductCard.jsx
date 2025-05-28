import { Stack } from "react-bootstrap";
import { formatCurrency } from "../lib/utils";
import { useCartConext } from "../contexts/CartContext";
import { BsTrash } from "react-icons/bs";
import { memo } from "react";

// eslint-disable-next-line react/prop-types
let CartProductCard = ({ id, imageUrl, title, price, quantity }) => {
  const { increaseQuantity, decreaseQuantity, setQuantity } = useCartConext();

  function handleChange(e) {
    if (e.target.value < 0) setQuantity(id, 0);
    else setQuantity(id, e.target.value);
  }

  return (
    <Stack direction="horizontal" gap={5} className="p-4 border-bottom">
      <div
        style={{
          width: "100px",
        }}
      >
        <img className="w-100" src={imageUrl} alt="" />
      </div>
      <Stack style={{ flex: 1 }}>
        <h4 style={{ fontSize: 14, fontWeight: "400" }}>{title}</h4>
        <p className="text-danger" style={{ fontSize: 12 }}>
          {formatCurrency(price)}
        </p>
        <Stack direction="horizontal" gap={4}>
          <Stack
            direction="horizontal"
            className="border"
            style={{ width: "fit-content" }}
          >
            <button
              disabled={quantity === 0}
              id="decrease"
              onClick={() => decreaseQuantity(id)}
            >
              {quantity === 1 ? <BsTrash /> : "-"}
            </button>
            <input
              type="number"
              name="quantity"
              value={quantity}
              onChange={handleChange}
              min={1}
            />
            <button id="increase" onClick={() => increaseQuantity(id)}>
              +
            </button>
          </Stack>
          {quantity > 1 && (
            <p className="text-danger m-0 " style={{ fontSize: 14 }}>
              {formatCurrency(quantity * price)}
            </p>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

CartProductCard = memo(CartProductCard);

export default CartProductCard;
