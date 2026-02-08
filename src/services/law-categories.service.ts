import { api } from "@/lib/api-client";
export interface LawCategory {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface CreateLawCategoryInput {
  name: string;
  description: string;
  isActive: boolean;
}

export interface UpdateLawCategoryInput {
  id: number;
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface LawCategoryStats {
  totalCategories: number;
}

export const lawCategoriesApi = {
  /**
   * Get all specializations
   * GET /Specializations
   */
  async getCategories(): Promise<LawCategory[] | null> {
    try {
      const response = await api.get<LawCategory[]>("/Specializations");
      if (response.error) {
        console.error("Error fetching specializations:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error fetching specializations:", error);
      return null;
    }
  },

  /**
   * Get active specializations
   * GET /Specializations/active
   */
  async getActiveCategories(): Promise<LawCategory[] | null> {
    try {
      const response = await api.get<LawCategory[]>("/Specializations/active");
      if (response.error) {
        console.error("Error fetching active specializations:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error fetching active specializations:", error);
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
   * Get a single specialization by ID
   * GET /Specializations/{id}
   */
  async getCategory(id: number): Promise<LawCategory | null> {
    try {
      const response = await api.get<LawCategory>(`/Specializations/${id}`);
      if (response.error) {
        console.error("Error fetching specialization:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error fetching specialization:", error);
      return null;
    }
  },

  /**
   * Create a new specialization
   * POST /Specializations
   */
  async createCategory(
    input: CreateLawCategoryInput,
  ): Promise<LawCategory | null> {
    try {
      const response = await api.post<LawCategory>("/Specializations", input);
      if (response.error) {
        console.error("Error creating specialization:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error creating specialization:", error);
      return null;
    }
  },

  /**
   * Update a specialization
   * PUT /Specializations/{id}
   */
  async updateCategory(
    input: UpdateLawCategoryInput,
  ): Promise<LawCategory | null> {
    try {
      const { id, ...updateData } = input;
      const response = await api.put<LawCategory>(
        `/Specializations/${id}`,
        updateData,
      );
      if (response.error) {
        console.error("Error updating specialization:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error updating specialization:", error);
      return null;
    }
  },

  /**
   * Delete a specialization
   * DELETE /Specializations/{id}
   */
  async deleteCategory(id: number): Promise<boolean> {
    try {
      const response = await api.delete(`/Specializations/${id}`);
      if (response.error) {
        console.error("Error deleting specialization:", response.error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error deleting specialization:", error);
      return false;
    }
  },

  /**
   * Search law categories (using local filtering for now)
   */
  async searchCategories(query: string): Promise<LawCategory[] | null> {
    try {
      const categories = await this.getCategories();
      if (!categories) return null;

      const searchLower = query.toLowerCase();
      return categories.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower),
      );
    } catch (error) {
      console.error("Error searching law categories:", error);
      return null;
    }
  },
};
