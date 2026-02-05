/**
 * User Management API Service
 * Handles all user management operations
 */

import { api } from "@/lib/api-client";
import type {
  UserAccount,
  UserManagementStats,
  SuspendUserInput,
  ReinstateUserInput,
} from "@/lib/api-types";

export const userManagementApi = {
  /**
   * Get all users with optional type filter
   */
  async getUsers(type?: "client" | "lawyer"): Promise<UserAccount[] | null> {
    try {
      const endpoint = type
        ? `/users?type=${type}`
        : "/users";
      const response = await api.get<UserAccount[]>(endpoint);
      if (response.error) {
        console.error("Error fetching users:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error fetching users:", error);
      return null;
    }
  },

  /**
   * Get user management statistics
   */
  async getUserStats(): Promise<UserManagementStats | null> {
    try {
      const response = await api.get<UserManagementStats>("/users/stats");
      if (response.error) {
        console.error("Error fetching user stats:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return null;
    }
  },

  /**
   * Get a single user by ID
   */
  async getUser(id: string): Promise<UserAccount | null> {
    try {
      const response = await api.get<UserAccount>(`/users/${id}`);
      if (response.error) {
        console.error("Error fetching user:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },

  /**
   * Suspend a user account
   */
  async suspendUser(input: SuspendUserInput): Promise<UserAccount | null> {
    try {
      const response = await api.post<UserAccount>(
        `/users/${input.userId}/suspend`,
        { reason: input.reason }
      );
      if (response.error) {
        console.error("Error suspending user:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error suspending user:", error);
      return null;
    }
  },

  /**
   * Reinstate/Unsuspend a user account
   */
  async reinstateUser(input: ReinstateUserInput): Promise<UserAccount | null> {
    try {
      const response = await api.post<UserAccount>(
        `/users/${input.userId}/reinstate`,
        {}
      );
      if (response.error) {
        console.error("Error reinstating user:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error reinstating user:", error);
      return null;
    }
  },

  /**
   * Search users by name or email
   */
  async searchUsers(query: string): Promise<UserAccount[] | null> {
    try {
      const response = await api.get<UserAccount[]>(`/users/search?q=${encodeURIComponent(query)}`);
      if (response.error) {
        console.error("Error searching users:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error searching users:", error);
      return null;
    }
  },

  /**
   * Get suspended users
   */
  async getSuspendedUsers(): Promise<UserAccount[] | null> {
    try {
      const response = await api.get<UserAccount[]>("/users/suspended");
      if (response.error) {
        console.error("Error fetching suspended users:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error fetching suspended users:", error);
      return null;
    }
  },
};
