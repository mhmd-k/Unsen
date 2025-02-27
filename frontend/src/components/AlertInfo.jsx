import { Alert } from "react-bootstrap";
import { useAlertContext } from "../context/AlertContext";

function AlertInfo() {
  const { message, isOpen, type, onClose } = useAlertContext();

  return (
    <Alert variant={type} show={isOpen} dismissible onClose={onClose}>
      {message}
    </Alert>
  );
}

export default AlertInfo;
