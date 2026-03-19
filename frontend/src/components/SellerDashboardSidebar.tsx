import clsx from "clsx";
import { BsBoxSeam } from "react-icons/bs";
import { LuLayoutDashboard } from "react-icons/lu";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { NavLink, useLocation } from "react-router-dom";
import { TbShoppingCartFilled } from "react-icons/tb";

const links = [
  {
    href: "/seller-dashboard",
    title: "dashboard",
    icon: <LuLayoutDashboard className="w-5 h-5" />,
  },
  {
    href: "/seller-dashboard/products",
    title: "Products",
    icon: <BsBoxSeam className="w-5 h-5" />,
  },
  {
    href: "/seller-dashboard/orders",
    title: "Orders",
    icon: <TbShoppingCartFilled className="w-5 h-5" />,
  },
];

const SellerDashboardSidebar = () => {
  const location = useLocation();

  return (
    <>
      {/* desktop sidebar */}
      <div className="hidden md:flex gap-6 border-r py-7 px-2 min-w-50">
        <div className="flex flex-col w-full">
          {links.map((link) => (
            <NavLink
              to={link.href}
              key={link.href}
              className={clsx(
                location.pathname === link.href ? "text-main!" : "",
                "w-full text-sm font-semibold whitespace-nowrap flex gap-2 items-center text-gray-600 py-2 px-4 hover:text-main! hover:bg-gray-100 hover:shadow-sm rounded-lg transition-all",
              )}
            >
              {link.icon} {link.title}
            </NavLink>
          ))}
        </div>
      </div>

      {/* mobile tabs */}
      <div className="container mx-auto px-2 md:hidden">
        <Tabs className="mt-4">
          <TabsList className="flex flex-col sm:flex-row h-fit! w-full">
            {links.map((link) => (
              <NavLink
                to={link.href}
                key={link.href}
                className={clsx(
                  location.pathname === link.href
                    ? "text-main! bg-white shadow-sm"
                    : "",
                  "w-full text-sm font-semibold whitespace-nowrap flex gap-2 items-center text-gray-600 py-2 px-4 hover:text-main! hover:bg-gray-100 hover:shadow-sm rounded-lg transition-all",
                )}
              >
                {link.icon} {link.title}
              </NavLink>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </>
  );
};

export default SellerDashboardSidebar;
