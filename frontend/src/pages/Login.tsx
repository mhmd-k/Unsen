import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, Button, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Status } from "../types";
import { login } from "../lib/api";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

// Define the form data type using Zod schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Infer the type from the schema
type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { updateUser } = useAuth();
  const naviagte = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData: LoginFormData) => {
    try {
      setStatus("loading");
      setErrorMessage(null);

      const toastId = toast.loading("Logging in...");

      const res = await login(formData);

      updateUser(res.user);

      toast.success("Successfuly Logged in", { id: toastId });
      setStatus("success");

      // Redirect will be handled by the auth context
      naviagte("/");
    } catch (error: any) {
      console.log(error);
      setStatus("error");
      setErrorMessage(error.message || "An error occurred during login");
    }
  };

  return (
    <Col md={8} lg={6}>
      <Card className="shadow">
        <Card.Body className="p-4">
          <Row className="mb-4 border-bottom">
            <Col className="text-center p-0">
              <Link to="/signup" className="auth-link pb-2">
                SIGN UP
              </Link>
            </Col>
            <Col className="text-center p-0">
              <Link to="/login" className="active auth-link pb-2">
                LOGIN
              </Link>
            </Col>
          </Row>
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

            {status === "error" && errorMessage && (
              <Alert variant="danger" className="mb-3">
                {errorMessage}
              </Alert>
            )}

            <Link
              to="/forgot-password"
              className="text-primary text-decoration-underline"
            >
              Forgot your password?
            </Link>

            <Button
              variant="primary"
              type="submit"
              className="w-100 my-3"
              style={{
                background: "var(--main-color)",
              }}
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <Spinner animation="border" role="status" />
              ) : (
                "Login"
              )}
            </Button>

            <p className="text-center m-0">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary text-decoration-underline"
              >
                Sign Up
              </Link>
            </p>
          </Form>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default Login;
