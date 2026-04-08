import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Search,
  Eye,
  Ban,
  FolderOpen,
  Trash2,
  Briefcase,
  User,
  MoreVertical,
  RefreshCw,
  Delete,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import UserService, { type User as UserType } from "@/services/users-service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const UserManagement = () => {
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToToggle, setUserToToggle] = useState<UserType | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // Seach Query and Active Tabs
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Getting All Users
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => UserService.getUsers(),
  });

  const queryClient = useQueryClient();

  // Deleting a User
  const deleteUserMutation = useMutation({
    mutationKey: ["users", "delete"],
    mutationFn: (id: string) => UserService.deleteUser(id),
    onSuccess: () => {
      toast.success("تم حذف المستخدم بنجاح");
      setUserToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حذف المستخدم. حاول مرة أخرى.");
    },
  });

  // Toggling User Status
  const toggleUserStatusMutation = useMutation({
    mutationKey: ["users", "toggleStatus"],
    mutationFn: (id: string) => UserService.toggleUserStatus(id),
    onSuccess: () => {
      toast.success("تم تحديث حالة المستخدم بنجاح");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setUserToToggle(null);
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث حالة المستخدم. حاول مرة أخرى.");
    },
  });
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">إدارة المستخدمين</h1>
        <p className="text-slate-400 mt-1">
          عرض وإدارة حسابات العملاء والمحامين
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{users.length}</p>
              <p className="text-sm text-slate-400">إجمالي المستخدمين</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {users.filter((u) => u.userType === "Client").length}
              </p>
              <p className="text-sm text-slate-400">عملاء</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {users.filter((u) => u.userType === "Lawyer").length}
              </p>
              <p className="text-sm text-slate-400">محامون</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Ban className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {users.filter((u) => u.status !== "Active").length}
              </p>
              <p className="text-sm text-slate-400">معلقون</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Search */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <Tabs
              dir="rtl"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full md:w-auto"
            >
              <TabsList className="bg-slate-900/50">
                <TabsTrigger className="cursor-pointer" value="all">
                  الكل
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="clients">
                  العملاء
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="lawyers">
                  المحامون
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="suspended">
                  المعلقون
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full md:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="البحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-slate-900/50 border-slate-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            قائمة المستخدمين
          </CardTitle>
        </CardHeader>
        <CardContent>
          {users ? (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-900/50">
                  <TableHead className="text-slate-400 text-right">
                    المستخدم
                  </TableHead>
                  <TableHead className="text-slate-400 text-center">
                    النوع
                  </TableHead>
                  <TableHead className="text-slate-400 text-center">
                    رقم الهاتف
                  </TableHead>
                  <TableHead className="text-slate-400 text-center">
                    تاريخ التسجيل
                  </TableHead>
                  <TableHead className="text-slate-400 text-center">
                    آخر نشاط
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
                {users?.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-slate-700 hover:bg-slate-900/50"
                  >
                    <TableCell className="text-white font-medium text-right w-54">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            user.userType === "Lawyer"
                              ? "bg-purple-500/20"
                              : "bg-blue-500/20"
                          }`}
                        >
                          {user.userType === "Lawyer" ? (
                            <Briefcase className="w-5 h-5 text-purple-400" />
                          ) : (
                            <User className="w-5 h-5 text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300 text-center">
                      <Badge
                        variant="outline"
                        className={
                          user.userType === "Lawyer"
                            ? "border-purple-500/20 text-purple-400"
                            : "border-blue-500/20 text-blue-400"
                        }
                      >
                        {user.userType === "Lawyer" ? "محامي" : "عميل"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 text-center">
                      {user.phoneNumber ?? "—"}
                    </TableCell>
                    <TableCell className="text-slate-400 text-center">
                      {new Date(user.createdAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.lastActionDate && (
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(user.lastActionDate).toLocaleDateString(
                            "ar-EG",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.status === "Active" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          نشط
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                          معلق
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu dir="rtl">
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-white"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-slate-800 border-slate-700"
                        >
                          <DropdownMenuItem
                            onClick={() => setSelectedUser(user)}
                            className="cursor-pointer text-slate-300 focus:text-white focus:bg-slate-700"
                          >
                            <Eye className="w-4 h-4 ml-2" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          {user.status === "Active" ? (
                            <DropdownMenuItem
                              onClick={() => setUserToToggle(user)}
                              className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/10"
                            >
                              <Ban className="w-4 h-4 ml-2" />
                              تعليق الحساب
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => setUserToToggle(user)}
                              className="cursor-pointer text-emerald-400 focus:text-emerald-300 focus:bg-emerald-500/10"
                            >
                              <RefreshCw className="w-4 h-4 ml-2" />
                              استعادة الحساب
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              setUserToDelete(user.id);
                            }}
                            className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف المستخدم
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">لا يوجد مستخدمين مطابقين للبحث</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      {/* <Dialog open={!!selectedUser} onOpenChange={setSelectedUser}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">تفاصيل المستخدم</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-900/50">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    selectedUser.userType === "lawyer"
                      ? "bg-purple-500/20"
                      : "bg-blue-500/20"
                  }`}
                >
                  {selectedUser.userType === "lawyer" ? (
                    <Briefcase className="w-8 h-8 text-purple-400" />
                  ) : (
                    <User className="w-8 h-8 text-blue-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-slate-400">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <p className="text-xs text-slate-400 mb-1">نوع الحساب</p>
                  <p className="text-white font-medium">
                    {selectedUser.userType === "Lawyer" ? "محامي" : "عميل"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <p className="text-xs text-slate-400 mb-1">الحالة</p>
                  <p
                    className={`font-medium ${selectedUser.status === "Active" ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {selectedUser.status === "Active" ? "نشط" : "معلق"}
                  </p>
                </div>
                {selectedUser.specialty && (
                  <div className="p-4 rounded-lg bg-slate-900/50">
                    <p className="text-xs text-slate-400 mb-1">التخصص</p>
                    <p className="text-white font-medium">
                      {selectedUser.specialty}
                    </p>
                  </div>
                )}
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <p className="text-xs text-slate-400 mb-1">إجمالي المواعيد</p>
                  <p className="text-white font-medium">
                    {selectedUser.totalAppointments}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <p className="text-xs text-slate-400 mb-1">تاريخ التسجيل</p>
                  <p className="text-white font-medium">
                    {selectedUser.createdAt}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <p className="text-xs text-slate-400 mb-1">آخر نشاط</p>
                  <p className="text-white font-medium">
                    {selectedUser.lastActive}
                  </p>
                </div>
              </div>

              <DialogFooter>
                {selectedUser.status === "Active" ? (
                  <Button
                    variant="outline"
                    onClick={() => setSuspendDialogOpen(true)}
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    <Ban className="w-4 h-4 ml-2" />
                    تعليق الحساب
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleReinstate(selectedUser.id)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <RefreshCw className="w-4 h-4 ml-2" />
                    استعادة الحساب
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog> */}

      {/* Suspend Dialog */}

      <Dialog open={!!userToToggle} onOpenChange={() => setUserToToggle(null)}>
        <DialogContent className="bg-slate-800 border-slate-700" dir="rtl">
          <DialogHeader className="mt-4">
            <DialogTitle className="text-white text-center">
              {userToToggle?.status === "Active"
                ? "تأكيد تعليق الحساب"
                : "تأكيد استعادة الحساب"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-center">
              هل أنت متأكد من{" "}
              {userToToggle?.status === "Active" ? "تعليق" : "استعادة"} حساب{" "}
              {userToToggle?.firstName} {userToToggle?.lastName}؟ سيتم منع
              المستخدم من الوصول إلى المنصة.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex justify-center items-center gap-3">
            <Button variant="outline" onClick={() => setUserToToggle(null)}>
              إلغاء
            </Button>
            <Button
              onClick={() => toggleUserStatusMutation.mutate(userToToggle!.id)}
              disabled={toggleUserStatusMutation.isPending}
              variant="destructive"
            >
              {toggleUserStatusMutation.isPending &&
              userToToggle?.status === "Active"
                ? "جاري التعليق..."
                : toggleUserStatusMutation.isPending &&
                    userToToggle?.status !== "Active"
                  ? "جاري الاستعادة..."
                  : "تأكيد التعليق"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Confirm Delete User */}
      <Dialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <DialogContent className="bg-slate-800 border-slate-700" dir="rtl">
          <DialogHeader className="mt-4">
            <DialogTitle className="text-white text-center">
              تأكيد الحذف
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-center">
              هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex justify-center items-center gap-3">
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              إلغاء
            </Button>
            <Button
              onClick={() => deleteUserMutation.mutate(userToDelete!)}
              disabled={deleteUserMutation.isPending}
              variant="destructive"
            >
              {deleteUserMutation.isPending ? "جاري الحذف..." : "تأكيد الحذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
