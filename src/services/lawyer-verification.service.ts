/**
 * Lawyer Verification API Service
 * Handles all lawyer verification-related API calls
 */

import { api } from "@/lib/api-client";
import type {
  VerificationRequest,
  ApproveVerificationInput,
  RejectVerificationInput,
} from "@/lib/api-types";

export const lawyerVerificationApi = {
  /**
   * Get all lawyer verification requests
   * GET /lawyer-verification
   */
  getVerificationRequests: async (
    status?: string,
  ): Promise<VerificationRequest[] | null> => {
    const response = await api.get<VerificationRequest[]>(
      "/lawyer-verification",
      status ? { status } : undefined,
    );
    if (response.error) {
      console.error("Error fetching verification requests:", response.error);
      return null;
    }
    return response.data || null;
  },

  /**
   * Get a single verification request
   * GET /lawyer-verification/:id
   */
  getVerificationRequest: async (
    id: string,
  ): Promise<VerificationRequest | null> => {
    const response = await api.get<VerificationRequest>(
      `/lawyer-verification/${id}`,
    );
    if (response.error) {
      console.error("Error fetching verification request:", response.error);
      return null;
    }
    return response.data || null;
  },

  /**
   * Approve a lawyer verification request
   * POST /lawyer-verification/:id/approve
   */
  approveVerification: async (
    input: ApproveVerificationInput,
  ): Promise<VerificationRequest | null> => {
    const response = await api.post<VerificationRequest>(
      `/lawyer-verification/${input.requestId}/approve`,
      { notes: input.notes },
    );
    if (response.error) {
      console.error("Error approving verification:", response.error);
      return null;
    }
    return response.data || null;
  },

  /**
   * Reject a lawyer verification request
   * POST /lawyer-verification/:id/reject
   */
  rejectVerification: async (
    input: RejectVerificationInput,
  ): Promise<VerificationRequest | null> => {
    const response = await api.post<VerificationRequest>(
      `/lawyer-verification/${input.requestId}/reject`,
      { reason: input.reason },
    );
    if (response.error) {
      console.error("Error rejecting verification:", response.error);
      return null;
    }
    return response.data || null;
  },

  /**
   * Search verification requests
   * GET /lawyer-verification/search
   */
  searchVerificationRequests: async (
    query: string,
  ): Promise<VerificationRequest[] | null> => {
    const response = await api.get<VerificationRequest[]>(
      "/lawyer-verification/search",
      { q: query },
    );
    if (response.error) {
      console.error("Error searching verification requests:", response.error);
      return null;
    }
    return response.data || null;
  },
};
