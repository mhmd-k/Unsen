import { Outlet } from "react-router-dom";
import Appbar from "./Appbar";
import Footer from "./Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Alert } from "@/components/ui/alert";

function Layout() {
  const { user, isAuthenticated } = useAuth();

  return (
    <>
      <Appbar />
      <main>
        {user && !isAuthenticated && (
          <Alert>
            You can&apos;t place an order or sell an item until you verify your
            email!
          </Alert>
        )}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
