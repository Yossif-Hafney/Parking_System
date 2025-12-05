"use client";

// ============================================
// Card Component - Container with styling
// ============================================

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 ${
        hover ? "hover:bg-white/15 transition-all duration-200" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  icon: string;
  title: string;
  action?: ReactNode;
}

export function CardHeader({ icon, title, action }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-xl">
          {icon}
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {action}
    </div>
  );
}
