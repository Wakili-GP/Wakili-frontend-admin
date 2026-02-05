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
