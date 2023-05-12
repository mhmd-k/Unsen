import {
  Container,
  InputGroup,
  Form,
  DropdownButton,
  Row,
} from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import { useSearchParams, NavLink, useLocation } from "react-router-dom";
import { data } from "../data/data";
import { useEffect, useRef, useState } from "react";
import ProductCard from "../components/ProductCard";

function Shop() {
  const [products, setProducts] = useState(data);
  const [searchInput, setSearchInput] = useState("");
  const inputRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const links = ["Home", "Shop"];
  const collectionFilter = searchParams.get("collection");
  if (collectionFilter) {
    links.push(collectionFilter);
  }
  const productsArr = collectionFilter
    ? products.filter((e) => e.type === collectionFilter.slice(0, -1))
    : products;

  const filteredProducts =
    searchInput === ""
      ? productsArr
      : productsArr.filter(
          (e) =>
            e.title
              .toLowerCase()
              .split(" ")
              .join("")
              .search(searchInput.toLowerCase().split(" ").join("")) !== -1
        );

  const location = useLocation();
  useEffect(() => {
    if (location.state?.search) {
      inputRef.current.focus();
    }
  }, [location]);

  function handleChange(e) {
    setSearchInput(e.target.value);
  }

  return (
    <>
      <div className="shop text-light">
        <h1 className="fw-light">Shop</h1>
        <div className="links py-3">
          {links.map((ele, index, arr) => (
            <NavLink
              key={ele.toLowerCase()}
              to={ele == "Home" ? "/" : `/${ele.toLowerCase()}`}
              className={
                index === arr.length - 1 ? "text-light" : "text-secondary"
              }
              onClick={(e) => {
                if (index === arr.length - 1) e.preventDefault();
              }}
            >
              {index === arr.length - 1 ? ` ${ele}` : ` ${ele} >`}
            </NavLink>
          ))}
        </div>
      </div>
      <Container fluid>
        <Row className="d-flex justify-content-between py-3">
          <DropdownButton
            id="dropdown-button-drop-up"
            drop="up"
            variant="secondary"
            title={"Filter"}
            style={{ width: "fit-content" }}
          >
            <NavLink to="?collection=headphones">Headphones</NavLink>
            <NavLink to="?collection=controllers">Game Controllers</NavLink>
            <NavLink to="?collection=speakers">Speakers</NavLink>
            <NavLink to="?collection=phone-cases">Phone Cases</NavLink>
          </DropdownButton>
          <InputGroup style={{ flex: "1", position: "relative" }}>
            <Form.Control
              placeholder="Product "
              ref={inputRef}
              value={searchInput}
              onChange={handleChange}
              style={{ fontWeight: "300" }}
            />
            {searchInput.length > 0 && (
              <AiOutlineClose size={20} onClick={() => setSearchInput("")} />
            )}
          </InputGroup>
        </Row>
        <div className="products py-5">
          {filteredProducts.length === 0 && (
            <h4
              className="text-muted text-center"
              style={{
                fontSize: 16,
                fontWeight: "400",
              }}
            >
              Nothing Match Your Search
            </h4>
          )}
          {filteredProducts.map((e) => (
            <ProductCard key={e.id} {...e} />
          ))}
        </div>
      </Container>
    </>
  );
}

export default Shop;
