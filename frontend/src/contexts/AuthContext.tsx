import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthContextType, AuthUser } from "../types";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
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
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await axiosPrivate.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
      setUser(null);
      toast.success("Successfully logged out");
      navigate("/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(
        error?.message ||
          "An error occured while logging you out! please try again"
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
