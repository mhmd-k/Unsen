import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useLayoutEffect,
} from "react";
import loadingSpinner from "../assets/icons/Infinity-1s-150px (1).svg";
import type { AuthContextType, AuthUser } from "@/types";
import { apiPrivate } from "@/api/axios";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  console.log(user);

  // Check for existing session on mount
  useLayoutEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await apiPrivate.get("/auth/refresh");
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const updateUser = (userData: AuthUser | null) => {
    setUser(userData);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    updateUser,
  };

  if (loading)
    return (
      <div className="flex justify-center">
        <img src={loadingSpinner} alt="loading spinner" />
      </div>
    );

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

// email: testuser_mhmd_k_2000@proton.me
// pass: 123F#Ccs1
