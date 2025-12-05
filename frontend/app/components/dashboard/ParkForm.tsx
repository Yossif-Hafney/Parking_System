"use client";

// ============================================
// Park Vehicle Form Component
// ============================================

import { useState, FormEvent } from "react";
import { Card, CardHeader } from "../ui/Card";

const CAR_BRANDS = [
  "BMW",
  "Mercedes",
  "Toyota",
  "Honda",
  "Ford",
  "Chevrolet",
  "Audi",
  "Volkswagen",
  "Nissan",
  "Hyundai",
  "Kia",
  "Mazda",
  "Lexus",
  "Jeep",
  "Porsche",
  "Tesla",
  "Other",
];

interface ParkFormProps {
  onPark: (
    plate: string,
    type: string,
    color: string,
    brand: string
  ) => Promise<boolean>;
}

export function ParkForm({ onPark }: ParkFormProps) {
  const [plate, setPlate] = useState("");
  const [vehicleType, setVehicleType] = useState("car");
  const [color, setColor] = useState("");
  const [brand, setBrand] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!color.trim()) {
      alert("Color is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await onPark(plate, vehicleType, color, brand);
      if (success) {
        setPlate("");
        setColor("");
        setBrand("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader icon="🚗" title="Park Vehicle" />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Plate Number */}
        <div>
          <label className="block text-sm font-medium text-blue-300 mb-2">
            Plate Number *
          </label>
          <input
            type="text"
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 bg-white/10 border border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/40 focus:outline-none transition-all"
            placeholder="ABC-1234"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Vehicle Type */}
        <div>
          <label className="block text-sm font-medium text-blue-300 mb-2">
            Vehicle Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <VehicleTypeButton
              type="car"
              icon="🚗"
              label="Car"
              price="$10/hour"
              selected={vehicleType === "car"}
              onClick={() => setVehicleType("car")}
              disabled={isSubmitting}
            />
            <VehicleTypeButton
              type="bike"
              icon="🏍️"
              label="Bike"
              price="$5/hour"
              selected={vehicleType === "bike"}
              onClick={() => setVehicleType("bike")}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="block text-sm font-medium text-blue-300 mb-2">
            Color *
          </label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/40 focus:outline-none transition-all"
            placeholder="Red, Blue, Black..."
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-blue-300 mb-2">
            Brand
          </label>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white focus:outline-none transition-all"
            disabled={isSubmitting}
          >
            <option value="" className="bg-slate-800">
              Select brand...
            </option>
            {CAR_BRANDS.map((b) => (
              <option key={b} value={b} className="bg-slate-800">
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Parking...
            </>
          ) : (
            <>🅿️ Park Vehicle</>
          )}
        </button>
      </form>
    </Card>
  );
}

// Vehicle type button
interface VehicleTypeButtonProps {
  type: string;
  icon: string;
  label: string;
  price: string;
  selected: boolean;
  onClick: () => void;
  disabled: boolean;
}

function VehicleTypeButton({
  icon,
  label,
  price,
  selected,
  onClick,
  disabled,
}: VehicleTypeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-4 rounded-xl border-2 transition-all ${
        selected
          ? "bg-blue-500/30 border-blue-400 text-white"
          : "bg-white/5 border-white/20 text-blue-300 hover:border-white/40"
      } disabled:opacity-50`}
    >
      <div className="text-3xl mb-1">{icon}</div>
      <div className="font-medium">{label}</div>
      <div className="text-xs opacity-70">{price}</div>
    </button>
  );
}
