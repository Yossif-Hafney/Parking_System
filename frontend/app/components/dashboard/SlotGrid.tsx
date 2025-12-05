"use client";

// ============================================
// Parking Slot Grid Component
// ============================================

import type { SlotStatus } from "../../types";

interface SlotGridProps {
  slots: SlotStatus[];
  loading: boolean;
  onSlotClick: (slot: SlotStatus) => void;
  onRefresh: () => void;
}

export function SlotGrid({
  slots,
  loading,
  onSlotClick,
  onRefresh,
}: SlotGridProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">🅿️ Parking Slots</h2>
        <button
          onClick={onRefresh}
          className="text-blue-300 hover:text-white transition-colors flex items-center gap-2"
          disabled={loading}
        >
          {loading ? "⏳" : "🔄"} Refresh
        </button>
      </div>

      {/* Grid */}
      {loading && slots.length === 0 ? (
        <div className="text-center py-12 text-blue-300">
          <div className="text-4xl mb-4 animate-pulse">🚗</div>
          Loading slots...
        </div>
      ) : (
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
          {slots.map((slot, idx) => (
            <SlotCard
              key={
                slot.slotNumber !== undefined && slot.slotNumber !== null
                  ? String(slot.slotNumber)
                  : `slot-idx-${idx}`
              }
              slot={slot}
              onClick={() => onSlotClick(slot)}
            />
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-6 mt-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-green-500/50 to-emerald-600/50 border border-green-500/50" />
          <span className="text-green-300 text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-red-500/50 to-orange-600/50 border border-red-500/50" />
          <span className="text-red-300 text-sm">
            Occupied (click for details)
          </span>
        </div>
      </div>
    </div>
  );
}

// Individual slot card
interface SlotCardProps {
  slot: SlotStatus;
  onClick: () => void;
}

function SlotCard({ slot, onClick }: SlotCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-2xl hover:z-10 ${
        slot.available
          ? "bg-gradient-to-br from-green-500/30 to-emerald-600/30 border-2 border-green-500/50 hover:border-green-400 hover:from-green-500/50 hover:to-emerald-600/50"
          : "bg-gradient-to-br from-red-500/30 to-orange-600/30 border-2 border-red-500/50 hover:border-red-400 hover:from-red-500/50 hover:to-orange-600/50"
      }`}
      title={`Slot ${slot.slotNumber} - Click for details`}
    >
      {/* Slot Number Badge */}
      <div
        className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg ${
          slot.available ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}
      >
        {slot.slotNumber}
      </div>

      {/* Icon */}
      <div
        className={`text-2xl mb-1 ${
          slot.available ? "opacity-50" : "animate-pulse"
        }`}
      >
        {slot.available ? "🅿️" : "🚗"}
      </div>

      {/* Info */}
      {!slot.available && slot.plateNumber && (
        <div className="text-[9px] text-red-200 truncate w-full text-center px-1 font-mono font-bold">
          {slot.plateNumber}
        </div>
      )}
      {slot.available && (
        <div className="text-[10px] text-green-300 font-medium">FREE</div>
      )}
    </div>
  );
}
