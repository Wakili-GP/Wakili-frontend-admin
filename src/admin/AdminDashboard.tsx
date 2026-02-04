import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  UserCheck,
  Calendar,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Bell,
  UserPlus,
  Shield,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";

const stats = [
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

const recentActivities = [
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

const notifications = [
  { type: "email", count: 45, label: "رسائل مُرسلة اليوم" },
  { type: "notification", count: 128, label: "إشعارات مُرسلة اليوم" },
];

interface Admin {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "moderator";
  createdAt: string;
  status: "active" | "inactive";
}

const initialAdmins: Admin[] = [
  {
    id: "1",
    name: "المشرف الرئيسي",
    email: "admin@wakili.me",
    role: "super_admin",
    createdAt: "2024-01-01",
    status: "active",
  },
  {
    id: "2",
    name: "أحمد محمد",
    email: "ahmed@wakili.me",
    role: "admin",
    createdAt: "2024-03-15",
    status: "active",
  },
  {
    id: "3",
    name: "سارة علي",
    email: "sara@wakili.me",
    role: "moderator",
    createdAt: "2024-06-20",
    status: "active",
  },
];

const AdminDashboard = () => {
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin" as "super_admin" | "admin" | "moderator",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!newAdmin.name.trim()) errors.name = "الاسم مطلوب";
    if (!newAdmin.email.trim()) errors.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdmin.email))
      errors.email = "بريد إلكتروني غير صالح";
    if (admins.some((a) => a.email === newAdmin.email))
      errors.email = "البريد الإلكتروني مستخدم بالفعل";
    if (!newAdmin.password) errors.password = "كلمة المرور مطلوبة";
    else if (newAdmin.password.length < 8)
      errors.password = "يجب أن تكون 8 أحرف على الأقل";
    if (newAdmin.password !== newAdmin.confirmPassword)
      errors.confirmPassword = "كلمات المرور غير متطابقة";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAdmin = () => {
    if (!validateForm()) return;

    const admin: Admin = {
      id: Date.now().toString(),
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
    };

    setAdmins([...admins, admin]);
    setNewAdmin({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "admin",
    });
    setShowAddAdminModal(false);
    toast.success("تمت إضافة المشرف بنجاح");
  };

  const handleDeleteAdmin = (id: string) => {
    const admin = admins.find((a) => a.id === id);
    if (admin?.role === "super_admin") {
      toast.error("لا يمكن حذف المشرف الرئيسي");
      return;
    }
    setAdmins(admins.filter((a) => a.id !== id));
    toast.success("تم حذف المشرف");
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return (
          <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/20">
            مشرف رئيسي
          </Badge>
        );
      case "admin":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/20">
            مشرف
          </Badge>
        );
      case "moderator":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20">
            مراقب
          </Badge>
        );
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">نظرة عامة</h1>
          <p className="text-slate-400 mt-1">مرحباً بك في لوحة تحكم المشرف</p>
        </div>
        <Button
          onClick={() => setShowAddAdminModal(true)}
          className="cursor-pointer bg-primary hover:bg-primary/90"
        >
          <UserPlus className="w-4 h-4 ml-2" />
          إضافة مشرف جديد
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.title}</p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400">
                      {stat.change}
                    </span>
                    <span className="text-xs text-slate-500">
                      من الشهر الماضي
                    </span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-linear-to-br ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              النشاط الأخير
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.status === "success"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : activity.status === "pending"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-red-500/10 text-red-400"
                  }`}
                >
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{activity.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
                <Badge
                  variant={
                    activity.status === "success"
                      ? "default"
                      : activity.status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                  className="text-xs"
                >
                  {activity.status === "success"
                    ? "مكتمل"
                    : activity.status === "pending"
                      ? "معلق"
                      : "مُبلغ عنه"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          {/* Notification Stats */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                حالة الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notifications.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    {item.type === "email" ? (
                      <Mail className="w-5 h-5 text-blue-400" />
                    ) : (
                      <Bell className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {item.count}
                    </p>
                    <p className="text-xs text-slate-400">{item.label}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" />
                حالة الحسابات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-slate-300">محامون نشطون</span>
                  </div>
                  <span className="font-bold text-white">342</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-slate-300">
                      في انتظار التوثيق
                    </span>
                  </div>
                  <span className="font-bold text-white">23</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-slate-300">حسابات معلقة</span>
                  </div>
                  <span className="font-bold text-white">5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Admins Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            إدارة المشرفين
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-900/50">
                <TableHead className="text-slate-400 text-center">
                  الاسم
                </TableHead>
                <TableHead className="text-slate-400 text-center">
                  البريد الإلكتروني
                </TableHead>
                <TableHead className="text-slate-400 text-center">
                  الدور
                </TableHead>
                <TableHead className="text-slate-400 text-center">
                  تاريخ الإضافة
                </TableHead>
                <TableHead className="text-slate-400 text-center">
                  الحالة
                </TableHead>
                <TableHead className="text-slate-400 text-center">
                  الإجراءات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {admins.map((admin) => (
                <TableRow
                  key={admin.id}
                  className="border-slate-700 hover:bg-slate-900/50"
                >
                  <TableCell className="text-white font-medium">
                    {admin.name}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {admin.email}
                  </TableCell>
                  <TableCell>{getRoleBadge(admin.role)}</TableCell>
                  <TableCell className="text-slate-400">
                    {admin.createdAt}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        admin.status === "active"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }
                    >
                      {admin.status === "active" ? "نشط" : "غير نشط"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAdmin(admin.id)}
                      disabled={admin.role === "super_admin"}
                      className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Admin Modal */}
      <Dialog open={showAddAdminModal} onOpenChange={setShowAddAdminModal}>
        <DialogContent className="bg-slate-800 border-slate-700" dir="rtl">
          <DialogHeader className="mt-4">
            <DialogTitle className="text-white flex items-center justify-center gap-2">
              <UserPlus className="w-5 h-5 text-white" />
              إضافة مشرف جديد
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-center">
              أدخل بيانات المشرف الجديد لإضافته إلى النظام
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-slate-300">الاسم الكامل</Label>
              <Input
                value={newAdmin.name}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, name: e.target.value })
                }
                placeholder="أدخل اسم المشرف"
                className={`bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 ${formErrors.name ? "border-red-500" : ""}`}
              />
              {formErrors.name && (
                <p className="text-sm text-red-400">{formErrors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">البريد الإلكتروني</Label>
              <Input
                type="email"
                value={newAdmin.email}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, email: e.target.value })
                }
                placeholder="example@wakili.me"
                className={`bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 ${formErrors.email ? "border-red-500" : ""}`}
              />
              {formErrors.email && (
                <p className="text-sm text-red-400">{formErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">كلمة المرور</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newAdmin.password}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, password: e.target.value })
                  }
                  placeholder="أدخل كلمة مرور قوية"
                  className={`bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 pl-10 ${formErrors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-sm text-red-400">{formErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">تأكيد كلمة المرور</Label>
              <Input
                type="password"
                value={newAdmin.confirmPassword}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })
                }
                placeholder="أعد إدخال كلمة المرور"
                className={`bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 ${formErrors.confirmPassword ? "border-red-500" : ""}`}
              />
              {formErrors.confirmPassword && (
                <p className="text-sm text-red-400">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">الدور</Label>
              <Select
                dir="rtl"
                value={newAdmin.role}
                onValueChange={(value: "super_admin" | "admin" | "moderator") =>
                  setNewAdmin({ ...newAdmin, role: value })
                }
              >
                <SelectTrigger className="cursor-pointer bg-slate-900 border-slate-600 text-white w-40">
                  <SelectValue placeholder="اختر الدور" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem
                    value="admin"
                    className="cursor-pointer text-white hover:bg-slate-700"
                  >
                    مشرف
                  </SelectItem>
                  <SelectItem
                    value="moderator"
                    className="cursor-pointer text-white hover:bg-slate-700"
                  >
                    مراقب
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6 gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddAdminModal(false)}
              className="cursor-pointer border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleAddAdmin}
              className="cursor-pointer bg-primary hover:bg-primary/10"
            >
              إضافة المشرف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
