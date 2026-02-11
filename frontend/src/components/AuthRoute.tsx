import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import loadingSpinner from "../assets/icons/Infinity-1s-150px (1).svg";

export const AuthRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center">
        <img src={loadingSpinner} alt="loading spinner" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
