import { useWishlistContext } from "../context/WishlistContext";
import WishlistCard from "../components/WishlistCard";
import { Container, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
export default function Wishlist() {
  const { wishlist } = useWishlistContext();

  if (wishlist.length === 0) {
    return (
      <Container fluid className="py-5">
        <Stack gap={2} className="text-center mt-5">
          <h3
            className="text-muted"
            style={{
              fontSize: 16,
              fontWeight: "400",
            }}
          >
            Your Wishlist Is Empty
          </h3>
          <Link className="cart-link" to="/shop">
            ADD ITEMS TO YOUR WISHLIST
          </Link>
        </Stack>
      </Container>
    );
  }

  return (
    <Container fluid className="py-5">
      <h2 className="fs-3 text-center mb-5">Your Wishlist</h2>
      <div className="products">
        {wishlist.map((e) => (
          <WishlistCard key={e.id} {...e} />
        ))}
      </div>
    </Container>
  );
}
