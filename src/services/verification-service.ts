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
export interface Education {
  degreeType: string;
  fieldOfStudy: string;
  university: string;
  graduationYear: string;
}
export interface Certification {
  name: string;
  issuingOrg: string;
  yearObtained: string;
  documentUrl: string;
}
export interface WorkExperience {
  jobTitle: string;
  organizationName: string;
  startYear: string;
  endYear: string;
  isCurrentJob: boolean;
  description: string;
}
export interface VerificationRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialty: string[];
  submittedAt: string;
  status: "Pending" | "Approved" | "Rejected";
  profileImage: string | null;
  bio: string;
  location: {
    country: string;
    city: string;
  };
  yearsExperience: number;
  sessionTypes: string[];
  education: Education[];
  certifications: Certification[];
  workExperience: WorkExperience[];
  documents: {
    governmentId: boolean;
    governmentIdUrl: string;
    professionalLicense: boolean;
    professionalLicenseUrl: string;
    identityVerification: boolean;
    educationCertificates: { name: string; url: string }[];
  };
  licenseNumber: string;
  issuingAuthority: string;
  licenseYear: string;
  barNumber: string | null;
}

const BASE = "Lawyers/lawyer-verification";
const verificationService = {
  // status: 0 = Pending, 1 = UnderReview, 2 = Approved, 3 = Rejected

  getVerificationRequests: async (
    status?: number,
  ): Promise<VerificationFace[]> => {
    const response = await httpClient.get<ApiResponse<VerificationFace[]>>(
      BASE,
      {
        params: status !== undefined ? { status } : {},
      },
    );
    console.log("Verification Requests Response:", response.data);
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
};
export default verificationService;
