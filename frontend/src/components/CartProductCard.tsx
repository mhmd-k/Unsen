import { formatCurrency } from "../lib/utils";
import { useCartConext } from "../contexts/CartContext";
import { BsTrash } from "react-icons/bs";
import { memo, type ChangeEvent } from "react";
import type { CartItem } from "@/types";
import { Button } from "./ui/button";

const CartProductCard = ({
  id,
  imageUrl,
  title,
  price,
  quantity,
}: CartItem) => {
  const { increaseQuantity, decreaseQuantity, setQuantity } = useCartConext();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (Number(e.target.value) < 0) setQuantity(id, 0);
    else setQuantity(id, Number(e.target.value));
  }

  return (
    <div className="flex gap-5 p-4 border-bottom">
      <div
        style={{
          width: "100px",
        }}
      >
        <img className="w-100" src={imageUrl} alt="" />
      </div>
      <div style={{ flex: 1 }}>
        <h4 className="text-sm">{title}</h4>
        <p className="text-red-600 text-xs my-2">{formatCurrency(price)}</p>
        <div className="flex gap-4">
          <div className="flex w-fit border rounded-md">
            <Button
              disabled={quantity === 0}
              variant="ghost"
              size="icon"
              onClick={() => decreaseQuantity(id)}
            >
              {quantity === 1 ? <BsTrash /> : "-"}
            </Button>
            <input
              type="number"
              name="quantity"
              value={quantity}
              onChange={handleChange}
              min={1}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => increaseQuantity(id)}
            >
              +
            </Button>
          </div>
          {quantity > 1 && (
            <p className="text-red-600 m-0" style={{ fontSize: 14 }}>
              {formatCurrency(quantity * price)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(CartProductCard);
