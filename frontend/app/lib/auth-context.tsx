"use client";

// ============================================
// Auth Context - Global Authentication State
// ============================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { api } from "./api";
import type { AuthContextType } from "../types";

const AuthContext = createContext<AuthContextType | null>(null);

// Session validation interval (5 minutes)
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Refresh auth state from storage/server
  const refreshAuth = useCallback(async () => {
    const storedToken = api.getToken();

    if (!storedToken) {
      setIsLoggedIn(false);
      setUsername(null);
      setRole(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    // Validate session with server
    const userInfo = await api.validateSession();

    if (userInfo) {
      setIsLoggedIn(true);
      setUsername(userInfo.username);
      setRole(userInfo.role);
      setToken(storedToken);
    } else {
      // Session invalid
      setIsLoggedIn(false);
      setUsername(null);
      setRole(null);
      setToken(null);
    }

    setIsLoading(false);
  }, []);

  // Initial auth check
  useEffect(() => {
    // First, check local storage for quick UI response
    const storedToken = api.getToken();
    const storedUsername = api.getUsername();
    const storedRole = api.getRole();

    if (storedToken) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setRole(storedRole);
      setToken(storedToken);
    }

    setIsLoading(false);

    // Then validate with server in background
    refreshAuth();
  }, [refreshAuth]);

  // Periodic session validation
  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      refreshAuth();
    }, SESSION_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [isLoggedIn, refreshAuth]);

  // Login handler
  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);

    try {
      const result = await api.login(username, password);

      if (result.success) {
        setIsLoggedIn(true);
        setUsername(result.username || null);
        setRole(result.role || null);
        setToken(api.getToken());
      }

      return { success: result.success, message: result.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await api.logout();
    } finally {
      setIsLoggedIn(false);
      setUsername(null);
      setRole(null);
      setToken(null);
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    isLoggedIn,
    isLoading,
    username,
    role,
    token,
    isAdmin: role === "admin",
    login,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
