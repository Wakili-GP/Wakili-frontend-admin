import httpClient from "@/services/api/HttpClient";

interface ApiResponse<T> {
  data: T;
}
// status: 0 = Pending, 1 = UnderReview, 2 = Approved, 3 = Rejected
export interface VerificationFace {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specializations: string[];
  profileImageUrl: string;
  submittedAt: string | null;
  status: "Pending" | "UnderReview" | "Approved" | "Rejected";
  approvedBy: string | null;
  approvedAt: string | null;
  rejectedBy: string | null;
  rejectedAt: string | null;
}

export interface Meta {
  total: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
}
export interface VerificationRequestsTable {
  items: VerificationFace[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalItems: number;
  totalPages: number;
  meta: Meta;
}
export interface Education {
  degreeType: string;
  fieldOfStudy: string;
  university: string;
  graduationYear: string;
  document: string;
}
export interface Certification {
  name: string;
  issuingOrg: string;
  yearObtained: string;
  document: string;
}
export interface WorkExperience {
  jobTitle: string;
  organizationName: string;
  startYear: string;
  endYear: string;
  isCurrentJob: boolean;
  description: string;
}

interface Verification {
  nationalIdFront: string;
  nationalIdBack: string;
  lawyerLicense: string;
  lawyerLicenseNumber: string;
  lawyerLicenseIssuingAuthority: string;
  lawyerLicenseYearOfIssue: string;
}
export interface VerificationRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string[];
  submittedAt: string;
  status: "Pending" | "UnderReview" | "Approved" | "Rejected";
  profileImage: string | null;
  bio: string;
  location: {
    country: string;
    city: string;
  };
  yearsExperience: number;
  sessionTypes: number[];
  education: Education[];
  certifications: Certification[];
  workExperience: WorkExperience[];
  verification: Verification;
}

const BASE = "Lawyers/lawyer-verification";
const verificationService = {
  // status: 0 = Pending, 1 = UnderReview, 2 = Approved, 3 = Rejected
  // DateFilter: 0 = All, 1 = Last 24 hours, 2 = Last 7 days, 3 = Last 30 days, 4 = Last Year
  getVerificationRequests: async (
    page?: number,
    pageSize?: number,
    searchTerm?: string,
    status?: number,
    SortDescending?: boolean, // true or false
    DateFilter?: number,
  ): Promise<VerificationRequestsTable> => {
    const response = await httpClient.get<
      ApiResponse<VerificationRequestsTable>
    >(BASE, {
      params: {
        Page: page !== undefined ? page : undefined,
        PageSize: pageSize !== undefined ? pageSize : undefined,
        SearchTerm: searchTerm !== undefined ? searchTerm : undefined,
        Status: status !== undefined ? status : undefined,
        SortDescending:
          SortDescending !== undefined ? SortDescending : undefined,
        DateFilter: DateFilter !== undefined ? DateFilter : undefined,
      },
    });
    console.log("Verification Requests Response:", response.data.data);
    return response.data.data;
  },
  getVerificationRequestById: async (
    id: string,
  ): Promise<VerificationRequest> => {
    const response = await httpClient.get<ApiResponse<VerificationRequest>>(
      `${BASE}/${id}`,
    );
    console.log("Verification Request Response:", response.data);
    return response.data.data;
  },

  rejectVerificationRequest: async (id: string, reason: string) => {
    await httpClient.put(`Lawyers/verify/reject/${id}`, { note: reason });
  },
  approveVerificationRequest: async (id: string) => {
    await httpClient.put(`Lawyers/verify/approve/${id}`);
  },
};
export default verificationService;
