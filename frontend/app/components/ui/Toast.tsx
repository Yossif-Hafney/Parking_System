"use client";

// ============================================
// Toast Component - Notification Messages
// ============================================

import { useEffect } from "react";
import type { MessageType } from "../../types";

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

  return (
    <div className="fixed top-20 right-4 z-50 animate-pulse">
      <div
        className={`px-6 py-4 rounded-xl shadow-2xl backdrop-blur-lg border ${
          styles[message.type]
        }`}
        onClick={onClose}
      >
        {message.text}
      </div>
    </div>
  );
}
