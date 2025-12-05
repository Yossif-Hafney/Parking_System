"use client";

// ============================================
// Search Vehicle Component
// ============================================

import { useState, KeyboardEvent } from "react";
import { Card, CardHeader } from "../ui/Card";
import type { SearchResult } from "../../types";

interface SearchFormProps {
  onSearch: (plate: string) => Promise<SearchResult>;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [plate, setPlate] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!plate.trim()) return;

    setIsSearching(true);
    try {
      const searchResult = await onSearch(plate);
      setResult(searchResult);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Card>
      <CardHeader icon="🔍" title="Find Vehicle" />

      <div className="flex gap-2">
        <input
          type="text"
          value={plate}
          onChange={(e) => {
            setPlate(e.target.value.toUpperCase());
            setResult(null);
          }}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-3 bg-white/10 border border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-white/40 focus:outline-none transition-all"
          placeholder="Enter plate number"
          disabled={isSearching}
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching || !plate.trim()}
          className="px-6 bg-blue-500/30 text-blue-300 rounded-xl hover:bg-blue-500/50 transition-all border border-blue-500/30 disabled:opacity-50"
        >
          {isSearching ? "..." : "Search"}
        </button>
      </div>

      {/* Result */}
      {result && (
        <div
          className={`mt-4 p-4 rounded-xl ${
            result.found
              ? "bg-green-500/20 border border-green-500/30"
              : "bg-red-500/20 border border-red-500/30"
          }`}
        >
          {result.found ? (
            <div className="text-green-300">
              ✅ Found in{" "}
              <span className="font-bold">Slot {result.slotId}</span>
              <span className="ml-2 opacity-70">({result.type})</span>
            </div>
          ) : (
            <div className="text-red-300">❌ Vehicle not found</div>
          )}
        </div>
      )}
    </Card>
  );
}
