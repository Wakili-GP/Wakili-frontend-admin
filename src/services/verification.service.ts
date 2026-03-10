import httpClient from "@/lib/HttpClient";
export interface VerificationFace {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specializations: string;
  profileImageUrl: string;
  submittedAt: string;
  status: "Pending" | "Approved" | "Rejected";
}

const BASE = "Lawyers/lawyer-verification";
const verificationService = {
  // Pending = 0,
  // Approved = 1,
  // Rejected = 2
  getVerificationRequests: async (
    status?: number,
  ): Promise<VerificationFace[]> => {
    const response = await httpClient.get<VerificationFace[]>(BASE, {
      params: status !== undefined ? { status } : {},
    });
    return response.data.data;
  },
};
export default verificationService;
