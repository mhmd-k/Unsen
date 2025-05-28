import { Col, Container, Row } from "react-bootstrap";
import { useCartConext } from "../contexts/CartContext";
import { useWishlistContext } from "../contexts/WishListContext";
import { formatCurrency } from "../lib/utils";
import { BsSuitHeart } from "react-icons/bs";
import { data } from "../data/data";
import ProductCard from "../components/ProductCard";

export default function ProductDetail() {
  const { imageUrl, id, title, type, price } = JSON.parse(
    localStorage.getItem("item")
  );

  const { addItem } = useCartConext();
  const { addToWishlist } = useWishlistContext();

  return (
    <div className="product-detail">
      <Container>
        <Row className="my-5">
          <Col md={5} lg={5} sm={5} xs={12} className="pe-5">
            <div className="image w-100 h-100 d-flex align-items-center">
              <img src={imageUrl} className="w-100" alt="" />
            </div>
          </Col>
          <Col md={7} lg={7} sm={7} xs={12} className="ps-5">
            <h2 className="fs-5">{title}</h2>
            <h3>{formatCurrency(price)}</h3>
            <p className="text-muted">
              Cenean viverra rhoncus pede. Ut id nisl quis enim dignissim
              sagittis. Ut id nisl quis enim dignissim sagittis. Fusce ac felis
              sitpharetra condimentum...
            </p>
            <div>
              <button
                className="cart-link py-3"
                onClick={() => addItem({ id, imageUrl, title, type, price })}
              >
                ADD TO CART
              </button>
            </div>
            <div>
              <button
                className="add-to-wishlist"
                onClick={() =>
                  addToWishlist({ id, imageUrl, title, type, price })
                }
              >
                <span>
                  <BsSuitHeart />
                </span>{" "}
                Add to Wishlist
              </button>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="related-products mb-5">
        <h2 className="text-center mb-5">Related Products</h2>
        <Container fluid>
          <div className="products">
            {data
              .filter((product) => product.type === type && product.id !== id)
              .map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
          </div>
        </Container>
      </div>
    </div>
  );
}
