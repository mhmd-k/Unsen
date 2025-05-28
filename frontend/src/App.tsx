import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AlertProvider } from "./contexts/AlertContext";
import CartProvider from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishListContext";
import AlertInfo from "./components/AlertInfo";
import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AlertProvider>
          <CartProvider>
            <WishlistProvider>
              <AlertInfo />
              <AppRoutes />

              <Toaster
                toastOptions={{
                  duration: 6000,
                }}
              />
            </WishlistProvider>
          </CartProvider>
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
