"use client";

// ============================================
// Main Dashboard Component
// ============================================

import { useState } from "react";
import { useParkingData } from "../../lib/use-parking-data";
import { Toast } from "../ui/Toast";
import { Header } from "./Header";
import { StatsCards } from "./StatsCards";
import { SlotGrid } from "./SlotGrid";
import { SlotDetailModal } from "./SlotDetailModal";
import { ParkForm } from "./ParkForm";
import { RemoveForm } from "./RemoveForm";
import { SearchForm } from "./SearchForm";
import { ParkedVehiclesList } from "./ParkedVehiclesList";
import { HistoryTable } from "./HistoryTable";
import { OccupancyBar } from "./OccupancyBar";
import type { SlotStatus, TabType } from "../../types";

const TABS: { id: TabType; icon: string; label: string }[] = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "park", icon: "🚙", label: "Park" },
  { id: "history", icon: "📋", label: "History" },
];

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [selectedSlot, setSelectedSlot] = useState<SlotStatus | null>(null);
  const [removePlateField, setRemovePlateField] = useState("");

  const {
    slots,
    history,
    revenue,
    availableSlots,
    occupiedSlots,
    occupancyRate,
    loading,
    message,
    loadData,
    clearMessage,
    parkVehicle,
    removeVehicle,
    findVehicle,
  } = useParkingData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <Header />

      {/* Toast Notifications */}
      <Toast message={message} onClose={clearMessage} />

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex gap-2 bg-white/5 backdrop-blur-lg rounded-2xl p-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "text-blue-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <StatsCards
              totalSlots={slots.length}
              availableSlots={availableSlots}
              occupiedSlots={occupiedSlots}
              occupancyRate={occupancyRate}
              revenue={revenue}
            />

            <OccupancyBar occupancyRate={occupancyRate} />

            <SlotGrid
              slots={slots}
              loading={loading}
              onSlotClick={setSelectedSlot}
              onRefresh={loadData}
            />
          </div>
        )}

        {/* Park Tab */}
        {activeTab === "park" && (
          <div className="grid md:grid-cols-2 gap-6">
            <ParkForm onPark={parkVehicle} />

            <div className="space-y-6">
              <RemoveForm
                onRemove={removeVehicle}
                initialPlate={removePlateField}
              />
              <SearchForm onSearch={findVehicle} />
              <ParkedVehiclesList
                slots={slots}
                onSelectPlate={(plate) => setRemovePlateField(plate)}
              />
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <HistoryTable history={history} revenue={revenue} />
        )}
      </main>

      {/* Slot Detail Modal */}
      <SlotDetailModal
        slot={selectedSlot}
        onClose={() => setSelectedSlot(null)}
        onRemove={async (plate) => {
          await removeVehicle(plate);
        }}
      />

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-6 text-center text-blue-300/50 text-sm">
        Parking Management System © 2025
      </footer>
    </div>
  );
}
