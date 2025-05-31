import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AlertProvider } from "./contexts/AlertContext";
import CartProvider from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishListContext";
import AppRoutes from "./routes";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AlertProvider>
          <CartProvider>
            <WishlistProvider>
              <AppRoutes />
            </WishlistProvider>
          </CartProvider>
        </AlertProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
