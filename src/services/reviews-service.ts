import httpClient from "@/services/api/HttpClient";

export type UserDetails = {
  firstName: string;
  lastName: string;
  profileImageUrl: string | null;
  email: string | null;
  phoneNumber: string | null;
};

export type LawyerDetails = {
  firstName: string;
  lastName: string;
  profileImageUrl: string | null;
};

export type Review = {
  id: string;
  userId: string;
  lawyerId: string;
  appointmentId: string;
  rating: number;
  comment: string;
  createdAt: string;

  aiComment?: string | null;
  aiConfidenceRate?: number | null;
  aiProcessedAt?: string | null;
  aiStatus: string;
  visibility: string;

  client: UserDetails;
  lawyer?: LawyerDetails;
};

export const reviewsService = {
  getAllReviews: async (): Promise<Review[]> => {
    const response = await httpClient.get('/reviews/admin');
    return response.data.data;
  },

  retryModeration: async (id: string): Promise<void> => {
    const response = await httpClient.post(`/reviews/${id}/retry-moderation`);
    return response.data;
  },

  approveReview: async (id: string): Promise<void> => {
    const response = await httpClient.post(`/reviews/${id}/approve`);
    return response.data;
  },

  hideReview: async (id: string): Promise<void> => {
    const response = await httpClient.post(`/reviews/${id}/hide`);
    return response.data;
  }
};
