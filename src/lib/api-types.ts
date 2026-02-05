/**
 * Dashboard API Types
 */

export interface DashboardStat {
  title: string;
  value: string | number;
  change: string;
  color: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface Activity {
  id?: string;
  type: "verification" | "review" | "user" | "appointment" | string;
  message: string;
  time: string;
  status: "pending" | "flagged" | "success" | "warning";
}

export interface Notification {
  type: string;
  count: number;
  label: string;
}

export interface AccountStatus {
  activeLawyers: number;
  pendingVerification: number;
  suspendedAccounts: number;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "moderator";
  createdAt: string;
  status: "active" | "inactive";
}

export interface CreateAdminInput {
  name: string;
  email: string;
  password: string;
  role: "super_admin" | "admin" | "moderator";
}

export interface DashboardData {
  stats: DashboardStat[];
  recentActivities: Activity[];
  notifications: Notification[];
  admins: Admin[];
  accountStatus?: AccountStatus;
}

/**
 * Lawyer Verification Types
 */

export interface VerificationDocument {
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
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
  documentUrl?: string;
}

export interface WorkExperience {
  jobTitle: string;
  organization: string;
  startYear: string;
  endYear: string;
  isCurrent: boolean;
  description: string;
}

export interface VerificationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string[];
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  profileImage: string;
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
    governmentIdUrl?: string;
    professionalLicense: boolean;
    professionalLicenseUrl?: string;
    identityVerification: boolean;
    educationCertificates: VerificationDocument[];
  };
  licenseNumber: string;
  issuingAuthority: string;
  licenseYear: string;
  barNumber: string;
}

export interface ApproveVerificationInput {
  requestId: string;
  notes?: string;
}

export interface RejectVerificationInput {
  requestId: string;
  reason: string;
}

/**
 * Review Moderation API Types
 */

export interface Review {
  id: string;
  clientName: string;
  lawyerName: string;
  rating: number;
  content: string;
  createdAt: string;
  status: "visible" | "hidden" | "flagged";
  flagReason?: string;
}

export interface ReviewModerationStats {
  totalReviews: number;
  visibleReviews: number;
  flaggedReviews: number;
  hiddenReviews: number;
}

export interface UpdateReviewStatusInput {
  reviewId: string;
  status: "visible" | "hidden" | "flagged";
}

export interface ApproveReviewInput {
  reviewId: string;
}

export interface DeleteReviewInput {
  reviewId: string;
}

/**
 * User Management API Types
 */

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  type: "client" | "lawyer";
  status: "active" | "suspended";
  createdAt: string;
  lastActive: string;
  specialty?: string;
  totalAppointments?: number;
}

export interface UserManagementStats {
  totalUsers: number;
  totalClients: number;
  totalLawyers: number;
  suspendedUsers: number;
}

export interface SuspendUserInput {
  userId: string;
  reason?: string;
}

export interface ReinstateUserInput {
  userId: string;
}

/**
 * Credential Review API Types
 */

export interface PendingCredential {
  id: string;
  lawyerId: string;
  lawyerName: string;
  lawyerImage: string;
  type: "education" | "certificate" | "experience";
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  // Education fields
  degree?: string;
  field?: string;
  university?: string;
  year?: string;
  diplomaUrl?: string;
  // Certificate fields
  certName?: string;
  certIssuer?: string;
  certYear?: string;
  certDocumentUrl?: string;
  // Experience fields
  expTitle?: string;
  expCompany?: string;
  expStartYear?: string;
  expEndYear?: string;
  expDescription?: string;
}

export interface CredentialReviewStats {
  totalCredentials: number;
  pendingCredentials: number;
  approvedCredentials: number;
  rejectedCredentials: number;
}

export interface ApproveCredentialInput {
  credentialId: string;
}

export interface RejectCredentialInput {
  credentialId: string;
  reason: string;
}
