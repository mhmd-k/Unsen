import { Routes, Route } from "react-router-dom";
import { AuthRoute } from "../components/AuthRoute";
import Home from "../pages/Home";
import Layout from "@/components/layout";
import Shop from "../pages/Shop";
import Wishlist from "../pages/Wishlist";
import ProductDetail from "../pages/ProductDetail";
import Signup from "../pages/Signup";
import VerifyEmail from "../pages/VerifyEmail";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import AuthLayout from "../components/AuthLayout";
import NotFound from "../pages/NotFound";
import { ProtectedRoute } from "../components/ProtectedRoute";
import Account from "../pages/Account";
import { RolePageGuard } from "@/components/guard";
import AddProduct from "@/pages/AddProduct";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";
import OrderDetails from "@/pages/OrderDetails";
import Payment from "@/pages/payment";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Auth routes - only accessible when not logged in */}
        <Route element={<AuthRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Route>
        </Route>

        {/* Protected routes - only accessible when logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<Account />} />
          <Route
            path="/add-product"
            element={
              <RolePageGuard requiredRoles={["SELLER"]}>
                <AddProduct />
              </RolePageGuard>
            }
          />
          <Route
            path="/checkout"
            element={
              <RolePageGuard requiredRoles={["CUSTOMER"]}>
                <Checkout />
              </RolePageGuard>
            }
          />
          <Route
            path="/checkout/payment/:orderId"
            element={
              <RolePageGuard requiredRoles={["CUSTOMER"]}>
                <Payment />
              </RolePageGuard>
            }
          />
          <Route
            path="/orders"
            element={
              <RolePageGuard requiredRoles={["CUSTOMER"]}>
                <Orders />
              </RolePageGuard>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <RolePageGuard requiredRoles={["CUSTOMER"]}>
                <OrderDetails />
              </RolePageGuard>
            }
          />
        </Route>

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:id" element={<ProductDetail />} />
        <Route
          path="wishlist"
          element={
            <RolePageGuard requiredRoles={["CUSTOMER"]}>
              <Wishlist />
            </RolePageGuard>
          }
        />

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
