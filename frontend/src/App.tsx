import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import CartProvider from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishListContext";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppRoutes />

            <Toaster
              toastOptions={{
                duration: 6000,
              }}
            />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
