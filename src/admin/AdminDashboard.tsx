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
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAdminSchema,
  type CreateAdminFormData,
} from "@/validation/admin.schema";
import AdminServices from "@/services/admins.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
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

const AdminDashboard = () => {
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);

  // Form Setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAdminFormData>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Fetching Admins
  const {
    data: admins,
    isLoading: adminsLoading,
    error: adminsError,
  } = useQuery({
    queryKey: ["admins"],
    queryFn: () => AdminServices.getAllAdmins(),
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();

  // Creating a new admin
  const createAdminMutation = useMutation({
    mutationKey: ["admins", "create"],
    mutationFn: (input: CreateAdminFormData) =>
      AdminServices.createAdmin({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: input.password,
        role: "Admin",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("تمت إضافة المشرف بنجاح");
      reset();
      setShowAddAdminModal(false);
    },
    onError: (error: Error) => {
      console.error("Error creating admin", error);
      toast.error("حدث خطأ أثناء إضافة المشرف");
    },
  });

  const deleteAdminMutation = useMutation({
    mutationKey: ["admins", "delete"],
    mutationFn: (id: string) => AdminServices.deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      toast.success("تم حذف المشرف");
    },
    onError: (error: Error) => {
      console.error("Error deleting admin", error);
      toast.error("حدث خطأ أثناء حذف المشرف");
    },
  });

  const handleDeleteAdmin = (id: string) => {
    setAdminToDelete(id);
  };
  const confirmDelete = () => {
    if (adminToDelete) {
      deleteAdminMutation.mutate(adminToDelete);
      setAdminToDelete(null);
    }
  };

  // const getRoleBadge = (role: string) => {
  //   switch (role.toLowerCase()) {
  //     case "Admin":
  //       return (
  //         <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
  //           مشرف رئيسي
  //         </Badge>
  //       );
  //     case "Moderator":
  //       return (
  //         <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
  //           مشرف
  //         </Badge>
  //       );
  //     default:
  //       return <Badge variant="secondary">{role}</Badge>;
  //   }
  // };

  if (adminsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Spinner className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (adminsError) {
    return (
      <Card className="bg-red-500/10 border-red-500/20">
        <CardContent className="p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-red-300">{adminsError?.message}</p>
        </CardContent>
      </Card>
    );
  }

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
                className="flex items-start gap-4 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:bg-slate-900/70 transition-colors duration-200"
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
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-colors duration-200"
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
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-colors duration-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-slate-300">محامون نشطون</span>
                  </div>
                  <span className="font-bold text-white">342</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-colors duration-200">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-slate-300">
                      في انتظار التوثيق
                    </span>
                  </div>
                  <span className="font-bold text-white">23</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-colors duration-200">
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
              <TableRow className="border-slate-700 bg-slate-800/50">
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
            <TableBody>
              {admins?.map((admin) => (
                <TableRow
                  key={admin.id}
                  className="border-slate-700 hover:bg-slate-900/70 transition-colors duration-200 cursor-pointer"
                >
                  <TableCell className="text-white font-medium text-center">
                    {admin.firstName} {admin.lastName}
                  </TableCell>
                  <TableCell className="text-slate-300 text-center">
                    {admin.email}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                      مشرف رئيسي
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400 text-center">
                    {new Date(admin.createdAt).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={
                        admin.status === "Active"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }
                    >
                      {admin.status === "Active" ? "نشط" : "غير نشط"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAdmin(admin.id)}
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
              <UserPlus className="w-5 h-5" />
              إضافة مشرف جديد
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-center">
              أدخل بيانات المشرف الجديد لإضافته إلى النظام
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit((data) => createAdminMutation.mutate(data))}
          >
            <div className="space-y-4 mt-4">
              {/* Name Row */}
              <div className="space-y-2">
                <Label className="text-slate-300">الاسم</Label>
                <div className="flex gap-4">
                  {/* First Name */}
                  <div className="flex-1">
                    <Input
                      {...register("firstName")}
                      placeholder="الاسم الأول"
                      className={`bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 ${
                        errors.firstName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-400">
                        {errors.firstName?.message}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="flex-1">
                    <Input
                      {...register("lastName")}
                      placeholder="اسم العائلة"
                      className={`bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 ${
                        errors.lastName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-400">
                        {errors.lastName?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-slate-300">البريد الإلكتروني</Label>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="example@wakili.me"
                  className={`bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-400">
                    {errors.email?.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-slate-300">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="أدخل كلمة مرور قوية"
                    className={`bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 pl-10 ${
                      errors.password ? "border-red-500" : ""
                    }`}
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
                {errors.password && (
                  <p className="text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label className="text-slate-300">تأكيد كلمة المرور</Label>
                <Input
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="أعد إدخال كلمة المرور"
                  className={`bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400">
                    {errors.confirmPassword?.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="mt-6 flex justify-center gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => setShowAddAdminModal(false)}
                className="cursor-pointer border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors duration-200"
              >
                إلغاء
              </Button>

              <Button
                type="submit"
                className="cursor-pointer bg-emerald-600 text-white hover:bg-emerald-500 transition-colors duration-200"
                disabled={createAdminMutation.isPending}
              >
                {createAdminMutation.isPending
                  ? "جاري الإضافة..."
                  : "إضافة المشرف"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Confirm Delete Admin */}
      <Dialog
        open={!!adminToDelete}
        onOpenChange={() => setAdminToDelete(null)}
      >
        <DialogContent className="bg-slate-800 border-slate-700" dir="rtl">
          <DialogHeader className="mt-4">
            <DialogTitle className="text-white text-center">
              تأكيد الحذف
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-center">
              هل أنت متأكد من حذف هذا المشرف؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex justify-center items-center gap-3">
            <Button variant="outline" onClick={() => setAdminToDelete(null)}>
              إلغاء
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleteAdminMutation.isPending}
              variant="destructive"
            >
              {deleteAdminMutation.isPending ? "جاري الحذف..." : "تأكيد الحذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
