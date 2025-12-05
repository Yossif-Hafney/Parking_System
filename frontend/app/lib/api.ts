// ============================================
// API Service - Handles all HTTP requests
// ============================================

import type {
  LoginResponse,
  ParkResponse,
  RemoveResponse,
  SlotStatus,
  HistoryRecord,
  RevenueData,
  UserInfo,
  SearchResult,
} from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Token Storage Keys
const TOKEN_KEY = "parking_token";
const USERNAME_KEY = "parking_username";
const ROLE_KEY = "parking_role";
const TOKEN_EXPIRY_KEY = "parking_token_expiry";

class ApiService {
  // ============================================
  // Token Management
  // ============================================

  getToken(): string | null {
    if (typeof window === "undefined") return null;

    // Check if token is expired
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (expiry && Date.now() > parseInt(expiry)) {
      this.clearAuth();
      return null;
    }

    return localStorage.getItem(TOKEN_KEY);
  }

  private setAuth(token: string, username: string, role: string): void {
    if (typeof window === "undefined") return;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERNAME_KEY, username);
    localStorage.setItem(ROLE_KEY, role);
    // Token expires in 55 minutes (server has 60 min, we refresh early)
    localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + 55 * 60 * 1000));
  }

  clearAuth(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  // ============================================
  // Auth Helpers
  // ============================================

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUsername(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(USERNAME_KEY);
  }

  getRole(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ROLE_KEY);
  }

  isAdmin(): boolean {
    return this.getRole() === "admin";
  }

  // ============================================
  // Auth Endpoints
  // ============================================

  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success && data.token) {
        this.setAuth(data.token, data.username, data.role);
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Connection error. Please check if the server is running.",
      };
    }
  }

  async logout(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (token) {
        await fetch(`${API_BASE}/logout`, {
          method: "POST",
          headers: this.getHeaders(),
        });
      }
    } catch {
      // Ignore logout errors - we'll clear local state anyway
    } finally {
      this.clearAuth();
    }
    return true;
  }

  async validateSession(): Promise<UserInfo | null> {
    try {
      const token = this.getToken();
      if (!token) return null;

      const res = await fetch(`${API_BASE}/me`, {
        headers: this.getHeaders(),
      });

      if (res.ok) {
        return await res.json();
      }

      // Token invalid, clear auth
      if (res.status === 401) {
        this.clearAuth();
      }
    } catch {
      // Network error - don't clear auth, might be temporary
    }
    return null;
  }

  // ============================================
  // Parking Endpoints
  // ============================================

  async parkVehicle(
    plate: string,
    type: string,
    color: string,
    brand: string
  ): Promise<ParkResponse> {
    try {
      const res = await fetch(`${API_BASE}/park`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ plate, type, color, brand }),
      });
      return await res.json();
    } catch (error) {
      console.error("Park error:", error);
      return { error: "Connection error" };
    }
  }

  async removeVehicle(plate: string): Promise<RemoveResponse> {
    try {
      const res = await fetch(`${API_BASE}/remove`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify({ plate }),
      });
      return await res.json();
    } catch (error) {
      console.error("Remove error:", error);
      return { error: "Connection error" };
    }
  }

  async getStatus(): Promise<SlotStatus[]> {
    try {
      const res = await fetch(`${API_BASE}/status`, {
        headers: this.getHeaders(),
      });

      if (!res.ok) return [];

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Status error:", error);
      return [];
    }
  }

  async findVehicle(plate: string): Promise<SearchResult> {
    try {
      const res = await fetch(
        `${API_BASE}/find?plate=${encodeURIComponent(plate)}`,
        {
          headers: this.getHeaders(),
        }
      );
      return await res.json();
    } catch (error) {
      console.error("Find error:", error);
      return { found: false };
    }
  }

  async getHistory(limit = 50): Promise<HistoryRecord[]> {
    try {
      const res = await fetch(`${API_BASE}/history?limit=${limit}`, {
        headers: this.getHeaders(),
      });

      if (!res.ok) return [];

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("History error:", error);
      return [];
    }
  }

  async getRevenue(): Promise<RevenueData | null> {
    try {
      const res = await fetch(`${API_BASE}/revenue`, {
        headers: this.getHeaders(),
      });

      if (!res.ok) return null;

      return await res.json();
    } catch (error) {
      console.error("Revenue error:", error);
      return null;
    }
  }
}

// Export singleton instance
export const api = new ApiService();
