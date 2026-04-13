import { createBrowserRouter } from "react-router-dom";

import Layout from "@/components/layout";
import AuthLayout from "@/components/AuthLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RolePageGuard } from "@/components/guard";

import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import Wishlist from "@/pages/Wishlist";
import ProductDetail from "@/pages/ProductDetail";
import Signup from "@/pages/Signup";
import VerifyEmail from "@/pages/VerifyEmail";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import NotFound from "@/pages/NotFound";
import Account from "@/pages/Account";
import AddProduct from "@/pages/seller-dashboard/AddProduct";
import Checkout from "@/pages/Checkout";
import Orders from "@/pages/Orders";
import OrderDetails from "@/pages/OrderDetails";
import Payment from "@/pages/Payment";
import SellerDashboardLayout from "./components/SellerDashboardLayout";
import SellerDashboard from "@/pages/seller-dashboard/Home";
import Products from "./pages/seller-dashboard/Products";
import EditProduct from "./pages/seller-dashboard/EditProduct";
import SellerInvoices from "./pages/seller-dashboard/SellerInvoices";
import InvoiceDetails from "@/pages/seller-dashboard/InvoiceDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // ========================
      // PUBLIC ROUTES
      // ========================
      { index: true, element: <Home /> },
      { path: "shop", element: <Shop /> },
      { path: "shop/:id", element: <ProductDetail /> },
      {
        path: "wishlist",
        element: (
          <RolePageGuard requiredRoles={["CUSTOMER"]}>
            <Wishlist />
          </RolePageGuard>
        ),
      },

      // ========================
      // AUTH ROUTES
      // ========================
      {
        element: <AuthLayout />,
        children: [
          { path: "signup", element: <Signup /> },
          { path: "login", element: <Login /> },
          { path: "forgot-password", element: <ForgotPassword /> },
          { path: "verify-email", element: <VerifyEmail /> },
        ],
      },

      // ========================
      // PROTECTED ROUTES
      // ========================
      {
        element: <ProtectedRoute />,
        children: [
          { path: "account", element: <Account /> },

          {
            path: "seller-dashboard",
            element: <SellerDashboardLayout />,
            children: [
              {
                index: true,
                element: (
                  <RolePageGuard requiredRoles={["SELLER"]}>
                    <SellerDashboard />
                  </RolePageGuard>
                ),
              },
              {
                path: "invoices",
                element: (
                  <RolePageGuard requiredRoles={["SELLER"]}>
                    <SellerInvoices />
                  </RolePageGuard>
                ),
              },
              {
                path: "invoices/:id",
                element: (
                  <RolePageGuard requiredRoles={["SELLER"]}>
                    <InvoiceDetails />
                  </RolePageGuard>
                ),
              },
              {
                path: "products",
                children: [
                  {
                    element: (
                      <RolePageGuard requiredRoles={["SELLER"]}>
                        <Products />
                      </RolePageGuard>
                    ),
                    index: true,
                  },
                  {
                    path: "add-product",
                    element: (
                      <RolePageGuard requiredRoles={["SELLER"]}>
                        <AddProduct />
                      </RolePageGuard>
                    ),
                  },
                  {
                    path: "edit-product/:id",
                    element: (
                      <RolePageGuard requiredRoles={["SELLER"]}>
                        <EditProduct />
                      </RolePageGuard>
                    ),
                  },
                ],
              },
            ],
          },

          {
            path: "checkout",
            element: (
              <RolePageGuard requiredRoles={["CUSTOMER"]}>
                <Checkout />
              </RolePageGuard>
            ),
          },

          {
            path: "checkout/payment/:orderId",
            element: (
              <RolePageGuard requiredRoles={["CUSTOMER"]}>
                <Payment />
              </RolePageGuard>
            ),
          },

          {
            path: "orders",
            element: (
              <RolePageGuard requiredRoles={["CUSTOMER"]}>
                <Orders />
              </RolePageGuard>
            ),
          },

          {
            path: "orders/:id",
            element: <OrderDetails />,
          },
        ],
      },

      // ========================
      // 404
      // ========================
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
