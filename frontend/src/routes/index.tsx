import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Layout from "../components/Layout";
import Shop from "../pages/Shop";
import Wishlist from "../pages/Wishlist";
import ProductDetail from "../pages/ProductDetail";
import ErrorElement from "../components/ErrorElement";
import Signup from "../pages/Signup";
import VerifyEmail from "../pages/VerifyEmail";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="shop/:id" element={<ProductDetail />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="*" element={<ErrorElement />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
