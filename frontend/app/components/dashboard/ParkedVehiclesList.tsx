"use client";

// ============================================
// Parked Vehicles List Component
// ============================================

import { Card } from "../ui/Card";
import type { SlotStatus } from "../../types";

interface ParkedVehiclesListProps {
  slots: SlotStatus[];
  onSelectPlate: (plate: string) => void;
}

export function ParkedVehiclesList({
  slots,
  onSelectPlate,
}: ParkedVehiclesListProps) {
  const occupiedSlots = slots.filter((s) => !s.available);

  return (
    <Card>
      <h3 className="text-white font-semibold mb-4">
        🚙 Currently Parked ({occupiedSlots.length})
      </h3>

      <div className="max-h-48 overflow-y-auto space-y-2">
        {occupiedSlots.map((slot, idx) => (
          <div
            key={
              slot.slotNumber !== undefined && slot.slotNumber !== null
                ? String(slot.slotNumber)
                : `slot-idx-${idx}`
            }
            onClick={() => slot.plateNumber && onSelectPlate(slot.plateNumber)}
            className="flex justify-between items-center bg-white/5 hover:bg-white/10 p-3 rounded-xl cursor-pointer transition-all border border-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">
                {slot.vehicleType === "car" ? "🚗" : "🏍️"}
              </span>
              <span className="font-mono text-white font-medium">
                {slot.plateNumber}
              </span>
            </div>
            <span className="text-sm text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">
              Slot {slot.slotNumber}
            </span>
          </div>
        ))}

        {occupiedSlots.length === 0 && (
          <p className="text-blue-300/50 text-center py-4">
            No vehicles parked
          </p>
        )}
      </div>
    </Card>
  );
}
