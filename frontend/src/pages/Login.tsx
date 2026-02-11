import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Status } from "../types";
import { login } from "../lib/api";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the form data type using Zod schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Infer the type from the schema
type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
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
      navigate("/", { replace: true });
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="example_user@mail.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button asChild variant="link" className="p-0">
              <Link to="/forgot-password" className='underline!'>Forgot your password?</Link>
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
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Button asChild variant="link" className="p-0">
            <Link to="/signup" className='underline!'>Sign Up</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default Login;
