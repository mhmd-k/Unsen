import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { Status } from "../types/common";
import { Col, Alert, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyUserEmail = async () => {
      try {
        setStatus("loading");
        const response = await verifyEmail(token);
        login(response.user);
        setStatus("success");
        // Redirect to home page after 2 seconds
        toast.loading("Redirecting to home page...");
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } catch (error) {
        setStatus("error");
      }
    };

    verifyUserEmail();
  }, []);

  return (
    <Col xs={12} md={8} lg={6}>
      <div className="text-center mb-4">
        <h2 className="fw-bold">Email Verification</h2>
      </div>

      {status === "loading" && (
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <p className="mt-3 text-muted">Verifying your email...</p>
        </div>
      )}

      {status === "success" && (
        <Alert variant="success">
          <Alert.Heading>Success!</Alert.Heading>
          <p className="text-center">
            Your email has been successfully verified.
          </p>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="danger">
          <Alert.Heading>Error!</Alert.Heading>
          <p>
            Failed to verify your email. The verification link might be expired
          </p>
        </Alert>
      )}
    </Col>
  );
}

export default VerifyEmail;
