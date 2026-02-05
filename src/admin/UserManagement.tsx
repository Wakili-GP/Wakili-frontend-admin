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
import { toast } from "@/components/ui/sonner";

interface UserAccount {
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

const mockUsers: UserAccount[] = [
  {
    id: "1",
    name: "محمد أحمد علي",
    email: "mohamed@example.com",
    type: "client",
    status: "active",
    createdAt: "2024-01-01",
    lastActive: "2024-01-15",
    totalAppointments: 5,
  },
  {
    id: "2",
    name: "فاطمة حسن محمود",
    email: "fatma@example.com",
    type: "client",
    status: "active",
    createdAt: "2024-01-05",
    lastActive: "2024-01-14",
    totalAppointments: 3,
  },
  {
    id: "3",
    name: "أحمد محمد علي",
    email: "ahmed.lawyer@example.com",
    type: "lawyer",
    status: "active",
    createdAt: "2023-12-01",
    lastActive: "2024-01-15",
    specialty: "القانون الجنائي",
    totalAppointments: 45,
  },
  {
    id: "4",
    name: "سارة أحمد محمود",
    email: "sara.lawyer@example.com",
    type: "lawyer",
    status: "suspended",
    createdAt: "2023-11-15",
    lastActive: "2024-01-10",
    specialty: "قانون الأسرة",
    totalAppointments: 32,
  },
  {
    id: "5",
    name: "علي حسين محمد",
    email: "ali@example.com",
    type: "client",
    status: "suspended",
    createdAt: "2023-12-20",
    lastActive: "2024-01-08",
    totalAppointments: 1,
  },
];

const UserManagement = () => {
  const [users, setUsers] = useState<UserAccount[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.includes(searchQuery) || user.email.includes(searchQuery);
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "clients" && user.type === "client") ||
      (activeTab === "lawyers" && user.type === "lawyer") ||
      (activeTab === "suspended" && user.status === "suspended");
    return matchesSearch && matchesTab;
  });

  const handleSuspend = (id: string) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, status: "suspended" as const } : u,
      ),
    );
    setSuspendDialogOpen(false);
    setViewDialogOpen(false);
    toast.error("تم تعليق الحساب", {
      description: "تم تعليق حساب المستخدم بنجاح",
    });
  };

  const handleReinstate = (id: string) => {
    setUsers(
      users.map((u) => (u.id === id ? { ...u, status: "active" as const } : u)),
    );
    setViewDialogOpen(false);
    toast.success("تم استعادة الحساب", {
      description: "تم إعادة تفعيل حساب المستخدم بنجاح",
    });
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
                {users.filter((u) => u.type === "client").length}
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
                {users.filter((u) => u.type === "lawyer").length}
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
                {users.filter((u) => u.status === "suspended").length}
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
                            user.type === "lawyer"
                              ? "bg-purple-500/20"
                              : "bg-blue-500/20"
                          }`}
                        >
                          {user.type === "lawyer" ? (
                            <Briefcase className="w-5 h-5 text-purple-400" />
                          ) : (
                            <User className="w-5 h-5 text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant="outline"
                        className={
                          user.type === "lawyer"
                            ? "border-purple-500/20 text-purple-400"
                            : "border-blue-500/20 text-blue-400"
                        }
                      >
                        {user.type === "lawyer" ? "محامي" : "عميل"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {user.createdAt}
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {user.lastActive}
                    </td>
                    <td className="py-4 px-4">
                      {user.status === "active" ? (
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
                            className="cursor-pointer text-slate-400 hover:text-white"
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
                            className="cursor-pointer text-slate-300 focus:text-white focus:bg-slate-700"
                          >
                            <Eye className="w-4 h-4 ml-2" />
                            عرض التفاصيل
                          </DropdownMenuItem>
                          {user.status === "active" ? (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setSuspendDialogOpen(true);
                              }}
                              className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/10"
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
          <DialogHeader className="mt-5">
            <DialogTitle className="text-white text-center">
              تفاصيل المستخدم
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-900/50">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    selectedUser.type === "lawyer"
                      ? "bg-purple-500/20"
                      : "bg-blue-500/20"
                  }`}
                >
                  {selectedUser.type === "lawyer" ? (
                    <Briefcase className="w-8 h-8 text-purple-400" />
                  ) : (
                    <User className="w-8 h-8 text-blue-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedUser.name}
                  </h3>
                  <p className="text-slate-400">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <p className="text-xs text-slate-400 mb-1">نوع الحساب</p>
                  <p className="text-white font-medium">
                    {selectedUser.type === "lawyer" ? "محامي" : "عميل"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-slate-900/50">
                  <p className="text-xs text-slate-400 mb-1">الحالة</p>
                  <p
                    className={`font-medium ${selectedUser.status === "active" ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {selectedUser.status === "active" ? "نشط" : "معلق"}
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
                {selectedUser.status === "active" ? (
                  <Button
                    variant="outline"
                    onClick={() => setSuspendDialogOpen(true)}
                    className="cursor-pointer border-red-500/20 text-red-400 hover:bg-red-500/10"
                  >
                    <Ban className="w-4 h-4 ml-2" />
                    تعليق الحساب
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleReinstate(selectedUser.id)}
                    className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white"
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
              هل أنت متأكد من تعليق حساب {selectedUser?.name}؟ سيتم منع المستخدم
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
