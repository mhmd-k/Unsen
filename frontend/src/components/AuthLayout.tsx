import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinnerInfinity from "./LoadingSpinnerInfinity";

function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinnerInfinity />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-signup-bg">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
