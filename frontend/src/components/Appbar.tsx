import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BsTextLeft, BsSuitHeart, BsSearch } from "react-icons/bs";
import { useCartConext } from "../contexts/CartContext";
import { formatCurrency } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cart from "./Cart";
import {
  ShoppingCart,
  Headphones,
  Smartphone,
  Speaker,
  Gamepad2,
  User,
  LogOut,
  UserCog,
} from "lucide-react";
import toast from "react-hot-toast";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { AxiosError } from "axios";

const categories = ["Headphones", "Phone cases", "Speakers", "Phone Cases"];

function Appbar() {
  const [show, setShow] = useState(false);
  const [cartShow, setCartShow] = useState(false);

  const navigate = useNavigate();

  const { total } = useCartConext();
  const { updateUser, isAuthenticated } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "shop", label: "Shop", state: { search: false } },
  ];

  function handleClick() {
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
                      Collections
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <NavigationMenuLink asChild>
                        <NavLink
                          to="/shop?collection=headphones"
                          className="whitespace-nowrap flex flex-row items-center gap-2"
                        >
                          <Headphones className="size-4" />
                          Headphones
                        </NavLink>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <NavLink
                          to="/shop?collection=phone-cases"
                          className="whitespace-nowrap flex flex-row items-center gap-2"
                        >
                          <Smartphone className="size-4" />
                          Phone cases
                        </NavLink>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <NavLink
                          to="/shop?collection=speakers"
                          className="whitespace-nowrap flex flex-row items-center gap-2"
                        >
                          <Speaker className="size-4" />
                          Speakers
                        </NavLink>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <NavLink
                          to="/shop?collection=controllers"
                          className="whitespace-nowrap flex flex-row items-center gap-2"
                        >
                          <Gamepad2 className="size-4" />
                          Game Controllers
                        </NavLink>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </nav>

            <div className="flex gap-3 items-center fs-5 header-icons">
              {!isAuthenticated && (
                <Link to="/login" className="main-btn">
                  Login
                </Link>
              )}
              <Link to="shop" state={{ search: true }}>
                <BsSearch />
              </Link>
              {isAuthenticated && (
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="p-0">
                        <User strokeWidth={1.2} />
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <NavigationMenuLink asChild>
                          <NavLink
                            to="/account"
                            className="cursor-pointer flex-row whitespace-nowrap gap-2"
                          >
                            <UserCog /> Account
                          </NavLink>
                        </NavigationMenuLink>
                        <NavigationMenuLink
                          className="cursor-pointer flex-row whitespace-nowrap gap-2"
                          onClick={handleLogout}
                        >
                          <LogOut /> Log out
                        </NavigationMenuLink>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              )}
              <NavLink to="wishlist">
                <BsSuitHeart />
              </NavLink>
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
                  <Cart setCartShow={handleClick} />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* mobile Appbar */}
      <div className="lg:hidden sticky z-10 shadow-lg py-2">
        <div className="container px-2 mx-auto flex justify-between items-center">
          <Sheet>
            <SheetTrigger asChild>
              <div className="header-icons">
                <a href="#">
                  <BsTextLeft size={30} />
                </a>
              </div>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader></SheetHeader>
              <div className="container h-full px-2 mx-auto flex flex-col gap-4 mt-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    state={link.state}
                    onClick={() => setShow(false)}
                    className="text-lg hover:text-primary transition-colors"
                  >
                    {link.label}
                  </NavLink>
                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <a
                      href="#"
                      className="text-lg hover:text-primary transition-colors"
                    >
                      Collections
                    </a>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>{categoriesArr}</DropdownMenuContent>
                </DropdownMenu>
                {isAuthenticated && (
                  <div className="flex gap-4 mt-auto mb-4 ">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => navigate("/account")}
                    >
                      <UserCog className="size-6" />
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 rounded-none"
                      onClick={handleLogout}
                    >
                      Log out <LogOut />
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <NavLink to="/" className="text-2xl font-semibold transition-all">
            unsen.
          </NavLink>

          <div className="header-icons flex items-center gap-3 text-2xl">
            <Link to="shop" state={{ search: true }}>
              <BsSearch />
            </Link>
            <NavLink to="wishlist">
              <BsSuitHeart />
            </NavLink>

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
                <Cart setCartShow={handleClick} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </>
  );
}

export default Appbar;
