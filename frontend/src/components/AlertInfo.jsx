import { Alert } from "react-bootstrap";
import { useAlertContext } from "../contexts/AlertContext";

function AlertInfo() {
  const { message, isOpen, type, onClose } = useAlertContext();

  return (
    <Alert
      className="global-alert"
      variant={type}
      show={isOpen}
      dismissible
      onClose={onClose}
    >
      {message}
    </Alert>
  );
}

export default AlertInfo;
