"use client";


import { useEffect } from "react";
import type { MessageType } from "../../types";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from "react-icons/fa";

interface ToastProps {
  message: MessageType | null;
  onClose?: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (message && onClose) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const styles = {
    success: "bg-green-500/20 border-green-500/30 text-green-100",
    error: "bg-red-500/20 border-red-500/30 text-red-100",
    info: "bg-blue-500/20 border-blue-500/30 text-blue-100",
  };

  const icons = {
    success: <FaCheckCircle className="text-green-300 mr-2" />,
    error: <FaExclamationCircle className="text-red-300 mr-2" />,
    info: <FaInfoCircle className="text-blue-300 mr-2" />,
  };

  return (
    <div className="fixed top-20 right-4 z-50 animate-pulse">
      <div
        className={`px-6 py-4 rounded-xl shadow-2xl backdrop-blur-lg border flex items-center ${
          styles[message.type]
        }`}
        onClick={onClose}
      >
        {icons[message.type]}
        <span>{message.text}</span>
      </div>
    </div>
  );
}
