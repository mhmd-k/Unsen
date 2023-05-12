import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import loader from "../assets/icons/Infinity-1s-150px (1).svg";

function Layout() {
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, [pathname]);

  return (
    <>
      <Header />
      <main>
        {isLoading ? (
          <div className="loader" style={{ height: "60vh" }}>
            <img src={loader} alt="" style={{ width: "100px" }} />
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
    </>
  );
}

export default Layout;
