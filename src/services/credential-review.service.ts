import { api } from "@/lib/api-client";
import type {
  PendingCredential,
  CredentialReviewStats,
  ApproveCredentialInput,
  RejectCredentialInput,
} from "@/lib/api-types";

const ENDPOINT = "/credentials";

export const credentialReviewApi = {
  /**
   * Get all credentials with optional status filter
   * GET /credentials
   */
  async getCredentials(
    status?: "pending" | "approved" | "rejected",
  ): Promise<PendingCredential[] | null> {
    try {
      const params = status ? `?status=${status}` : "";
      const response = await api.get<PendingCredential[]>(
        `${ENDPOINT}${params}`,
      );
      if (response.error) {
        console.error("Error fetching credentials:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error fetching credentials:", error);
      return null;
    }
  },

  /**
   * Get credential review statistics
   * GET /credentials/stats
   */
  async getCredentialStats(): Promise<CredentialReviewStats | null> {
    try {
      const response = await api.get<CredentialReviewStats>(
        `${ENDPOINT}/stats`,
      );
      if (response.error) {
        console.error("Error fetching credential stats:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error fetching credential stats:", error);
      return null;
    }
  },

  /**
   * Get single credential by ID
   * GET /credentials/:id
   */
  async getCredential(id: string): Promise<PendingCredential | null> {
    try {
      const response = await api.get<PendingCredential>(`${ENDPOINT}/${id}`);
      if (response.error) {
        console.error("Error fetching credential:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error fetching credential:", error);
      return null;
    }
  },

  /**
   * Approve a credential submission
   * POST /credentials/:id/approve
   */
  async approveCredential(
    input: ApproveCredentialInput,
  ): Promise<PendingCredential | null> {
    try {
      const response = await api.post<PendingCredential>(
        `${ENDPOINT}/${input.credentialId}/approve`,
        {},
      );
      if (response.error) {
        console.error("Error approving credential:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error approving credential:", error);
      return null;
    }
  },

  /**
   * Reject a credential submission with reason
   * POST /credentials/:id/reject
   */
  async rejectCredential(
    input: RejectCredentialInput,
  ): Promise<PendingCredential | null> {
    try {
      const response = await api.post<PendingCredential>(
        `${ENDPOINT}/${input.credentialId}/reject`,
        { reason: input.reason },
      );
      if (response.error) {
        console.error("Error rejecting credential:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error rejecting credential:", error);
      return null;
    }
  },

  /**
   * Search credentials by query
   * GET /credentials/search?q=query
   */
  async searchCredentials(query: string): Promise<PendingCredential[] | null> {
    try {
      const response = await api.get<PendingCredential[]>(
        `${ENDPOINT}/search?q=${query}`,
      );
      if (response.error) {
        console.error("Error searching credentials:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error searching credentials:", error);
      return null;
    }
  },

  /**
   * Get credentials by type
   * GET /credentials/type/:type
   */
  async getCredentialsByType(
    type: "education" | "certificate" | "experience",
  ): Promise<PendingCredential[] | null> {
    try {
      const response = await api.get<PendingCredential[]>(
        `${ENDPOINT}/type/${type}`,
      );
      if (response.error) {
        console.error("Error fetching credentials by type:", response.error);
        return null;
      }
      return response.data || null;
    } catch (error) {
      console.error("Error fetching credentials by type:", error);
      return null;
    }
  },
};
