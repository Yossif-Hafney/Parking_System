"use client";

// ============================================
// Parking History Table Component
// ============================================

import { useAuth } from "../../lib/auth-context";
import type { HistoryRecord, RevenueData } from "../../types";

interface HistoryTableProps {
  history: HistoryRecord[];
  revenue: RevenueData | null;
}

export function HistoryTable({ history, revenue }: HistoryTableProps) {
  const { isAdmin } = useAuth();

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
        {isAdmin && revenue && (
          <div className="text-right">
            <p className="text-blue-300 text-sm">Total Revenue</p>
            <p className="text-2xl font-bold text-green-400">
              ${revenue.total.toFixed(2)}
            </p>
          </div>
        )}
      </div>

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
                  Fee
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  Exit Time
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
                    {record.type === "car" ? "🚗" : "🏍️"} {record.type}
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
                  <td className="px-6 py-4">
                    <span className="font-bold text-green-400">
                      ${record.fee.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-300">
                    {record.endTime}
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
