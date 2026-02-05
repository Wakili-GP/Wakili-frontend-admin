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
