import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { WishlistProvider } from "./contexts/WishListContext";
import AppRoutes from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WishlistProvider>
            <AppRoutes />

            <Toaster duration={10000} closeButton position="bottom-right" />
          </WishlistProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
