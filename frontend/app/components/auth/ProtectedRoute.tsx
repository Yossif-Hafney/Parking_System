"use client";

// ============================================
// Protected Route Component
// ============================================

import { ReactNode } from "react";
import { useAuth } from "../../lib/auth-context";
import { LoginForm } from "./LoginForm";
import { LoadingScreen } from "../ui/Spinner";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { isLoggedIn, isLoading, isAdmin } = useAuth();

  // Show loading screen while checking auth
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Not logged in - show login form
  if (!isLoggedIn) {
    return <LoginForm />;
  }

  // Requires admin but user is not admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-blue-300">
            You need admin privileges to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
