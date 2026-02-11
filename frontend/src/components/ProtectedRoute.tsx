import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import spinner from "../assets/icons/Infinity-1s-150px (1).svg";

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <img src={spinner} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
