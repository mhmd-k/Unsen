import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, Button, Col, Card, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Status } from "../types";
import { BsArrowLeft, BsCheck } from "react-icons/bs";

// Define the form data type using Zod schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Infer the type from the schema
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (formData: ForgotPasswordFormData) => {
    try {
      setStatus("loading");
      setErrorMessage(null);

      // TODO: make api call

      setStatus("success");
      setShowSuccess(true);
    } catch (error: any) {
      console.log(error);
      setStatus("error");
      setErrorMessage(
        error.message || "An error occurred while requesting password reset"
      );
    }
  };

  return (
    <Col md={8} lg={6}>
      <Card className="shadow">
        <Card.Body className="p-4">
          <Alert variant="warning">This feature doesn't work yet</Alert>

          {showSuccess ? (
            <>
              <h1 className="text-center">
                Done <BsCheck />
              </h1>
              <p className="text-center">
                If an account exists with this email, you will receive a
                password reset link.
              </p>
              <div className="text-center">
                <Link
                  to="/login"
                  className="text-primary text-decoration-underline"
                >
                  Back to Login
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-center mb-4">Forgot Password</h2>
              <p className="text-center mb-4">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
              <Form onSubmit={handleSubmit(onSubmit)}>
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

                {status === "error" && errorMessage && (
                  <Alert variant="danger" className="mb-3">
                    {errorMessage}
                  </Alert>
                )}

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  style={{
                    background: "var(--main-color)",
                  }}
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <Spinner animation="border" role="status" />
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <div className="text-center m-0">
                  <Link
                    to="/login"
                    className="text-primary text-decoration-underline"
                  >
                    <BsArrowLeft className="me-2" /> Back to Login
                  </Link>
                </div>
              </Form>
            </>
          )}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ForgotPassword;
