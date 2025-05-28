import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../contexts/AuthContext";
import { Alert } from "react-bootstrap";

function Layout() {
  const { user, isAuthenticated } = useAuth();

  return (
    <>
      <Header />
      <main>
        {user && !isAuthenticated && (
          <Alert variant="warning">
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
