import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link, NavLink } from "react-router-dom";
import { BsTextLeft, BsCart4, BsSuitHeart, BsSearch } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import Cart from "./Cart";
import { useCartConext } from "../context/cartContext";
import { formatCurrency } from "../utils/formatCurrency";

const categories = ["Headphones", "Phone cases", "Speakers", "Phone Cases"];

function Header() {
  const [show, setShow] = useState(false);
  const [cartShow, setCartShow] = useState(false);

  const { total } = useCartConext();

  function handleClick() {
    setCartShow(!cartShow);
  }

  const categoriesArr = categories.map((e) => (
    <NavLink
      key={e}
      to={`shop?collection=${e.toLowerCase().split(" ").join("-")}`}
      onClick={() => setShow(!show)}
      className="text-decoration-none"
    >
      {e}
    </NavLink>
  ));

  return (
    <>
      <Navbar
        collapseOnSelect
        className="d-none d-lg-block"
        bg="light"
        expand="lg"
        style={{
          position: "sticky",
          zIndex: 5,
        }}
      >
        <Container>
          <Navbar.Collapse id="basic-navbar-nav">
            <Link
              to="/"
              className="text-decoration-none text-dark fs-4 fw-bold"
            >
              unsen.
            </Link>
            <Nav
              className="m-auto d-flex align-items-center gap-3"
              style={{
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              <NavLink to="/" className="text-decoration-none text-dark">
                Home
              </NavLink>
              <NavLink
                to="shop"
                state={{ search: false }}
                className="text-decoration-none text-dark"
              >
                Shop
              </NavLink>
              <NavDropdown
                title="Collections"
                id="basic-nav-dropdown"
                className="text-dark"
              >
                <div className="menu">
                  <NavDropdown.Item>
                    <NavLink to="shop?collection=headphones">
                      Headphones
                    </NavLink>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <NavLink to="shop?collection=phone-cases">
                      Phone cases
                    </NavLink>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <NavLink to="shop?collection=speakers">Speakers</NavLink>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <NavLink to="shop?collection=controllers">
                      Game Controllers
                    </NavLink>
                  </NavDropdown.Item>
                </div>
              </NavDropdown>
            </Nav>
            <div className="d-flex gap-3 fs-5 header-icons">
              <Link to="shop" state={{ search: true }}>
                <BsSearch />
              </Link>
              <NavLink to="wishlist">
                <BsSuitHeart />
              </NavLink>
              <Link onClick={() => setCartShow(!cartShow)}>
                <span style={{ fontSize: 14, fontWeight: "600" }}>
                  {formatCurrency(total)}
                </span>{" "}
                <BsCart4 />
              </Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Navbar className="d-lg-none">
        <Container fluid className="d-flex justify-content-between">
          <Button
            onClick={() => setShow(!show)}
            className="bg-transparent text-dark border-0 fs-4 p-0"
          >
            <BsTextLeft />
          </Button>
          <NavLink
            to="/"
            className="text-decoration-none text-dark fs-4 fw-bold"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
            }}
          >
            unsen.
          </NavLink>
          <div className="d-flex gap-3 fs-4 header-icons">
            <Link to="shop" state={{ search: true }}>
              <BsSearch />
            </Link>
            <NavLink to="wishlist">
              <BsSuitHeart />
            </NavLink>
            <Link onClick={() => setCartShow(!cartShow)}>
              <BsCart4 />
            </Link>
          </div>
        </Container>
      </Navbar>
      <Offcanvas show={show} onHide={() => setShow(!show)} responsive="lg">
        <Offcanvas.Header>
          <AiOutlineClose
            className="ms-auto"
            size={24}
            style={{ cursor: "pointer" }}
            onClick={() => setShow(!show)}
          />
        </Offcanvas.Header>
        <Offcanvas.Body className="d-lg-none p-0">
          <Nav className="links">
            <NavLink
              to="/"
              onClick={() => setShow(!show)}
              className="text-decoration-none"
            >
              Home
            </NavLink>
            <NavLink
              to="shop"
              state={{ search: false }}
              onClick={() => setShow(!show)}
              className="text-decoration-none"
            >
              Shop
            </NavLink>
            <NavDropdown
              title="Collections"
              id="basic-nav-dropdown"
              className="text-dark"
            >
              {categoriesArr}
            </NavDropdown>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
      <Offcanvas
        placement="end"
        show={cartShow}
        onHide={() => setCartShow(!cartShow)}
      >
        <Offcanvas.Header closeButton>SHOPPING CART</Offcanvas.Header>
        <Cart setCartShow={handleClick} />
      </Offcanvas>
    </>
  );
}

export default Header;
