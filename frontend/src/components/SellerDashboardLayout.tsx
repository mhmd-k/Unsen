import { Outlet } from "react-router-dom";
import SellerDashboardSidebar from "./SellerDashboardSidebar";

const SellerDashboardLayout = () => {
  return (
    <div className="flex gap-3 flex-col md:flex-row flex-1">
      <SellerDashboardSidebar />

      <div className="container mx-auto px-4 md:py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default SellerDashboardLayout;
