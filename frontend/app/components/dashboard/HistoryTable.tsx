"use client";

import { useState } from "react";
import { useAuth } from "../../lib/auth-context";
import { FaCar, FaMotorcycle, FaTrash } from "react-icons/fa";
import type { HistoryRecord, RevenueData, MessageType } from "../../types";
import { api } from "../../lib/api";
import { Modal } from "../ui/Modal";

interface HistoryTableProps {
  history: HistoryRecord[];
  revenue: RevenueData | null;
  onRefresh: () => void;
  onMessage: (message: MessageType) => void;
}

export function HistoryTable({ history, revenue, onRefresh, onMessage }: HistoryTableProps) {
  const { isAdmin } = useAuth();
  const [isClearing, setIsClearing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleClearHistory = async () => {
    setShowConfirmModal(false);
    setIsClearing(true);

    try {
      console.log("[HistoryTable] Calling clearHistory API...");
      const result = await api.clearHistory();
      console.log("[HistoryTable] API result:", result);

      if (result.success) {
        onMessage({ type: "success", text: "History cleared successfully!" });
        onRefresh();
      } else {
        onMessage({
          type: "error",
          text: result.error || result.message || "Failed to clear history"
        });
      }
    } catch (error) {
      console.error("[HistoryTable] Error:", error);
      onMessage({ type: "error", text: "Connection error. Please try again." });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📋 Parking History
          </h2>
          <p className="text-blue-300 text-sm mt-1">
            {history.length} records found
          </p>
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && revenue && (
            <div className="text-right">
              <p className="text-blue-300 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-green-400">
                ${revenue.total.toFixed(2)}
              </p>
            </div>
          )}
          {isAdmin && history.length > 0 && (
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={isClearing}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg border border-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaTrash />
              {isClearing ? "Clearing..." : "Clear History"}
            </button>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-white mb-4">Clear All History?</h3>
          <p className="text-blue-300 mb-6">
            This will permanently delete all parking history records.
            This action cannot be undone.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleClearHistory}
              className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all"
            >
              Clear History
            </button>
          </div>
        </div>
      </Modal>

      {/* Content */}
      {history.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-xl text-white mb-2">No History Yet</p>
          <p className="text-blue-300">
            Park and remove a vehicle to see history here
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  Plate
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  Color
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  Slot
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  Entry Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  Exit Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  Fee
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {history.map((record, index) => (
                <tr
                  key={record.id ?? `history-${index}`}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-blue-300">
                    {record.id}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-white bg-white/10 px-3 py-1 rounded-lg">
                      {record.plate}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white">
                      {record.type === "car" ? <FaCar /> : <FaMotorcycle />} {record.type}
                  </td>
                  <td className="px-6 py-4 text-white">
                    {record.color || "-"}
                  </td>
                  <td className="px-6 py-4 text-white">
                    {record.brand || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full text-sm">
                      {record.slot}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-300">
                    {record.startTime ? new Date(record.startTime).toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-300">
                    {new Date(record.endTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full text-sm font-semibold">
                      {record.hours != null ? record.hours.toFixed(2) : '0.00'}h
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-green-400">
                      ${record.fee.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
