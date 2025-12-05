"use client";

// ============================================
// Header Component
// ============================================

import { useAuth } from "../../lib/auth-context";

export function Header() {
  const { username, isAdmin, logout, isLoading } = useAuth();

  return (
    <header className="bg-white/10 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
            🚗
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Parking System</h1>
            <p className="text-xs text-blue-300">Management Dashboard</p>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-white font-medium">{username}</p>
            <p className="text-xs text-blue-300">
              {isAdmin ? "👑 Administrator" : "👤 Operator"}
            </p>
          </div>
          <button
            onClick={logout}
            disabled={isLoading}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 border border-red-500/30 disabled:opacity-50"
          >
            {isLoading ? "..." : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
}
