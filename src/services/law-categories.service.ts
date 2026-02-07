/**
 * Law Categories API Service
 * Handles all law category management operations
 */

import { api } from "@/lib/api-client";
import type {
  LawCategory,
  CreateLawCategoryInput,
  UpdateLawCategoryInput,
  LawCategoryStats,
} from "@/lib/api-types";

export const lawCategoriesApi = {
  /**
   * Get all law categories
   * GET /law-categories
   */
  async getCategories(): Promise<LawCategory[] | null> {
    try {
      const response = await api.get<LawCategory[]>("/law-categories");
      if (response.error) {
        console.error("Error fetching law categories:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error fetching law categories:", error);
      return null;
    }
  },

  /**
   * Get law categories statistics
   * GET /law-categories/stats
   */
  async getStats(): Promise<LawCategoryStats | null> {
    try {
      const response = await api.get<LawCategoryStats>("/law-categories/stats");
      if (response.error) {
        console.error("Error fetching law categories stats:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error fetching law categories stats:", error);
      return null;
    }
  },

  /**
   * Get a single law category by ID
   * GET /law-categories/{id}
   */
  async getCategory(id: string): Promise<LawCategory | null> {
    try {
      const response = await api.get<LawCategory>(`/law-categories/${id}`);
      if (response.error) {
        console.error("Error fetching law category:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error fetching law category:", error);
      return null;
    }
  },

  /**
   * Create a new law category
   * POST /law-categories
   */
  async createCategory(
    input: CreateLawCategoryInput,
  ): Promise<LawCategory | null> {
    try {
      const response = await api.post<LawCategory>("/law-categories", input);
      if (response.error) {
        console.error("Error creating law category:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error creating law category:", error);
      return null;
    }
  },

  /**
   * Update a law category
   * PATCH /law-categories/{id}
   */
  async updateCategory(
    input: UpdateLawCategoryInput,
  ): Promise<LawCategory | null> {
    try {
      const { id, ...updateData } = input;
      const response = await api.patch<LawCategory>(
        `/law-categories/${id}`,
        updateData,
      );
      if (response.error) {
        console.error("Error updating law category:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error updating law category:", error);
      return null;
    }
  },

  /**
   * Delete a law category
   * DELETE /law-categories/{id}
   */
  async deleteCategory(id: string): Promise<boolean> {
    try {
      const response = await api.delete(`/law-categories/${id}`);
      if (response.error) {
        console.error("Error deleting law category:", response.error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error deleting law category:", error);
      return false;
    }
  },

  /**
   * Search law categories
   * GET /law-categories/search?q=search_query
   */
  async searchCategories(query: string): Promise<LawCategory[] | null> {
    try {
      const response = await api.get<LawCategory[]>("/law-categories/search", {
        q: query,
      });
      if (response.error) {
        console.error("Error searching law categories:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error searching law categories:", error);
      return null;
    }
  },
};
