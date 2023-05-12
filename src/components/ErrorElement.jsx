import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function ErrorElement() {
  return (
    <Container
      style={{ height: "60vh" }}
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <h2 className="my-3 fs-5">404 - Page Not Found</h2>
      <Link to="/" className="cart-link">
        Return To Home Page
      </Link>
    </Container>
  );
}

export default ErrorElement;
