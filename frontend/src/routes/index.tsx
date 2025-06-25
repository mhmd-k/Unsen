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
import { RoleGuard } from "@/components/guard";
import AddProduct from "@/pages/AddProduct";

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
              <RoleGuard requiredRoles={["SELLER"]}>
                <AddProduct />
              </RoleGuard>
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
            <RoleGuard requiredRoles={["CUSTOMER"]}>
              <Wishlist />
            </RoleGuard>
          }
        />

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
