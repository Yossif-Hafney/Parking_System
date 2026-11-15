"use client";

import { useMemo, useState, type JSX } from "react";
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

import { FaChartBar, FaCarSide, FaClipboardList } from "react-icons/fa";
import type { SlotStatus, TabType } from "../../types";

const TABS: { id: TabType; icon: JSX.Element; label: string }[] = [
  { id: "dashboard", icon: <FaChartBar />, label: "Dashboard" },
  { id: "park", icon: <FaCarSide />, label: "Park" },
  { id: "history", icon: <FaClipboardList />, label: "History" },
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
    showMessage,
    clearMessage,
    parkVehicle,
    removeVehicle,
    findVehicle,
  } = useParkingData();

  const summary = useMemo(() => {
    const currentDate = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(new Date());

    return {
      date: currentDate,
      status: occupancyRate >= 75 ? "Peak demand" : occupancyRate >= 50 ? "Balanced flow" : "Low traffic",
    };
  }, [occupancyRate]);

  return (
    <div className="min-h-screen">
      <Header />
      <Toast message={message} onClose={clearMessage} />

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-6">
        <section className="mb-6 overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/55 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-cyan-300/80">
                Operations overview
              </p>
              <h2 className="text-3xl font-bold text-white">Welcome back to the garage</h2>
            </div>
            <div className="flex items-center gap-2 self-start rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-200 md:self-auto">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.9)]" />
              {summary.status}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-200">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              {summary.date}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              {availableSlots} open spaces
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              {occupiedSlots} active vehicles
            </span>
          </div>
        </section>

        <div className="mb-6 overflow-hidden rounded-[26px] border border-white/10 bg-slate-900/40 p-2 shadow-xl shadow-slate-950/25 backdrop-blur-lg">
          <div className="flex flex-col gap-2 md:flex-row">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-[18px] px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-lg shadow-cyan-500/25"
                    : "text-sky-200 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <main>
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

          {activeTab === "park" && (
            <div className="grid gap-6 md:grid-cols-2">
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

          {activeTab === "history" && (
            <HistoryTable
              history={history}
              revenue={revenue}
              onRefresh={loadData}
              onMessage={showMessage}
            />
          )}
        </main>
      </div>

      <SlotDetailModal
        slot={selectedSlot}
        onClose={() => setSelectedSlot(null)}
        onRemove={async (plate) => {
          await removeVehicle(plate);
        }}
      />

      <footer className="mx-auto max-w-7xl px-4 pb-10 text-center text-sm text-slate-400">
        Parking Management System © 2025
      </footer>
    </div>
  );
}
