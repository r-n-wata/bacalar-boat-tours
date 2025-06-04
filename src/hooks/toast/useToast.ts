import { useState } from "react";

export function useToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error" | "info">("info");

  const showToast = (
    msg: string,
    toastType: "success" | "error" | "info" = "info"
  ) => {
    setMessage(msg);
    setType(toastType);
    setIsVisible(true);
  };

  const hideToast = () => setIsVisible(false);

  return {
    isVisible,
    message,
    type,
    showToast,
    hideToast,
  };
}
