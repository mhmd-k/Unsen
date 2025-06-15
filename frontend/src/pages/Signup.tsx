import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { resendVerificationEmail, signup } from "../lib/api";
import { useState } from "react";
import type { SelectOption, SignupData, Status } from "../types";
import { BsCheck } from "react-icons/bs";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { AxiosError } from "axios";

// Define the form data type using Zod schema
const signupSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    confirmPassword: z.string(),
    role: z.enum(["CUSTOMER", "SELLER"]),
    // Seller specific fields
    bankName: z.string().optional(),
    accountHolderName: z.string().optional(),
    accountNumber: z.string().optional(),
    routingNumber: z
      .union([z.string().length(0), z.string().min(9)])
      .optional()
      .transform((e) => (e === "" ? undefined : e)),
  })
  .refine(
    (data) => {
      if (data.role === "SELLER") {
        if (!data.bankName) {
          return false;
        }
        if (!data.accountHolderName) {
          return false;
        }
        if (!data.accountNumber) {
          return false;
        }
        if (!data.routingNumber) {
          return false;
        }
      }
      return true;
    },
    {
      message: "This field is required for sellers",
      path: ["bankName"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "SELLER" && !data.accountHolderName) {
        return false;
      }
      return true;
    },
    {
      message: "Account holder name is required for sellers",
      path: ["accountHolderName"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "SELLER" && !data.accountNumber) {
        return false;
      }
      return true;
    },
    {
      message: "Account number is required for sellers",
      path: ["accountNumber"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "SELLER" && !data.routingNumber) {
        return false;
      }
      return true;
    },
    {
      message: "Routing number is required for sellers",
      path: ["routingNumber"],
    }
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Infer the type from the schema
type SignupFormData = z.infer<typeof signupSchema>;

const bankOptions: SelectOption[] = [
  { label: "Bank of America", value: "BANK_OF_AMERICA" },
  { label: "Chase", value: "CHASE" },
  { label: "Wells Fargo", value: "WELLS_FARGO" },
  { label: "Citibank", value: "CITIBANK" },
  { label: "Capital One", value: "CAPITAL_ONE" },
  { label: "TD Bank", value: "TD_BANK" },
  { label: "PNC Bank", value: "PNC_BANK" },
  { label: "US Bank", value: "US_BANK" },
  { label: "HSBC", value: "HSBC" },
  { label: "Other", value: "OTHER" },
];

const Signup: React.FC = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [resendEmailStatus, setResendEmailStatus] = useState<Status>("idle");
  const [showResendEmailBtn, setShowResendEmailBtn] = useState<boolean>(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  console.log("showResendEmailBtn:", showResendEmailBtn);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "CUSTOMER",
    },
  });

  const onSubmit = async (formData: SignupFormData) => {
    try {
      setStatus("loading");

      // Transform form data to match API SignupData type
      const signupData: SignupData = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.role === "SELLER" && {
          bankName: formData.bankName,
          fullName: formData.accountHolderName,
          accountNumber: formData.accountNumber,
          routingNumber: formData.routingNumber,
        }),
      };

      const response = await signup(signupData);

      if (response.resendEmailOption) {
        setShowResendEmailBtn(true);
        setStatus("error");
        toast.error(response.message);
        return;
      }

      setStatus("success");
      setShowVerifyEmail(true);
    } catch (error: unknown) {
      console.log(error);

      setStatus("error");
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during signup"
      );
    }
  };

  const handleResendEmail = async () => {
    try {
      setResendEmailStatus("loading");

      await resendVerificationEmail(getValues("email"));

      setResendEmailStatus("success");
      setShowVerifyEmail(true);
      toast.success("Check your email");
    } catch (error: unknown) {
      console.log(error);

      setResendEmailStatus("error");
      toast.error(
        error instanceof AxiosError
          ? error.message
          : "An error occurred during resending verification email"
      );
      toast.error(
        error instanceof AxiosError
          ? error.message
          : "An error occurred during resending verification email"
      );
    }
  };

  const role = watch("role");

  return (
    <Card className="w-[400px] max-w-full mx-auto">
      <CardHeader>
        <div className="flex border-b">
          <Button
            asChild
            variant="ghost"
            className="flex-1 rounded-none border-b-2 border-primary"
          >
            <Link to="/signup">SIGN UP</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="flex-1 rounded-none border-b-2 border-transparent hover:border-primary"
          >
            <Link to="/login">LOGIN</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showVerifyEmail ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-center">
              Done <BsCheck className="inline-block" />
            </h1>
            <p className="text-center text-muted-foreground">
              Check your email, a verification link has been sent to it.
            </p>
            <p className="text-center">
              Didn't receive an email?{" "}
              <Button
                variant="link"
                onClick={handleResendEmail}
                disabled={resendEmailStatus === "loading"}
                className="p-0"
              >
                {resendEmailStatus === "loading" ? (
                  <>
                    Resending email{" "}
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Resend email"
                )}
              </Button>
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Username</Label>
                <Input
                  id="name"
                  type="text"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className={errors.password ? "border-red-500" : ""}
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
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <RadioGroup
                  defaultValue="CUSTOMER"
                  onValueChange={(value) =>
                    setValue("role", value as "CUSTOMER" | "SELLER")
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="CUSTOMER" id="customer" />
                    <Label htmlFor="customer">Customer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="SELLER" id="seller" />
                    <Label htmlFor="seller">Seller</Label>
                  </div>
                </RadioGroup>
              </div>

              {role === "SELLER" && (
                <div className="space-y-4 border-t pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Select
                      onValueChange={(value) => setValue("bankName", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {bankOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value.toString()}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.bankName && (
                      <p className="text-sm text-red-500">
                        {errors.bankName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName">
                      Account Holder Name
                    </Label>
                    <Input
                      id="accountHolderName"
                      type="text"
                      {...register("accountHolderName")}
                      className={
                        errors.accountHolderName ? "border-red-500" : ""
                      }
                    />
                    {errors.accountHolderName && (
                      <p className="text-sm text-red-500">
                        {errors.accountHolderName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      type="text"
                      {...register("accountNumber")}
                      className={errors.accountNumber ? "border-red-500" : ""}
                    />
                    {errors.accountNumber && (
                      <p className="text-sm text-red-500">
                        {errors.accountNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input
                      id="routingNumber"
                      type="text"
                      {...register("routingNumber")}
                      className={errors.routingNumber ? "border-red-500" : ""}
                    />
                    {errors.routingNumber && (
                      <p className="text-sm text-red-500">
                        {errors.routingNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button asChild variant="link" className="p-0">
            <Link to="/login">Login</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default Signup;
