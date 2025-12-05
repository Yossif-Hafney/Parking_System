"use client";

// ============================================
// Remove Vehicle Form Component
// ============================================

import { useState, FormEvent } from "react";
import { Card, CardHeader } from "../ui/Card";

interface RemoveFormProps {
  onRemove: (plate: string) => Promise<{ success: boolean; fee?: number }>;
  initialPlate?: string;
}

export function RemoveForm({ onRemove, initialPlate = "" }: RemoveFormProps) {
  const [plate, setPlate] = useState(initialPlate);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await onRemove(plate);
      if (result.success) {
        setPlate("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader icon="🚪" title="Remove Vehicle" />

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white py-4 rounded-xl font-semibold hover:from-red-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>💰 Remove & Calculate Fee</>
          )}
        </button>
      </form>
    </Card>
  );
}
