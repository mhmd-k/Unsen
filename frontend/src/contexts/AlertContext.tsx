import {
  useState,
  useContext,
  createContext,
  useEffect,
  ReactNode,
} from "react";

type AlertState = {
  isOpen: boolean;
  type: string;
  message: string;
};

type AlertContextType = AlertState & {
  onOpen: (type: string, message: string) => void;
  onClose: () => void;
};

const AlertContext = createContext<AlertContextType>({
  isOpen: false,
  type: "",
  message: "",
  onOpen: () => {},
  onClose: () => {},
});

export function AlertProvider({ children }: { children: ReactNode }) {
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

  const onOpen = (type: string, message: string) => {
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
