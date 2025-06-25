import { useAuth } from "@/contexts/AuthContext";
import type { Role } from "@/types";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface RoleGuardProps {
  requiredRoles: Role[];
  children: ReactNode;
}

export const RoleGuard = ({ requiredRoles, children }: RoleGuardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role && !requiredRoles.includes(user.role)) {
    navigate(-1); // back to the previos page
    return null;
  }

  return children;
};
