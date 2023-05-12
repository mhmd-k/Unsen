import { useState, useContext, createContext, useEffect } from "react";

const AlertContext = createContext(undefined);

export default function AlertProvider({ children }) {
  const [state, setState] = useState({
    isOpen: false,
    type: "info",
    message: "",
  });

  useEffect(() => {
    const timeId = setTimeout(() => {
      setState({
        isOpen: false,
        type: "info",
        message: "",
      });
    }, 4000);

    return () => clearTimeout(timeId);
  }, [state]);

  const onOpen = (type, message) => {
    setState({
      isOpen: true,
      type,
      message,
    });
  };

  function onClose() {
    setState({
      isOpen: false,
      type: "",
      message: "",
    });
  }

  return (
    <AlertContext.Provider
      value={{
        ...state,
        onOpen,
        onClose,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export function useAlertContext() {
  return useContext(AlertContext);
}
