import httpClient from "@/services/api/HttpClient";
import type { ForumPost, PaginatedForumResponse, ForumSearchParams } from "@/types/forum.types";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

const BASE = "/Forums";

export const forumService = {
  /**
   * Admin endpoint: Gets all posts including Pending and Rejected statuses
   */
  getAdminPosts: async (params?: ForumSearchParams): Promise<ApiResponse<PaginatedForumResponse<ForumPost>>> => {
    try {
      const res = await httpClient.get(`${BASE}/admin/posts`, { params });
      return { success: true, data: res.data.data };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },

  /**
   * Admin endpoint: Approve, Reject or set Pending status for a post
   */
  changePostStatus: async (postId: string, status: "Pending" | "Approved" | "Rejected"): Promise<ApiResponse<void>> => {
    try {
      if (status === "Approved") {
        await httpClient.post(`${BASE}/admin/posts/${postId}/approve`);
      } else if (status === "Rejected") {
        await httpClient.post(`${BASE}/admin/posts/${postId}/reject`);
      } else {
        // Fallback or handle pending if needed, currently not supported in new endpoints
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },
};
