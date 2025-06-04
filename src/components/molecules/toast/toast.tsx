"use client";

import React from "react";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  isVisible: boolean;
}

const toastColors = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

export default function Toast({
  message,
  type = "info",
  onClose,
  isVisible,
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className={`fixed top-5 right-5 z-50 px-4 py-2 text-white rounded shadow-lg ${toastColors[type]}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
