import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="login-signup-bg">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
