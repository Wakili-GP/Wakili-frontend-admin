/**
 * Authentication API Service
 * Handles all authentication operations
 */

import { api } from "@/lib/api-client";
import type { LoginInput, LoginResponse } from "@/lib/api-types";

export const authApi = {
  /**
   * Admin login
   * POST /auth/login
   */
  async login(input: LoginInput): Promise<LoginResponse | null> {
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email: input.email,
        password: input.password,
      });
      if (response.error) {
        console.error("Error logging in:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error logging in:", error);
      return null;
    }
  },

  /**
   * Admin logout
   * POST /auth/logout
   */
  async logout(): Promise<boolean> {
    try {
      const response = await api.post("/auth/logout", {});
      if (response.error) {
        console.error("Error logging out:", response.error);
        return false;
      }
      // Clear local storage token
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminToken");
      return true;
    } catch (error) {
      console.error("Error logging out:", error);
      // Still clear local storage on error
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminToken");
      return true;
    }
  },

  /**
   * Verify current admin session
   * GET /auth/verify
   */
  async verify(): Promise<LoginResponse | null> {
    try {
      const response = await api.get<LoginResponse>("/auth/verify");
      if (response.error) {
        console.error("Error verifying session:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error verifying session:", error);
      return null;
    }
  },

  /**
   * Refresh authentication token
   * POST /auth/refresh
   */
  async refreshToken(): Promise<LoginResponse | null> {
    try {
      const response = await api.post<LoginResponse>("/auth/refresh", {});
      if (response.error) {
        console.error("Error refreshing token:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  },
};
