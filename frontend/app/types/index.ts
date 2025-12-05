// ============================================
// Shared Types for Parking System
// ============================================

// API Response Types
export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  username?: string;
  role?: string;
}

export interface ParkResponse {
  message?: string;
  plate?: string;
  slotId?: number;
  error?: string;
}

export interface RemoveResponse {
  message?: string;
  plate?: string;
  fee?: number;
  error?: string;
}

// Domain Types
export interface SlotStatus {
  slotNumber: number;
  available: boolean;
  plateNumber?: string;
  vehicleType?: string;
  startTime?: string;
  color?: string;
  brand?: string;
}

export interface HistoryRecord {
  id: number;
  slot: number;
  plate: string;
  type: string;
  color?: string;
  brand?: string;
  fee: number;
  endTime: string;
}

export interface RevenueData {
  total: number;
  today: number;
}

export interface UserInfo {
  username: string;
  role: string;
  loggedInSince: string;
}

// Auth Types
export interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  username: string | null;
  role: string | null;
  token: string | null;
}

export interface AuthContextType extends AuthState {
  isAdmin: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

// Component Props Types
export interface MessageType {
  type: "success" | "error" | "info";
  text: string;
}

export interface SearchResult {
  found: boolean;
  slotId?: number;
  type?: string;
}

export type TabType = "dashboard" | "park" | "history";
