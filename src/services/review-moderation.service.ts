import { api } from "@/lib/api-client";
import type {
  Review,
  ReviewModerationStats,
  UpdateReviewStatusInput,
  ApproveReviewInput,
  DeleteReviewInput,
} from "@/lib/api-types";

/**
 * Review Moderation API Service
 * Handles all review moderation operations
 */

export const reviewModerationApi = {
  /**
   * Get all reviews with optional status filter
   */
  async getReviews(status?: "visible" | "hidden" | "flagged"): Promise<Review[] | null> {
    try {
      const endpoint = status
        ? `/reviews?status=${status}`
        : "/reviews";
      const response = await api.get<Review[]>(endpoint);
      if (response.error) {
        console.error("Error fetching reviews:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return null;
    }
  },

  /**
   * Get moderation statistics
   */
  async getReviewStats(): Promise<ReviewModerationStats | null> {
    try {
      const response = await api.get<ReviewModerationStats>("/reviews/stats");
      if (response.error) {
        console.error("Error fetching review stats:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error fetching review stats:", error);
      return null;
    }
  },

  /**
   * Get a single review by ID
   */
  async getReview(id: string): Promise<Review | null> {
    try {
      const response = await api.get<Review>(`/reviews/${id}`);
      if (response.error) {
        console.error("Error fetching review:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error fetching review:", error);
      return null;
    }
  },

  /**
   * Update review visibility status (visible/hidden/flagged)
   */
  async updateReviewStatus(input: UpdateReviewStatusInput): Promise<Review | null> {
    try {
      const response = await api.patch<Review>(
        `/reviews/${input.reviewId}/status`,
        { status: input.status }
      );
      if (response.error) {
        console.error("Error updating review status:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error updating review status:", error);
      return null;
    }
  },

  /**
   * Approve a flagged review (marks as visible and removes flag)
   */
  async approveReview(input: ApproveReviewInput): Promise<Review | null> {
    try {
      const response = await api.post<Review>(
        `/reviews/${input.reviewId}/approve`,
        {}
      );
      if (response.error) {
        console.error("Error approving review:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error approving review:", error);
      return null;
    }
  },

  /**
   * Delete a review permanently
   */
  async deleteReview(input: DeleteReviewInput): Promise<boolean> {
    try {
      const response = await api.delete(`/reviews/${input.reviewId}`);
      if (response.error) {
        console.error("Error deleting review:", response.error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error deleting review:", error);
      return false;
    }
  },

  /**
   * Search reviews by client name, lawyer name, or content
   */
  async searchReviews(query: string): Promise<Review[] | null> {
    try {
      const response = await api.get<Review[]>(`/reviews/search?q=${encodeURIComponent(query)}`);
      if (response.error) {
        console.error("Error searching reviews:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error searching reviews:", error);
      return null;
    }
  },

  /**
   * Get reviews for a specific lawyer
   */
  async getReviewsForLawyer(lawyerId: string): Promise<Review[] | null> {
    try {
      const response = await api.get<Review[]>(`/reviews/lawyer/${lawyerId}`);
      if (response.error) {
        console.error("Error fetching lawyer reviews:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error fetching lawyer reviews:", error);
      return null;
    }
  },
};
