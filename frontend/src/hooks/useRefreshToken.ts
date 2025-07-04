import { apiPrivate } from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

const useRefreshToken = () => {
  const { updateUser } = useAuth();

  const refresh = async () => {
    try {
      const response = await apiPrivate.get("/auth/refresh");

      console.log(response);

      updateUser(response.data.user);
      return response.data.user.accessToken;
    } catch (error) {
      console.error("Refresh token error:", error);
      throw error;
    }
  };

  return refresh;
};

export default useRefreshToken;
