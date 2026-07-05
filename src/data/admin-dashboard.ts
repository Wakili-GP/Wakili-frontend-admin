import {
  Users,
  UserCheck,
  Calendar,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import type { CredentialItem } from "@/services/credential-services";
export const stats = [
  {
    title: "إجمالي المستخدمين",
    value: "2,847",
    change: "+12%",
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "طلبات التوثيق المعلقة",
    value: "23",
    change: "-5%",
    icon: UserCheck,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "المواعيد هذا الشهر",
    value: "1,284",
    change: "+18%",
    icon: Calendar,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "المراجعات الجديدة",
    value: "156",
    change: "+8%",
    icon: MessageSquare,
    color: "bg-purple-50 text-purple-600",
  },
];

export const recentActivities = [
  {
    type: "verification",
    message: "طلب توثيق جديد من المحامي أحمد محمد",
    time: "منذ 5 دقائق",
    icon: UserCheck,
    status: "pending",
  },
  {
    type: "review",
    message: "تم الإبلاغ عن مراجعة للمحامي سارة أحمد",
    time: "منذ 15 دقيقة",
    icon: MessageSquare,
    status: "flagged",
  },
  {
    type: "user",
    message: "تم تسجيل عميل جديد: محمد علي",
    time: "منذ 30 دقيقة",
    icon: Users,
    status: "success",
  },
  {
    type: "appointment",
    message: "تم إكمال 15 جلسة استشارية اليوم",
    time: "منذ ساعة",
    icon: Calendar,
    status: "success",
  },
  {
    type: "verification",
    message: "تمت الموافقة على توثيق المحامي خالد عبدالله",
    time: "منذ ساعتين",
    icon: CheckCircle,
    status: "success",
  },
];
export const notifications = [
  { type: "email", count: 45, label: "رسائل مُرسلة اليوم" },
  { type: "notification", count: 128, label: "إشعارات مُرسلة اليوم" },
];

export const mockCredentialPreview: CredentialItem = {
  id: "mock-credential-1",
  lawyerId: "mock-lawyer-1",
  lawyerFirstName: "أحمد",
  lawyerLastName: "السيد",
  lawyerEmail: "ahmad.alsayed@example.com",
  lawyerProfileImage: null,
  type: "Education",
  submittedAt: "2026-04-20T10:30:00.000Z",
  status: "Pending",
  reviewedBy: null,
  reviewedAt: null,
  rejectionReason: null,
  degree: "بكالوريوس قانون",
  fieldOfStudy: "القانون العام",
  university: "جامعة القاهرة",
  graduationYear: "2022",
  documentUrl: "#",
};
