import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";
import CartProductCard from "./CartProductCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cart";

export default function Cart({ setCartShow }: { setCartShow: () => void }) {
  const { cart, total } = useCartStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  function ReturnToShop() {
    setCartShow();
    navigate("shop");
  }

  function handleCheckout() {
    if (user) {
      navigate("/checkout");
      return;
    }

    toast.warning("You need to be logged in to do this action!");
  }

  if (cart.length === 0) {
    return (
      <div className="cart">
        <div className="flex flex-col gap-2 text-center mt-5">
          <h4 className="text-gray-600 font-normal text-lg">
            Your cart is empty
          </h4>
          <Button className="cart-link rounded-none" onClick={ReturnToShop}>
            RETURN TO SHOP
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart overflow-y-auto">
      <div className="flex flex-col gap-2 flex-0">
        {/* products in cart */}
        {cart.map((product) => (
          <CartProductCard key={product.id} {...product} />
        ))}
      </div>
      <div className="bottom-cart-total p-3">
        <div className="flex">
          <div className="font-medium text-xl">Total: </div>
          <span className="text-danger ms-auto font-semibold text-xl">
            {formatCurrency(total)}
          </span>
        </div>
        <div className="my-5 text-center">
          <Button onClick={handleCheckout} className="main-btn py-3 px-5">
            CHECK OUT
          </Button>
        </div>
      </div>
    </div>
  );
}
