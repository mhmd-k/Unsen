import { AiOutlineClose } from "react-icons/ai";
import { useSearchParams, NavLink, useLocation, Link } from "react-router-dom";
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
import { getProducts } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import loadingSpinner from "../assets/icons/Infinity-1s-150px (1).svg";
import { FaBoxOpen } from "react-icons/fa";
import { categories } from "@/lib/constants";

function Shop() {
  const [searchInput, setSearchInput] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");

  const location = useLocation();
  useEffect(() => {
    if (location.state?.search && inputRef.current) {
      inputRef.current.focus();
    }
  }, [location]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", category],
    queryFn: () => (category ? getProducts(category) : getProducts()),
  });

  const productsArr = category
    ? products?.filter((e) => e.category === category)
    : products;

  const filteredProducts =
    searchInput === ""
      ? productsArr
      : productsArr?.filter(
        (e) =>
          e.name
            .toLowerCase()
            .trim()
            .search(searchInput.toLowerCase().trim()) !== -1
      );

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
                    style={{ color: category ? "gray" : "white" }}
                  >
                    Shop
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {category && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white">
                      {categories.find((e) => e.value === category)?.label}
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
                <NavLink to="?category=headphones">Headphones</NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="?category=game-controllers">
                  Game Controllers
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="?category=speakers">Speakers</NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="?category=phone-cases">Phone Cases</NavLink>
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

        {isLoading ? (
          <div className="flex justify-center">
            <img src={loadingSpinner} alt="loading spinner" />
          </div>
        ) : (
          <div className="py-5">
            {filteredProducts?.length === 0 && (
              <h4 className="text-gray-400 flex flex-col gap-2 w-full justify-center items-center">
                <FaBoxOpen size={50} className="text-gray-300" /> Nothing found
              </h4>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 products">
              {filteredProducts?.map((e) => <ProductCard key={e.id} {...e} />)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Shop;
