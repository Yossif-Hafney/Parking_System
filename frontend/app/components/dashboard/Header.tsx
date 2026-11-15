"use client";

import { useAuth } from "../../lib/auth-context";
import { FaCarSide, FaCrown, FaUser, FaShieldAlt } from "react-icons/fa";

export function Header() {
  const { username, isAdmin, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/55 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 text-2xl text-white shadow-lg shadow-blue-500/25">
            <FaCarSide />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/80">
              Parking control
            </p>
            <h1 className="text-xl font-bold text-white">Parking System</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 sm:flex sm:items-center sm:gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
            Live proccessing
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right shadow-lg shadow-slate-950/20">
            <p className="text-sm font-semibold text-white">{username}</p>
            <p className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-sky-200">
              {isAdmin ? <FaCrown className="text-xs" /> : <FaUser className="text-xs" />}
              {isAdmin ? "Administrator" : "Operator"}
            </p>
          </div>

          <button
            onClick={logout}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-200 transition hover:border-red-300/60 hover:bg-red-500/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaShieldAlt className="text-xs" />
            {isLoading ? "Signing out..." : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
}
