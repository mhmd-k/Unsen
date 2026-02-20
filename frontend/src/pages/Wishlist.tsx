import WishlistCard from "@/components/WishlistCard";
import { useWishlistStore } from "@/stores/wishlist";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { wishlist } = useWishlistStore();

  if (wishlist.length === 0) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center gap-4 text-center mt-8">
          <h1 className="text-muted-foreground text-base font-normal">
            Your Wishlist Is Empty
          </h1>

          <Link className="cart-link" to="/shop">
            ADD ITEMS TO YOUR WISHLIST
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="products container px-4 mx-auto py-8">
      <h1 className="text-4xl mb-8 text-center">Your Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((e) => (
          <WishlistCard key={e.id} {...e} />
        ))}
      </div>
    </div>
  );
}
