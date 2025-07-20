import { useAuth } from "@/contexts/AuthContext";
import type { Role } from "@/types";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface RoleGuardProps {
  requiredRoles: Role[];
  children: ReactNode;
}

export const RoleGuard = ({ requiredRoles, children }: RoleGuardProps) => {
  const { user } = useAuth();

  if (user?.role && !requiredRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
