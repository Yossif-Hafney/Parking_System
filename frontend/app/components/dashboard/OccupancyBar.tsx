"use client";

// ============================================
// Occupancy Bar Component
// ============================================

interface OccupancyBarProps {
  occupancyRate: number;
}

export function OccupancyBar({ occupancyRate }: OccupancyBarProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-semibold">Occupancy Rate</h3>
        <span className="text-blue-300">{occupancyRate}%</span>
      </div>
      <div className="h-4 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-500"
          style={{ width: `${occupancyRate}%` }}
        />
      </div>
    </div>
  );
}
