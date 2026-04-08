import httpClient from "@/lib/HttpClient";

interface ApiResponse<T> {
  data: T;
}

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
  // Pending = 0,
  // Approved = 1,
  // Rejected = 2
  getVerificationRequests: async (
    status?: number,
  ): Promise<VerificationFace[]> => {
    const response = await httpClient.get<ApiResponse<VerificationFace[]>>(
      BASE,
      {
        params: status !== undefined ? { status } : {},
      },
    );
    return response.data.data;
  },
  getVerificationRequestById: async (
    id: string,
  ): Promise<VerificationRequest> => {
    const response = await httpClient.get<ApiResponse<VerificationRequest>>(
      `${BASE}/${id}`,
    );
    return response.data.data;
  },
};
export default verificationService;
