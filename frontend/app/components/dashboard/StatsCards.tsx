"use client";

// ============================================
// Stats Cards Component
// ============================================

import { useAuth } from "../../lib/auth-context";
import type { RevenueData } from "../../types";

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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Slots */}
      <StatCard
        icon="🅿️"
        label="Total"
        value={totalSlots}
        sublabel="Parking Slots"
        color="blue"
      />

      {/* Available */}
      <StatCard
        icon="✅"
        label="Free"
        value={availableSlots}
        sublabel="Available Now"
        color="green"
      />

      {/* Occupied */}
      <StatCard
        icon="🚙"
        label={`${occupancyRate}%`}
        value={occupiedSlots}
        sublabel="Occupied"
        color="orange"
      />

      {/* Revenue (Admin only) */}
      {isAdmin && revenue && (
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center text-2xl">
              💰
            </div>
            <span className="text-purple-300 text-sm">Today</span>
          </div>
          <div className="text-4xl font-bold text-purple-300">
            ${revenue.today.toFixed(0)}
          </div>
          <div className="text-purple-400 text-sm mt-1">Revenue</div>
        </div>
      )}
    </div>
  );
}

// Individual stat card
interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  sublabel: string;
  color: "blue" | "green" | "orange";
}

function StatCard({ icon, label, value, sublabel, color }: StatCardProps) {
  const colors = {
    blue: {
      bg: "bg-blue-500/20",
      text: "text-blue-300",
      value: "text-white",
    },
    green: {
      bg: "bg-green-500/20",
      text: "text-green-300",
      value: "text-green-400",
    },
    orange: {
      bg: "bg-orange-500/20",
      text: "text-orange-300",
      value: "text-orange-400",
    },
  };

  const c = colors[color];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center text-2xl`}
        >
          {icon}
        </div>
        <span className={`${c.text} text-sm`}>{label}</span>
      </div>
      <div className={`text-4xl font-bold ${c.value}`}>{value}</div>
      <div className={`${c.text} text-sm mt-1`}>{sublabel}</div>
    </div>
  );
}
