import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import toast from "react-hot-toast";
import type { AuthContextType, AuthUser } from "@/types";
import { AxiosError } from "axios";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  console.log(user);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axiosPrivate.get("/auth/refresh");
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      const res = await axiosPrivate.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );

      if (res.status === 200) {
        setUser(null);
        toast.success("Successfully logged out");
        navigate("/login");
      }
    } catch (error: unknown) {
      console.error("Logout error:", error);
      toast.error(
        error instanceof AxiosError
          ? error.message
          : "An error occured while logging you out! please try again"
      );
    }
  };

  const updateUser = (userData: AuthUser | null) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
