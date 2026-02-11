import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import type { Status } from "../types/common";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Loader2 } from "lucide-react";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();
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
        updateUser(response.user);
        toast.success("Email verified successfuly");
        setStatus("success");
        navigate("/");
      } catch (error: unknown) {
        setStatus("error");
        toast.error(
          error instanceof Error
            ? error.message
            : "An error occured during verifying your email!"
        );
      }
    };

    verifyUserEmail();
  }, [navigate, searchParams, updateUser]);

  return (
    <div className="container max-w-2xl mx-auto px-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Email Verification</h2>
      </div>

      {status === "loading" && (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="mt-3 text-muted-foreground">Verifying your email...</p>
        </div>
      )}

      {status === "success" && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <AlertTitle className="text-green-800">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your email has been successfully verified.
          </AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            Failed to verify your email. The verification link might be expired
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default VerifyEmail;
