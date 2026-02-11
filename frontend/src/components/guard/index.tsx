import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface RoleGuardProps {
  requiredRoles: Role[];
  children: ReactNode;
}

export const RolePageGuard = ({ requiredRoles, children }: RoleGuardProps) => {
  const { user } = useAuth();

  if (user?.role && !requiredRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const RoleComponentGuard = ({ requiredRoles, children }: RoleGuardProps) => {
  const { user } = useAuth();

  if (user?.role && !requiredRoles.includes(user.role)) {
    return null;
  }

  return children;
}; 