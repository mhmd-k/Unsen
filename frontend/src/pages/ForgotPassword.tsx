import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2 } from "lucide-react";
import { AxiosError } from "axios";
import { requestPasswordReset } from "@/lib/api";
import { toast } from "sonner";

// Define the form data type using Zod schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Infer the type from the schema
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordFormData) => {
    try {
      await requestPasswordReset(values.email);

      toast.success(
        "If an account exists with this email, you will receive a password reset link.",
      );
    } catch (error: unknown) {
      console.error(error);
      toast.error(
        error instanceof AxiosError
          ? error.message
          : "An error occurred while requesting password reset",
      );
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4">
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
            <p className="text-center text-muted-foreground">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
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

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <div className="text-center">
                <Button asChild variant="link">
                  <Link to="/login">
                    <BsArrowLeft className="mr-2 inline-block" /> Back to Login
                  </Link>
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
