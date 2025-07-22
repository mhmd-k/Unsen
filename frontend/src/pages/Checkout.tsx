import CheckoutForm from "@/components/CheckoutForm";
import { Separator } from "@/components/ui/separator";
import { useCartConext } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";

const Checkout = () => {
  const { cart, total } = useCartConext();

  return (
    <div className="container px-2 mx-auto bg-gray-100">
      <div className="flex flex-row-reverse gap-6 my-10">
        <div className="flex flex-col gap-2 flex-1">
          {cart.map((product) => (
            <>
              <div className="flex gap-5 p-4 items-center">
                <div className="relative w-24 h-24 bg-white rounded-lg border-1 border-gray-300">
                  <div className="absolute w-6 h-6 font-bold -left-2 -top-2 bg-gray-500 text-white border-1 rounded-full flex justify-center items-center">
                    {product.quantity}
                  </div>
                  <img
                    className="w-full h-full object-contain rounded-lg"
                    src={product.images[product.primaryImageIndex]}
                    alt={product.name}
                  />
                </div>

                <h2 className="text-base">{product.name}</h2>

                <p className="text-muted-foreground m-0 text-sm ms-auto">
                  {formatCurrency(
                    (product.price - (product.discount * product.price) / 100) *
                      product.quantity
                  )}
                </p>
              </div>
              <Separator />
            </>
          ))}

          <div className="flex max-w-[400px] mx-auto gap-12 font-medium text-xl">
            Total:
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* form */}
        <CheckoutForm />
      </div>
    </div>
  );
};

export default Checkout;
