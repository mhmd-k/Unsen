import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Shop from "./pages/Shop";
import Wishlist from "./pages/Wishlist";
import AlertProvider from "./context/AlertContext";
import CartProvider from "./context/cartContext";
import WishlistProvider from "./context/WishlistContext";
import AlertInfo from "./components/AlertInfo";
import ProductDetail from "./pages/ProductDetail";
import ErrorElement from "./components/ErrorElement";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "shop/:id",
        element: <ProductDetail />,
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
      {
        path: "*",
        element: <ErrorElement />,
      },
    ],
  },
]);

function App() {
  return (
    <AlertProvider>
      <CartProvider>
        <WishlistProvider>
          <AlertInfo />
          <RouterProvider router={router} />
        </WishlistProvider>
      </CartProvider>
    </AlertProvider>
  );
}

export default App;
