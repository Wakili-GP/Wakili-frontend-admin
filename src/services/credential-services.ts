import httpClient from "@/services/api/HttpClient";

interface ApiResponse<T> {
  data: T;
}

export type CredentialType = "Education" | "Certification" | "WorkExperience";
export type CredentialStatus = "Pending" | "Approved" | "Rejected";

export interface CredentialItem {
  id: string;
  lawyerId: string;
  lawyerFirstName: string;
  lawyerLastName: string;
  lawyerEmail: string;
  lawyerProfileImage: string | null;
  type: CredentialType;
  submittedAt: string;
  status: CredentialStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;

  // Education
  degree?: string;
  fieldOfStudy?: string;
  university?: string;
  graduationYear?: string;
  documentUrl?: string;

  // Certification
  certName?: string;
  certIssuer?: string;
  certYear?: string;
  certDocumentUrl?: string;

  // Experience
  jobTitle?: string;
  organizationName?: string;
  startYear?: string;
  endYear?: string;
  isCurrentJob?: boolean;
  description?: string;
}

export interface CredentialsMeta {
  totalEducation: number;
  totalCertifications: number;
  totalExperience: number;
}

export interface CredentialsResponse {
  items: CredentialItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  meta: CredentialsMeta;
}

/* ─── Service ─── */

const BASE = "Lawyers/credentials";

const credentialService = {
  /**
   * Fetch paginated credentials with optional filters.
   * Status: "Pending" | "Approved" | "Rejected"
   * Type  : "Education" | "Certification" | "WorkExperience"
   */
  getCredentials: async (
    page?: number,
    pageSize?: number,
    searchTerm?: string,
    type?: string,
    status?: string,
    sortDescending?: boolean,
  ): Promise<CredentialsResponse> => {
    const response = await httpClient.get<ApiResponse<CredentialsResponse>>(
      BASE,
      {
        params: {
          Page: page,
          PageSize: pageSize,
          SearchTerm: searchTerm || undefined,
          Type: type || undefined,
          Status: status || undefined,
          SortDescending: sortDescending,
        },
      },
    );
    return response.data.data;
  },

  /** Fetch a single credential by ID. */
  getCredentialById: async (id: string): Promise<CredentialItem> => {
    const response = await httpClient.get<ApiResponse<CredentialItem>>(
      `${BASE}/${id}`,
    );
    return response.data.data;
  },

  /** Approve a credential. */
  approveCredential: async (id: string): Promise<void> => {
    await httpClient.put(`${BASE}/approve/${id}`);
  },

  /** Reject a credential with a reason note. */
  rejectCredential: async (id: string, reason: string): Promise<void> => {
    await httpClient.put(`${BASE}/reject/${id}`, { note: reason });
  },
};

export default credentialService;
