import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Users,
  Search,
  Eye,
  Ban,
  Briefcase,
  User,
  MoreVertical,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import UserService, { type User as UserType } from "@/services/users.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("ar-SA");
};

const getFullName = (user: UserType) => {
  const name = `${user.firstName} ${user.lastName}`.trim();
  return name || user.email;
};

const UserManagement = () => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const queryClient = useQueryClient();

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => UserService.getUsers(),
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      getFullName(user).toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "clients" && user.userType === "Client") ||
      (activeTab === "lawyers" && user.userType === "Lawyer") ||
      (activeTab === "suspended" && user.status !== "Active");

    return matchesSearch && matchesTab;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSuspend = async (_id: string) => {
    try {
      // TODO: call suspend API when available
      toast.success("تم تعليق الحساب بنجاح");
      setSuspendDialogOpen(false);
      setViewDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch {
      toast.error("حدث خطأ أثناء تعليق الحساب");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleReinstate = async (_id: string) => {
    try {
      // TODO: call reinstate API when available
      toast.success("تم استعادة الحساب بنجاح");
      setViewDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch {
      toast.error("حدث خطأ أثناء استعادة الحساب");
    }
  };

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
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="clients">العملاء</TabsTrigger>
                <TabsTrigger value="lawyers">المحامون</TabsTrigger>
                <TabsTrigger value="suspended">المعلقون</TabsTrigger>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">
                    المستخدم
                  </th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">
                    النوع
                  </th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">
                    تاريخ التسجيل
                  </th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">
                    آخر نشاط
                  </th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">
                    الحالة
                  </th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-700/50 hover:bg-slate-700/20"
                  >
                    <td className="py-4 px-4">
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
                            {getFullName(user)}
                          </p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
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
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {formatDate(user.lastActionDate)}
                    </td>
                    <td className="py-4 px-4">
                      {user.status === "Active" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          نشط
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                          معلق
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <DropdownMenu>
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
                            onClick={() => {
                              setSelectedUser(user);
                              setViewDialogOpen(true);
                            }}
                            className="text-slate-300 focus:text-white focus:bg-slate-700"
                          >
                            <Eye className="w-4 h-4 ml-2" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          {user.status === "Active" ? (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setSuspendDialogOpen(true);
                              }}
                              className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
                            >
                              <Ban className="w-4 h-4 ml-2" />
                              تعليق الحساب
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleReinstate(user.id)}
                              className="text-emerald-400 focus:text-emerald-300 focus:bg-emerald-500/10"
                            >
                              <RefreshCw className="w-4 h-4 ml-2" />
                              استعادة الحساب
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">تفاصيل المستخدم</DialogTitle>
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
                    {getFullName(selectedUser)}
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
                {selectedUser.phoneNumber && (
                  <div className="p-4 rounded-lg bg-slate-900/50">
                    <p className="text-xs text-slate-400 mb-1">رقم الهاتف</p>
                    <p className="text-white font-medium">
                      {selectedUser.phoneNumber}
                    </p>
                  </div>
                )}
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <p className="text-xs text-slate-400 mb-1">تاريخ التسجيل</p>
                  <p className="text-white font-medium">
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <p className="text-xs text-slate-400 mb-1">آخر نشاط</p>
                  <p className="text-white font-medium">
                    {formatDate(selectedUser.lastActionDate)}
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
      </Dialog>

      {/* Suspend Dialog */}
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">تأكيد تعليق الحساب</DialogTitle>
            <DialogDescription className="text-slate-400">
              هل أنت متأكد من تعليق حساب{" "}
              {selectedUser ? getFullName(selectedUser) : ""}؟ سيتم منع المستخدم
              من الوصول إلى المنصة.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSuspendDialogOpen(false)}
              className="border-slate-600 text-slate-300"
            >
              إلغاء
            </Button>
            <Button
              onClick={() => selectedUser && handleSuspend(selectedUser.id)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              تأكيد التعليق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
