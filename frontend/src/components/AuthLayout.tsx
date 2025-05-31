import { Container, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="login-signup-bg">
      <Container className="py-4">
        <Row className="justify-content-center">
          <Outlet />
        </Row>
      </Container>
    </div>
  );
}

export default AuthLayout;
