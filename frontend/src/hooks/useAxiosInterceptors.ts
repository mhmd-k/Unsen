import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { axiosPrivate } from "../api/axios";

export const useAxiosInterceptors = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  useEffect(() => {
    const interceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Clear the user from context
          updateUser(null);
          // Navigate to login page
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axiosPrivate.interceptors.response.eject(interceptor);
    };
  }, [navigate, updateUser]);
};
