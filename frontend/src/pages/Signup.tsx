import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { resendVerificationEmail, signup } from "../lib/api";
import { useState } from "react";
import type { SignupData, Status } from "../types";
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
import { bankOptions } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
    gender: z.enum(["MALE", "FEMALE"]),
    // Seller specific fields
    bankName: z.string().optional(),
    accountHolderName: z.string().optional(),
    accountNumber: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true;
        return /^\d{8,17}$/.test(val);
      }, "Account number must be between 8-17 digits"),
    routingNumber: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true;
        if (!/^\d{9}$/.test(val)) return false;

        // ABA routing number validation algorithm
        const digits = val.split("").map(Number);
        const checksum = digits.reduce((acc, digit, idx) => {
          const weight = [3, 7, 1, 3, 7, 1, 3, 7, 1][idx];
          return acc + digit * weight;
        }, 0);

        return checksum % 10 === 0;
      }, "Invalid routing number. Must be a valid 9-digit ABA routing number"),
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

const Signup: React.FC = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [resendEmailStatus, setResendEmailStatus] = useState<Status>("idle");
  const [showResendEmailBtn, setShowResendEmailBtn] = useState<boolean>(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  console.log("showResendEmailBtn:", showResendEmailBtn);

  const form = useForm<SignupFormData>({
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

      await resendVerificationEmail(form.getValues("email"));

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

  const role = form.watch("role");

  return (
    <Card className="w-[500px] max-w-full mx-auto">
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
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

              <FormField
                control={form.control}
                name="gender"
                defaultValue="MALE"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex"
                      >
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="MALE" />
                          </FormControl>
                          <FormLabel className="font-normal">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="FEMALE" />
                          </FormControl>
                          <FormLabel className="font-normal">Female</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                defaultValue="CUSTOMER"
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex"
                      >
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="CUSTOMER" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Customer
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <RadioGroupItem value="SELLER" />
                          </FormControl>
                          <FormLabel className="font-normal">Seller</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {role === "SELLER" && (
                <div className="space-y-4 border-t pt-4">
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a bank" />
                            </SelectTrigger>
                          </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountHolderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Holder Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="routingNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Routing Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
          </Form>
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
