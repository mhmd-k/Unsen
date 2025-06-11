import { useWishlistContext } from "../contexts/WishListContext";
import WishlistCard from "@/components/WishlistCard";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

export default function Wishlist() {
  const { wishlist } = useWishlistContext();

  if (wishlist.length === 0) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center gap-4 text-center mt-8">
          <h3 className="text-muted-foreground text-base font-normal">
            Your Wishlist Is Empty
          </h3>
          <Button asChild>
            <Link to="/shop">ADD ITEMS TO YOUR WISHLIST</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-semibold text-center mb-8">Your Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((e) => (
          <WishlistCard key={e.id} {...e} />
        ))}
      </div>
    </div>
  );
}
