import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import UserService, { type User as UserType } from "@/services/users-service";
import { formatDateTime, timeAgo } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const UserManagement = () => {
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToToggle, setUserToToggle] = useState<UserType | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // Seach Query and Active Tabs
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const apiFilters = useMemo(() => {
    let userType: "Lawyer" | "Client" | undefined;
    let status: 0 | 1 | undefined;

    if (activeTab === "clients") userType = "Client";
    if (activeTab === "lawyers") userType = "Lawyer";
    if (activeTab === "suspended") status = 1;

    return {
      name: searchQuery || undefined,
      userType,
      status,
    };
  }, [activeTab, searchQuery]);

  // Getting All Users
  const { data: users = [] } = useQuery({
    queryKey: ["users", pageNumber, pageSize, apiFilters],
    queryFn: () =>
      UserService.getUsers({
        Page: pageNumber,
        PageSize: pageSize,
        Name: apiFilters.name,
        userType: apiFilters.userType,
        Status: apiFilters.status,
      }),
    placeholderData: (previousData) => previousData,
  });

  const canGoPrevious = pageNumber > 1;
  const canGoNext = users.length === pageSize;

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
              onValueChange={(value) => {
                setActiveTab(value);
                setPageNumber(1);
              }}
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
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPageNumber(1);
                }}
                className="pr-10 bg-slate-900/50 border-slate-600 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              قائمة المستخدمين
            </CardTitle>
            <Badge
              variant="outline"
              className="text-slate-300 border-slate-600"
            >
              صفحة {pageNumber}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
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
                {users.map((user) => (
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
                      <div className="space-y-1">
                        <p> {formatDateTime(user.createdAt)}</p>
                        <p className="text-xs text-slate-500">
                          {timeAgo(user.createdAt)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-400 text-center">
                      <div className="space-y-1">
                        <p>{formatDateTime(user.lastActionDate)}</p>
                        <p className="text-xs text-slate-500">
                          {timeAgo(user.lastActionDate)}
                        </p>
                      </div>
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

          <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <Select
                value={String(pageSize)}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setPageNumber(1);
                }}
              >
                <SelectTrigger className="cursor-pointer w-28 bg-slate-900/50 border-slate-600 text-slate-200">
                  <SelectValue placeholder="الحجم" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectItem className="cursor-pointer" value="8">
                    8
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="10">
                    10
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="15">
                    15
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="20">
                    20
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="50">
                    50
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                className="border-slate-600 text-slate-300"
                disabled={!canGoPrevious}
                onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                title="الصفحة السابقة"
                aria-label="الصفحة السابقة"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-slate-600 text-slate-300"
                disabled={!canGoNext}
                onClick={() => setPageNumber((prev) => prev + 1)}
                title="الصفحة التالية"
                aria-label="الصفحة التالية"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog
        open={!!selectedUser}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null);
        }}
      >
        <DialogContent className="bg-slate-800 border-slate-700" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-white text-center mt-4">
              تفاصيل المستخدم
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-center">
              ملخص بيانات المستخدم
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-900/50">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    selectedUser.userType === "Lawyer"
                      ? "bg-purple-500/20"
                      : "bg-blue-500/20"
                  }`}
                >
                  {selectedUser.userType === "Lawyer" ? (
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
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <p className="text-xs text-slate-400 mb-1">رقم الهاتف</p>
                  <p className="text-white font-medium">
                    {selectedUser.phoneNumber ?? "—"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <p className="text-xs text-slate-400 mb-1">تاريخ التسجيل</p>
                  <p className="text-white font-medium">
                    {new Date(selectedUser.createdAt).toLocaleDateString(
                      "ar-EG",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <p className="text-xs text-slate-400 mb-1">آخر نشاط</p>
                  <p className="text-white font-medium">
                    {selectedUser.lastActionDate
                      ? new Date(
                          selectedUser.lastActionDate,
                        ).toLocaleDateString("ar-EG", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  إغلاق
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
