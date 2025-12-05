"use client";

// ============================================
// Loading Spinner Component
// ============================================

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function Spinner({ size = "md", text }: SpinnerProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizes[size]} border-2 border-white/20 border-t-blue-500 rounded-full animate-spin`}
      />
      {text && <p className="text-blue-300 text-sm">{text}</p>}
    </div>
  );
}

// Full page loading state
export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-6 animate-bounce">🚗</div>
        <Spinner size="lg" text="Loading..." />
      </div>
    </div>
  );
}
