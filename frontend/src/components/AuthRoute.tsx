import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinnerInfinity from "./LoadingSpinnerInfinity";

export const AuthRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinnerInfinity />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
