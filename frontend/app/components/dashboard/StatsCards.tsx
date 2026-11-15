"use client";

import { useAuth } from "../../lib/auth-context";
import type { RevenueData } from "../../types";
import {
  FaParking,
  FaCheckCircle,
  FaCarSide,
  FaMoneyBillWave,
  FaArrowTrendUp,
} from "react-icons/fa6";

interface StatsCardsProps {
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  occupancyRate: number;
  revenue: RevenueData | null;
}

export function StatsCards({
  totalSlots,
  availableSlots,
  occupiedSlots,
  occupancyRate,
  revenue,
}: StatsCardsProps) {
  const { isAdmin } = useAuth();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={<FaParking />}
        label="Total"
        value={totalSlots}
        sublabel="Parking slots"
        color="blue"
      />

      <StatCard
        icon={<FaCheckCircle />}
        label="Available"
        value={availableSlots}
        sublabel="Ready now"
        color="green"
      />

      <StatCard
        icon={<FaCarSide />}
        label="Occupancy"
        value={occupiedSlots}
        sublabel={`${occupancyRate}% filled`}
        color="orange"
      />

      {isAdmin && revenue ? (
        <div className="group rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-500/25 via-fuchsia-500/20 to-slate-900/70 p-5 shadow-xl shadow-violet-900/20 transition hover:-translate-y-0.5 hover:border-violet-300/50">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-2xl text-violet-200 ring-1 ring-violet-300/20">
              <FaMoneyBillWave />
            </div>
            <span className="rounded-full border border-violet-300/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-violet-200">
              Today
            </span>
          </div>
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-3xl font-bold text-white">${revenue.today.toFixed(0)}</div>
              <div className="mt-1 text-sm text-violet-200/80">Revenue</div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-300">
              <FaArrowTrendUp />
              +{Math.max(0, Math.round((revenue.today / Math.max(1, totalSlots)) * 3))}%
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-slate-900/35 p-5 shadow-lg shadow-slate-950/20">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 text-2xl text-sky-200 ring-1 ring-sky-300/10">
              <FaParking />
            </div>
            <span className="rounded-full border border-sky-300/20 bg-sky-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-sky-200">
              KPI
            </span>
          </div>
          <div className="text-3xl font-bold text-white">{occupancyRate}%</div>
          <div className="mt-1 text-sm text-slate-300">Utilization</div>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  sublabel: string;
  color: "blue" | "green" | "orange";
}

function StatCard({ icon, label, value, sublabel, color }: StatCardProps) {
  const colors = {
    blue: {
      bg: "bg-cyan-500/15",
      icon: "text-cyan-200",
      badge: "text-cyan-200",
      value: "text-white",
      border: "border-cyan-400/20",
    },
    green: {
      bg: "bg-emerald-500/15",
      icon: "text-emerald-200",
      badge: "text-emerald-200",
      value: "text-emerald-300",
      border: "border-emerald-400/20",
    },
    orange: {
      bg: "bg-amber-500/15",
      icon: "text-amber-200",
      badge: "text-amber-200",
      value: "text-amber-300",
      border: "border-amber-400/20",
    },
  };

  const c = colors[color];

  return (
    <div className={`rounded-3xl border bg-slate-900/35 p-5 shadow-lg shadow-slate-950/20 ${c.border} transition hover:-translate-y-0.5 hover:border-white/20`}>
      <div className="mb-5 flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${c.bg} text-2xl ${c.icon}`}>
          {icon}
        </div>
        <span className={`text-[11px] font-medium uppercase tracking-[0.2em] ${c.badge}`}>
          {label}
        </span>
      </div>
      <div className={`text-3xl font-bold ${c.value}`}>{value}</div>
      <div className="mt-1 text-sm text-slate-300">{sublabel}</div>
    </div>
  );
}
