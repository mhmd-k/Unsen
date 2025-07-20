import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { BsSuitHeart, BsSearch } from "react-icons/bs";
import { useCartConext } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cart from "./Cart";
import {
  ShoppingCart,
  Headphones,
  Smartphone,
  Speaker,
  Gamepad2,
  LogOut,
  UserCog,
  CircleUserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { AxiosError } from "axios";
import MobileSidebar from "./MobileSidebar";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "shop", label: "Shop", state: { search: false } },
];

function Appbar() {
  const [show, setShow] = useState(false);
  const [cartShow, setCartShow] = useState(false);

  const navigate = useNavigate();

  const { total } = useCartConext();
  const { updateUser, isAuthenticated, user } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();

  function handleShowCart() {
    setCartShow(!cartShow);
  }

  const handleLogout = async () => {
    try {
      // Call logout endpoint to invalidate tokens on the server
      await axiosPrivate.post("/auth/logout");
      updateUser(null);
      toast.success("Successfully logged out");
      navigate("/login");
    } catch (error: unknown) {
      console.error("Logout error:", error);
      toast.error(
        error instanceof AxiosError
          ? error.message
          : "An error occurred while logging you out! Please try again"
      );
    } finally {
      setShow(false);
    }
  };

  return (
    <>
      <div className="hidden lg:block sticky z-10 shadow-lg py-2">
        <div className="container px-4 lg:px-8 mx-auto">
          <div className="flex">
            <Link
              to="/"
              className="text-decoration-none text-dark text-2xl font-bold"
            >
              unsen.
            </Link>

            <nav className="m-auto flex align-items-center">
              {navLinks.map((link) => (
                <Button variant="ghost" key={link.path}>
                  <NavLink to={link.path} state={link.state}>
                    {link.label}
                  </NavLink>
                </Button>
              ))}

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="px-4 m-0">
                      categorys
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/shop?category=headphones"
                          className="whitespace-nowrap flex flex-row items-center gap-2"
                        >
                          <Headphones className="size-5 text-inherit" />
                          Headphones
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/shop?category=phone-cases"
                          className="whitespace-nowrap flex flex-row items-center gap-2"
                        >
                          <Smartphone className="size-5 text-inherit" />
                          Phone cases
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/shop?category=speakers"
                          className="whitespace-nowrap flex flex-row items-center gap-2"
                        >
                          <Speaker className="size-5 text-inherit" />
                          Speakers
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/shop?category=game-controllers"
                          className="whitespace-nowrap flex flex-row items-center gap-2"
                        >
                          <Gamepad2 className="size-5 text-inherit" />
                          Game Controllers
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>

            <div className="flex gap-3 items-center fs-5 header-icons">
              {!isAuthenticated && !location.pathname.includes("login") && (
                <Link to="/login" className="main-btn">
                  Login
                </Link>
              )}
              {isAuthenticated &&
                user?.role === "SELLER" &&
                !location.pathname.includes("add-product") && (
                  <Link to="/add-product" className="main-btn">
                    Sell a product
                  </Link>
                )}
              <Link to="shop" state={{ search: true }}>
                <BsSearch />
              </Link>

              {user?.role === "CUSTOMER" && (
                <NavLink to="wishlist">
                  <BsSuitHeart />
                </NavLink>
              )}

              {isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <CircleUserRound
                      strokeWidth={1}
                      className="cursor-pointer hover:text-main hover:scale-115 ease-in-out duration-300 transition-all"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <NavLink
                          to="/account"
                          className="cursor-pointer flex whitespace-nowrap gap-2"
                        >
                          <UserCog /> Account
                        </NavLink>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="flex gap-2"
                      >
                        <LogOut /> Log out
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {user?.role !== "SELLER" && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="gap-1">
                      <span className="text-xs font-semibold">
                        {formatCurrency(total)}
                      </span>
                      <ShoppingCart strokeWidth={1.6} className="size-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle className="text-xl font-normal">
                        SHOPPING CART
                      </SheetTitle>
                    </SheetHeader>
                    <Cart setCartShow={handleShowCart} />
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* mobile Appbar */}
      <div className="lg:hidden sticky z-10 shadow-lg py-2">
        <div className="container px-4 mx-auto flex justify-between items-center">
          <MobileSidebar
            handleLogout={handleLogout}
            show={show}
            setShow={setShow}
          />

          <NavLink to="/" className="text-2xl font-semibold transition-all">
            unsen.
          </NavLink>

          <div className="header-icons flex items-center gap-3 text-2xl">
            <Link to="shop" state={{ search: true }}>
              <BsSearch />
            </Link>

            {user?.role === "CUSTOMER" && (
              <NavLink to="wishlist">
                <BsSuitHeart />
              </NavLink>
            )}

            {user?.role !== "SELLER" && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="header-icons">
                    <a href="#">
                      <ShoppingCart strokeWidth={1.6} className="size-6" />
                    </a>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle className="text-xl font-normal">
                      SHOPPING CART
                    </SheetTitle>
                  </SheetHeader>
                  <Cart setCartShow={handleShowCart} />
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Appbar;
