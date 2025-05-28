import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { resendVerificationEmail, signup } from "../lib/api";
import { useState } from "react";
import { SelectOption, SignupData, Status } from "../types";
import Footer from "../components/Footer";
import { BsCheck } from "react-icons/bs";
import toast from "react-hot-toast";

// Define the form data type using Zod schema
const signupSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showResendEmailBtn, setShowResendEmailBtn] = useState<boolean>(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "CUSTOMER",
    },
  });

  const onSubmit = async (formData: SignupFormData) => {
    try {
      setStatus("loading");
      setErrorMessage(null);

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
        setErrorMessage(response.message);
        return;
      }

      setStatus("success");
      setShowVerifyEmail(true);
    } catch (error: any) {
      console.log(error);

      setStatus("error");
      setErrorMessage(error.message || "An error occurred during signup");
    }
  };

  const handleResendEmail = async () => {
    try {
      setResendEmailStatus("loading");

      await resendVerificationEmail(getValues("email"));

      setResendEmailStatus("success");
      setShowVerifyEmail(true);
      toast.success("Check your email");
    } catch (error: any) {
      console.log(error);

      setResendEmailStatus("error");
      toast.error(
        error.message || "An error occurred during resending verification email"
      );
      setErrorMessage(
        error.message || "An error occurred during resending verification email"
      );
    }
  };

  const role = watch("role");

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100dvh" }}>
      <div className="signup-bg d-flex align-items-center">
        <Container className="py-4">
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="shadow">
                {showVerifyEmail ? (
                  <Card.Body className="p-4">
                    <h1 className="text-center">
                      Done <BsCheck />
                    </h1>
                    <p>
                      Check your email, a verification link has been sent to it.
                    </p>
                    <p>
                      Didn't recive an email?{" "}
                      <Button
                        variant="link"
                        onClick={handleResendEmail}
                        disabled={resendEmailStatus === "loading"}
                      >
                        {resendEmailStatus === "loading"
                          ? "Resending email..."
                          : "Resend email"}
                      </Button>
                    </p>
                  </Card.Body>
                ) : (
                  <Card.Body className="p-4">
                    <h1 className="mb-4 fs-1">Sign Up</h1>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          {...register("name")}
                          isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name?.message}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          {...register("email")}
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email?.message}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          {...register("password")}
                          isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password?.message}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          {...register("confirmPassword")}
                          isInvalid={!!errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword?.message}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>I want to sign up as a:</Form.Label>
                        <div>
                          <Form.Check
                            type="radio"
                            label="Customer"
                            value="CUSTOMER"
                            {...register("role")}
                            inline
                          />
                          <Form.Check
                            type="radio"
                            label="Seller"
                            value="SELLER"
                            {...register("role")}
                            inline
                          />
                        </div>
                      </Form.Group>

                      {role === "SELLER" && (
                        <>
                          <Alert variant="warning">
                            Enter any fake info u want, this project is just to
                            show case that I am able to build a functional
                            e-commerce application
                          </Alert>

                          <Form.Group className="mb-3" controlId="">
                            <Form.Label>Bank Name</Form.Label>
                            <Form.Control
                              as="select"
                              {...register("bankName")}
                              isInvalid={!!errors.bankName}
                            >
                              <option value="">Select a bank</option>
                              {bankOptions.map((bank) => (
                                <option key={bank.value} value={bank.value}>
                                  {bank.label}
                                </option>
                              ))}
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                              {errors.bankName?.message}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Account Holder Name</Form.Label>
                            <Form.Control
                              type="text"
                              {...register("accountHolderName")}
                              isInvalid={!!errors.accountHolderName}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.accountHolderName?.message}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Account Number</Form.Label>
                            <Form.Control
                              type="text"
                              {...register("accountNumber")}
                              isInvalid={!!errors.accountNumber}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.accountNumber?.message}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Routing Number</Form.Label>
                            <Form.Control
                              type="text"
                              {...register("routingNumber")}
                              isInvalid={!!errors.routingNumber}
                              maxLength={9}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.routingNumber?.message}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </>
                      )}

                      {status === "error" && errorMessage && (
                        <Alert variant="danger" className="mb-3">
                          {errorMessage}{" "}
                          {showResendEmailBtn && (
                            <Button
                              variant="link"
                              onClick={handleResendEmail}
                              disabled={resendEmailStatus === "loading"}
                            >
                              {resendEmailStatus === "loading"
                                ? "Resending email..."
                                : "Resend email"}
                            </Button>
                          )}
                        </Alert>
                      )}

                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100"
                        style={{
                          background: "var(--main-color)",
                        }}
                        disabled={status === "loading"}
                      >
                        {status === "loading" ? "Signing up..." : "Sign Up"}
                      </Button>

                      <p className="text-center">
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          className="text-primary text-decoration-underline"
                        >
                          Login
                        </Link>
                      </p>
                    </Form>
                  </Card.Body>
                )}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
