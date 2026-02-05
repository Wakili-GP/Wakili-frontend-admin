/**
 * Dashboard API Service
 * Handles all dashboard-related API calls
 */

import { api } from "@/lib/api-client";
import type {
  DashboardData,
  DashboardStat,
  Activity,
  AccountStatus,
  Admin,
  CreateAdminInput,
} from "@/lib/api-types";

export const dashboardApi = {
  /**
   * Get dashboard overview data
   * GET /dashboard
   */
  getDashboardData: async (): Promise<DashboardData | null> => {
    const response = await api.get<DashboardData>("/dashboard");
    if (response.error) {
      console.error("Error fetching dashboard data:", response.error);
      return null;
    }
    return response.data || null;
  },

  /**
   * Get dashboard statistics
   * GET /dashboard/stats
   */
  getStats: async (): Promise<DashboardStat[] | null> => {
    const response = await api.get<DashboardStat[]>("/dashboard/stats");
    if (response.error) {
      console.error("Error fetching stats:", response.error);
      return null;
    }
    return response.data || null;
  },

  /**
   * Get recent activities
   * GET /dashboard/activities
   */
  getRecentActivities: async (limit?: number): Promise<Activity[] | null> => {
    const response = await api.get<Activity[]>("/dashboard/activities", {
      limit: limit || 5,
    });
    if (response.error) {
      console.error("Error fetching activities:", response.error);
      return null;
    }
    return response.data || null;
  },

  /**
   * Get account status counts
   * GET /dashboard/account-status
   */
  getAccountStatus: async (): Promise<AccountStatus | null> => {
    const response = await api.get<AccountStatus>("/dashboard/account-status");
    if (response.error) {
      console.error("Error fetching account status:", response.error);
      return null;
    }
    return response.data || null;
  },

  /**
   * Get all admins
   * GET /admins
   */
  getAdmins: async (): Promise<Admin[] | null> => {
    const response = await api.get<Admin[]>("/admins");
    if (response.error) {
      console.error("Error fetching admins:", response.error);
      return null;
    }
    return response.data || null;
  },

  /**
   * Create a new admin
   * POST /admins
   */
  createAdmin: async (adminData: CreateAdminInput): Promise<Admin | null> => {
    const response = await api.post<Admin>("/admins", adminData);
    if (response.error) {
      console.error("Error creating admin:", response.error);
      return null;
    }
    return response.data || null;
  },

  /**
   * Delete an admin
   * DELETE /admins/:id
   */
  deleteAdmin: async (id: string): Promise<boolean> => {
    const response = await api.delete(`/admins/${id}`);
    if (response.error) {
      console.error("Error deleting admin:", response.error);
      return false;
    }
    return true;
  },

  /**
   * Update an admin
   * PATCH /admins/:id
   */
  updateAdmin: async (
    id: string,
    adminData: Partial<Admin>,
  ): Promise<Admin | null> => {
    const response = await api.patch<Admin>(`/admins/${id}`, adminData);
    if (response.error) {
      console.error("Error updating admin:", response.error);
      return null;
    }
    return response.data || null;
  },
};
