import axios, { AxiosError } from "axios";
import {
  type SignupData,
  type SignupResponse,
  type LoginData,
  type LoginResponse,
  type VerifyEmailResponse,
  type ApiError,
  type createProductRequestPayload,
} from "@/types";
import { api, apiPrivate } from "../api/axios";

// Error handler for axios requests
function handleAxiosError(error: unknown): never {
  console.log(error);

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(axiosError.response.data.message || "An error occurred");
    } else if (axiosError.request) {
      // The request was made but no response was received
      throw new Error("No response received from server");
    }
  }
  // Handle any other errors
  throw new Error("An unexpected error occurred");
}

export async function signup(data: SignupData): Promise<SignupResponse> {
  try {
    const response = await api.post<SignupResponse>("/auth/signup", data);
    return response.data;
  } catch (error: unknown) {
    if (
      error instanceof AxiosError &&
      error.response?.status === 409 &&
      error.response?.data?.resendEmailOption
    ) {
      // If user exists but not verified, return the response with resendEmailOption
      return {
        ...error.response.data,
        userId: error.response.data.userId || 0,
        email: error.response.data.email || data.email,
      };
    }

    handleAxiosError(error);
  }
}

export async function login(data: LoginData): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>("/auth/login", data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function verifyEmail(token: string): Promise<VerifyEmailResponse> {
  try {
    const response = await api.post<VerifyEmailResponse>(
      "/auth/verify-email",
      {
        token,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function resendVerificationEmail(
  email: string
): Promise<{ message: string; email: string }> {
  try {
    const response = await api.post<{ message: string; email: string }>(
      "/auth/resend-verification",
      { email }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  token: string | undefined,
  userId: number | undefined
): Promise<void> {
  try {
    await apiPrivate.post(
      "/auth/change-password",
      {
        currentPassword,
        newPassword,
        userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function createProduct(
  data: createProductRequestPayload
): Promise<SignupResponse> {
  try {
    const response = await api.post("/products/create", data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}
