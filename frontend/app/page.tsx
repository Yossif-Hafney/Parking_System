"use client";

import { ProtectedRoute } from "./components/auth";
import { Dashboard } from "./components/dashboard";

export default function Home() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
