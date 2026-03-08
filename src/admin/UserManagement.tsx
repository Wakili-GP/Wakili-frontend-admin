import { useState, useEffect } from "react";
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
  Loader,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";

type UserAccount = {
  id: string;
  name: string;
  email: string;
  type: "client" | "lawyer";
  status: "active" | "suspended";
  createdAt: string;
  lastActive: string;
  specialty?: string;
  totalAppointments: number;
};

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
];

const UserManagement = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [isSuspending, setIsSuspending] = useState(false);
  const [isReinstating, setIsReinstating] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
    }, 600);
  }, []);

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
    setIsSuspending(true);

    setTimeout(() => {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "suspended" } : u)),
      );

      setIsSuspending(false);
      setSuspendDialogOpen(false);
      setViewDialogOpen(false);

      toast.error("تم تعليق الحساب");
    }, 600);
  };

  const handleReinstate = (id: string) => {
    setIsReinstating(true);

    setTimeout(() => {
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: "active" } : u)),
      );

      setIsReinstating(false);
      setViewDialogOpen(false);

      toast.success("تم استعادة الحساب");
    }, 600);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

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
            <Users className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-2xl text-white">{users.length}</p>
              <p className="text-sm text-slate-400">إجمالي المستخدمين</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <User className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-2xl text-white">
                {users.filter((u) => u.type === "client").length}
              </p>
              <p className="text-sm text-slate-400">عملاء</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <Briefcase className="w-6 h-6 text-purple-400" />
            <div>
              <p className="text-2xl text-white">
                {users.filter((u) => u.type === "lawyer").length}
              </p>
              <p className="text-sm text-slate-400">محامون</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <Ban className="w-6 h-6 text-red-400" />
            <div>
              <p className="text-2xl text-white">
                {users.filter((u) => u.status === "suspended").length}
              </p>
              <p className="text-sm text-slate-400">معلقون</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search + Tabs */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4 flex justify-between items-center flex-wrap gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="clients">العملاء</TabsTrigger>
              <TabsTrigger value="lawyers">المحامون</TabsTrigger>
              <TabsTrigger value="suspended">المعلقون</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="البحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 bg-slate-900 border-slate-600 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">قائمة المستخدمين</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full">
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-700">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      {user.type === "lawyer" ? (
                        <Briefcase className="text-purple-400" />
                      ) : (
                        <User className="text-blue-400" />
                      )}

                      <div>
                        <p className="text-white">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td>
                    <Badge>{user.type === "lawyer" ? "محامي" : "عميل"}</Badge>
                  </td>

                  <td>
                    {user.status === "active" ? (
                      <Badge className="bg-emerald-500/10 text-emerald-400">
                        نشط
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-400">معلق</Badge>
                    )}
                  </td>

                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user);
                            setViewDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 ml-2" />
                          عرض
                        </DropdownMenuItem>

                        {user.status === "active" ? (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setSuspendDialogOpen(true);
                            }}
                          >
                            <Ban className="w-4 h-4 ml-2" />
                            تعليق
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleReinstate(user.id)}
                          >
                            <RefreshCw className="w-4 h-4 ml-2" />
                            استعادة
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
