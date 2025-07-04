import { AiOutlineClose } from "react-icons/ai";
import { useSearchParams, NavLink, useLocation, Link } from "react-router-dom";
import { data } from "../data/data";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import ProductCard from "@/components/ProductCard";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import {
  Breadcrumb,
  BreadcrumbPage,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Filter } from "lucide-react";

const products = data;

function Shop() {
  const [searchInput, setSearchInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [searchParams] = useSearchParams();
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
    if (location.state?.search && inputRef.current) {
      inputRef.current.focus();
    }
  }, [location]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setSearchInput(e.target.value);
  }

  return (
    <>
      <div className="shop text-light">
        <h1 className="font-light text-white text-4xl">Shop</h1>
        <div className="links py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" style={{ color: "gray" }}>
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    to="/shop"
                    style={{ color: collectionFilter ? "gray" : "white" }}
                  >
                    Shop
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {collectionFilter && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white">
                      {collectionFilter}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center py-3 gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                <Filter /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <NavLink to="?collection=headphones">Headphones</NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="?collection=controllers">Game Controllers</NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="?collection=speakers">Speakers</NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="?collection=phone-cases">Phone Cases</NavLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative flex-1">
            <Input
              placeholder="Search products..."
              ref={inputRef}
              value={searchInput}
              onChange={handleChange}
              className="pr-8"
            />
            {searchInput.length > 0 && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchInput("")}
              >
                <AiOutlineClose size={20} />
              </button>
            )}
          </div>
        </div>
        <div className="py-5">
          {filteredProducts.length === 0 && (
            <h4 className="text-muted-foreground text-center text-base font-normal">
              Nothing Match Your Search
            </h4>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 products">
            {filteredProducts.map((e) => (
              <ProductCard key={e.id} {...e} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Shop;
