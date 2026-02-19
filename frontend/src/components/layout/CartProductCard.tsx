import { formatCurrency } from "@/lib/utils";
import { BsTrash } from "react-icons/bs";
import { memo, type ChangeEvent } from "react";
import type { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";

const CartProductCard = ({
  id,
  price,
  quantity,
  images,
  primaryImageIndex,
  name,
  discount,
  stock,
}: CartItem) => {
  const { increaseQuantity, decreaseQuantity, setQuantity, cart } =
    useCartStore();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (Number(e.target.value) < 0) setQuantity(id, 0);
    else setQuantity(id, Number(e.target.value));
  }

  const item = cart.find((e) => e.id === id);

  return (
    <div className="flex gap-5 p-4 border-bottom">
      <div
        style={{
          width: "100px",
        }}
      >
        <img className="w-100" src={images[primaryImageIndex]} alt={name} />
      </div>
      <div style={{ flex: 1 }}>
        <h4 className="text-sm">{name}</h4>
        <p className="text-muted-foreground flex gap-2 items-center text-sm">
          {discount > 0 ? (
            <span className="line-through text-xs">
              {formatCurrency(price)}
            </span>
          ) : (
            formatCurrency(price)
          )}
          {discount > 0 && (
            <span className="text-red-400">
              {formatCurrency(price - (discount * price) / 100)}
            </span>
          )}
        </p>
        <div className="flex gap-4 items-center">
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
              disabled={item?.quantity === stock}
            >
              +
            </Button>
          </div>

          <p className="text-red-600 m-0 text-base">
            {formatCurrency((price - (discount * price) / 100) * quantity)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(CartProductCard);
