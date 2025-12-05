"use client";

// ============================================
// Custom Hook for Parking Data
// ============================================

import { useState, useEffect, useCallback } from "react";
import { api } from "./api";
import { useAuth } from "./auth-context";
import type {
  SlotStatus,
  HistoryRecord,
  RevenueData,
  MessageType,
} from "../types";

interface UseParkingDataReturn {
  // Data
  slots: SlotStatus[];
  history: HistoryRecord[];
  revenue: RevenueData | null;

  // Computed
  availableSlots: number;
  occupiedSlots: number;
  occupancyRate: number;

  // State
  loading: boolean;
  message: MessageType | null;

  // Actions
  loadData: () => Promise<void>;
  showMessage: (type: MessageType["type"], text: string) => void;
  clearMessage: () => void;
  parkVehicle: (
    plate: string,
    type: string,
    color: string,
    brand: string
  ) => Promise<boolean>;
  removeVehicle: (plate: string) => Promise<{ success: boolean; fee?: number }>;
  findVehicle: (
    plate: string
  ) => Promise<{ found: boolean; slotId?: number; type?: string }>;
}

const DATA_REFRESH_INTERVAL = 15000; // 15 seconds

export function useParkingData(): UseParkingDataReturn {
  const { isAdmin } = useAuth();

  const [slots, setSlots] = useState<SlotStatus[]>([]);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageType | null>(null);

  // Show message with auto-dismiss
  const showMessage = useCallback((type: MessageType["type"], text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  }, []);

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  // Load all data
  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      // Fetch slots and history in parallel
      const [slotsData, historyData] = await Promise.all([
        api.getStatus(),
        api.getHistory(50),
      ]);

      // Map backend fields to frontend SlotStatus
      const mappedSlots = slotsData.map((slot: any) => ({
        slotNumber: slot.slotNumber ?? slot.id,
        available: slot.available,
        plateNumber: slot.plateNumber ?? slot.plate,
        vehicleType: slot.vehicleType,
        startTime: slot.startTime,
        color: slot.color,
        brand: slot.brand,
      }));
      setSlots(mappedSlots);
      setHistory(historyData);

      // Only fetch revenue if admin
      if (isAdmin) {
        const revenueData = await api.getRevenue();
        setRevenue(revenueData);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Auto-refresh data
  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, DATA_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [loadData]);

  // Park vehicle
  const parkVehicle = useCallback(
    async (plate: string, type: string, color: string, brand: string) => {
      try {
        const result = await api.parkVehicle(plate, type, color, brand);

        if (result.slotId) {
          showMessage(
            "success",
            `✅ Vehicle ${plate} parked in slot ${result.slotId}`
          );
          loadData();
          return true;
        } else {
          showMessage("error", result.error || "Failed to park vehicle");
          return false;
        }
      } catch {
        showMessage("error", "Connection error - is the server running?");
        return false;
      }
    },
    [loadData, showMessage]
  );

  // Remove vehicle
  const removeVehicle = useCallback(
    async (plate: string) => {
      try {
        const result = await api.removeVehicle(plate);

        if (result.fee !== undefined) {
          showMessage(
            "success",
            `✅ ${plate} removed. Fee: $${result.fee.toFixed(2)}`
          );
          loadData();
          return { success: true, fee: result.fee };
        } else {
          showMessage("error", result.error || "Vehicle not found");
          return { success: false };
        }
      } catch {
        showMessage("error", "Connection error");
        return { success: false };
      }
    },
    [loadData, showMessage]
  );

  // Find vehicle
  const findVehicle = useCallback(
    async (plate: string) => {
      try {
        return await api.findVehicle(plate);
      } catch {
        showMessage("error", "Search failed");
        return { found: false };
      }
    },
    [showMessage]
  );

  // Computed values
  const availableSlots = slots.filter((s) => s.available).length;
  const occupiedSlots = slots.filter((s) => !s.available).length;
  const occupancyRate =
    slots.length > 0 ? Math.round((occupiedSlots / slots.length) * 100) : 0;

  return {
    slots,
    history,
    revenue,
    availableSlots,
    occupiedSlots,
    occupancyRate,
    loading,
    message,
    loadData,
    showMessage,
    clearMessage,
    parkVehicle,
    removeVehicle,
    findVehicle,
  };
}
