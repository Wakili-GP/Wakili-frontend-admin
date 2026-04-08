import {
  Users,
  UserCheck,
  Calendar,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
export const stats = [
  {
    title: "إجمالي المستخدمين",
    value: "2,847",
    change: "+12%",
    icon: Users,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "طلبات التوثيق المعلقة",
    value: "23",
    change: "-5%",
    icon: UserCheck,
    color: "from-amber-500 to-amber-600",
  },
  {
    title: "المواعيد هذا الشهر",
    value: "1,284",
    change: "+18%",
    icon: Calendar,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    title: "المراجعات الجديدة",
    value: "156",
    change: "+8%",
    icon: MessageSquare,
    color: "from-purple-500 to-purple-600",
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
