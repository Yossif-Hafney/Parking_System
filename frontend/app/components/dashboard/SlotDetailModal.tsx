"use client";

// ============================================
// Slot Detail Modal Component
// ============================================

import { Modal } from "../ui/Modal";
import type { SlotStatus } from "../../types";

interface SlotDetailModalProps {
  slot: SlotStatus | null;
  onClose: () => void;
  onRemove: (plateNumber: string) => void;
}

export function SlotDetailModal({
  slot,
  onClose,
  onRemove,
}: SlotDetailModalProps) {
  if (!slot) return null;

  return (
    <Modal isOpen={!!slot} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${
            slot.available
              ? "bg-gradient-to-br from-green-500 to-emerald-600"
              : "bg-gradient-to-br from-red-500 to-orange-600"
          }`}
        >
          {slot.available ? "🅿️" : "🚗"}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">
            Slot #{slot.slotNumber}
          </h3>
          <p
            className={`text-sm font-medium ${
              slot.available ? "text-green-400" : "text-red-400"
            }`}
          >
            {slot.available ? "✅ Available" : "🔴 Occupied"}
          </p>
        </div>
      </div>

      {/* Content */}
      {slot.available ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
          <div className="text-6xl mb-4">🅿️</div>
          <p className="text-green-300 text-lg font-medium">
            This slot is available!
          </p>
          <p className="text-green-400/70 text-sm mt-2">
            Go to the Park tab to add a vehicle
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Vehicle Info */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h4 className="text-blue-300 text-sm font-medium mb-4 flex items-center gap-2">
              <span>🚘</span> Vehicle Information
            </h4>

            <div className="space-y-3">
              <InfoRow
                label="Plate Number"
                value={
                  <span className="font-mono font-bold text-xl text-white bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-4 py-2 rounded-lg border border-white/10">
                    {slot.plateNumber || "N/A"}
                  </span>
                }
              />

              <InfoRow
                label="Vehicle Type"
                value={
                  <span className="text-white flex items-center gap-2">
                    {slot.vehicleType === "car"
                      ? "🚗"
                      : slot.vehicleType === "motorcycle"
                      ? "🏍️"
                      : "🚐"}
                    <span className="capitalize">
                      {slot.vehicleType || "Unknown"}
                    </span>
                  </span>
                }
              />

              {slot.color && (
                <InfoRow
                  label="Color"
                  value={
                    <span className="text-white flex items-center gap-2">
                      🎨 {slot.color}
                    </span>
                  }
                />
              )}

              {slot.brand && (
                <InfoRow
                  label="Brand"
                  value={
                    <span className="text-white flex items-center gap-2">
                      🏷️ {slot.brand}
                    </span>
                  }
                />
              )}

              {slot.startTime && (
                <InfoRow
                  label="Entry Time"
                  value={
                    <span className="text-yellow-400 flex items-center gap-2">
                      🕐 {new Date(slot.startTime).toLocaleString()}
                    </span>
                  }
                />
              )}
            </div>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => {
              if (
                slot.plateNumber &&
                confirm(`Remove vehicle ${slot.plateNumber}?`)
              ) {
                onRemove(slot.plateNumber);
                onClose();
              }
            }}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2"
          >
            <span>🚪</span> Remove Vehicle & Calculate Fee
          </button>
        </div>
      )}

      <p className="text-center text-white/30 text-xs mt-6">
        Click outside or press Escape to close
      </p>
    </Modal>
  );
}

// Helper component for info rows
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-white/60">{label}</span>
      {value}
    </div>
  );
}
