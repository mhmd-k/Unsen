import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Status } from "../types";
import { login } from "../lib/api";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2 } from "lucide-react";

// Define the form data type using Zod schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Infer the type from the schema
type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [status, setStatus] = useState<Status>("idle");

  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData: LoginFormData) => {
    const toastId = toast.loading("Logging in...");

    try {
      setStatus("loading");

      const res = await login(formData);

      updateUser(res.user);

      toast.success("Successfully Logged in", { id: toastId });
      setStatus("success");

      // Redirect will be handled by the auth context
      navigate("/");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during login",
        {
          id: toastId,
        }
      );
      setStatus("error");
    }
  };

  return (
    <Card className="w-[400px] max-w-full mx-auto">
      <CardHeader>
        <div className="flex border-b">
          <Button
            asChild
            variant="ghost"
            className="flex-1 rounded-none border-b-2 border-transparent hover:border-primary"
          >
            <Link to="/signup">SIGN UP</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="flex-1 rounded-none border-b-2 border-primary"
          >
            <Link to="/login">LOGIN</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button asChild variant="link" className="p-0">
            <Link to="/forgot-password">Forgot your password?</Link>
          </Button>

          <Button
            type="submit"
            className="w-full"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Button asChild variant="link" className="p-0">
            <Link to="/signup">Sign Up</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default Login;
