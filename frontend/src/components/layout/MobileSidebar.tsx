import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import type { Dispatch, SetStateAction } from "react";
import { BsTextLeft } from "react-icons/bs";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { LogOut, UserCog } from "lucide-react";
import { categories } from "@/lib/constants";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/shop", label: "Shop", state: { search: false } },
];

interface MobileSidebarProps {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  handleLogout: () => Promise<void>;
}

const MobileSidebar = ({ setShow, show, handleLogout }: MobileSidebarProps) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
    <Sheet>
      <SheetTrigger asChild>
        <div className="header-icons">
          <a href="#">
            <BsTextLeft size={30} />
          </a>
        </div>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="sr-only">Links</SheetTitle>
          <SheetDescription className="sr-only">
            Navigation Links
          </SheetDescription>
        </SheetHeader>
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
          {isAuthenticated && user?.role === "SELLER" && (
            <NavLink
              to="/add-product"
              onClick={() => setShow(false)}
              className="text-lg hover:text-primary transition-colors"
            >
              Sell a product
            </NavLink>
          )}
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="outline"
                    className="bg-gray-300"
                    onClick={() => navigate("/account")}
                  >
                    <UserCog className="size-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Account</p>
                </TooltipContent>
              </Tooltip>

              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleLogout}
              >
                Log out <LogOut />
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
