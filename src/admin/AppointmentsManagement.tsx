import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Loader,
  ChevronLeft,
  ChevronRight,
  Phone,
  Building
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import appointmentsService, { type AdminAppointmentInterface } from "../services/appointments-service";

const STATUS_MAP: Record<number, { label: string; class: string }> = {
  0: { label: "قيد الانتظار", class: "bg-amber-100 text-amber-700 border-amber-200" },
  1: { label: "بانتظار الإدارة", class: "bg-orange-100 text-orange-700 border-orange-200" },
  2: { label: "مُؤكد", class: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  3: { label: "ملغي", class: "bg-red-100 text-red-700 border-red-200" },
  4: { label: "مكتمل", class: "bg-blue-100 text-blue-700 border-blue-200" },
};

const SESSION_TYPE_MAP: Record<number, { label: string; icon: any }> = {
  0: { label: "هاتفية", icon: Phone },
  1: { label: "مكتبية", icon: Building },
};

const formatDateAr = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (time: string) => time.slice(0, 5);

const AppointmentsManagement = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortDescending, setSortDescending] = useState(true);

  const [selectedAppointment, setSelectedAppointment] = useState<AdminAppointmentInterface | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const queryParams = {
    Page: currentPage,
    PageSize: 10,
    SearchTerm: searchQuery || undefined,
    Status: statusFilter !== "all" ? Number(statusFilter) : undefined,
    SortDescending: sortDescending,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["adminAppointments", queryParams],
    queryFn: () => appointmentsService.getAllAdminAppointments(queryParams),
    staleTime: 10000,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => appointmentsService.approveAppointment(id),
    onSuccess: () => {
      toast.success("تمت الموافقة على الموعد");
      queryClient.invalidateQueries({ queryKey: ["adminAppointments"] });
      setDetailsDialogOpen(false);
    },
    onError: () => toast.error("حدث خطأ أثناء الموافقة"),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => appointmentsService.rejectAppointment(id),
    onSuccess: () => {
      toast.success("تم رفض الموعد");
      queryClient.invalidateQueries({ queryKey: ["adminAppointments"] });
      setDetailsDialogOpen(false);
    },
    onError: () => toast.error("حدث خطأ أثناء الرفض"),
  });

  const appointments = data?.data.items ?? [];
  const meta = data?.data.meta;
  const totalCount = data?.data.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / 10);

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "الإجمالي", count: meta?.total ?? 0, color: "bg-gray-100 text-gray-700" },
          { label: "قيد الانتظار", count: meta?.pending ?? 0, color: "bg-amber-100 text-amber-700" },
          { label: "بانتظار الإدارة", count: meta?.awaitingAdminApproval ?? 0, color: "bg-orange-100 text-orange-700" },
          { label: "مُؤكد", count: meta?.confirmed ?? 0, color: "bg-emerald-100 text-emerald-700" },
          { label: "ملغي", count: meta?.cancelled ?? 0, color: "bg-red-100 text-red-700" },
          { label: "مكتمل", count: meta?.completed ?? 0, color: "bg-blue-100 text-blue-700" },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className={`p-4 flex flex-col items-center justify-center text-center rounded-xl ${stat.color}`}>
              <p className="text-2xl font-bold">{stat.count}</p>
              <p className="text-xs font-medium mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Tabs value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }} className="w-full sm:w-auto">
            <TabsList className="bg-gray-100/50">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="1">بانتظار الإدارة</TabsTrigger>
              <TabsTrigger value="0">قيد الانتظار (للمحامي)</TabsTrigger>
              <TabsTrigger value="2">مُؤكد</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="ابحث باسم العميل أو المحامي..."
                className="pl-3 pr-9 h-9 text-sm bg-white"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <Select value={sortDescending ? "newest" : "oldest"} onValueChange={(v) => setSortDescending(v === "newest")}>
              <SelectTrigger className="w-[140px] h-9 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">الأحدث أولاً</SelectItem>
                <SelectItem value="oldest">الأقدم أولاً</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="relative overflow-x-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Loader className="w-8 h-8 animate-spin mb-4 text-primary" />
              <p>جاري تحميل المواعيد...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Calendar className="w-12 h-12 mb-4 text-gray-300" />
              <p>لا توجد مواعيد تطابق بحثك</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold text-gray-900">العميل</TableHead>
                  <TableHead className="font-semibold text-gray-900">المحامي</TableHead>
                  <TableHead className="font-semibold text-gray-900">موعد الجلسة</TableHead>
                  <TableHead className="font-semibold text-gray-900">النوع</TableHead>
                  <TableHead className="font-semibold text-gray-900">الحالة</TableHead>
                  <TableHead className="text-left font-semibold text-gray-900">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((apt: any) => {
                  const statusInfo = STATUS_MAP[apt.status] || { label: "غير معروف", class: "bg-gray-100" };
                  const typeInfo = SESSION_TYPE_MAP[apt.sessionType] || { label: "غير محدد", icon: Clock };
                  const TypeIcon = typeInfo.icon;

                  return (
                    <TableRow key={apt.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium">{apt.clientFirstName} {apt.clientLastName}</TableCell>
                      <TableCell>{apt.lawyerFirstName} {apt.lawyerLastName}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{formatDateAr(apt.sessionDate)}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-1 w-fit bg-white">
                          <TypeIcon className="w-3 h-3" />
                          {typeInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusInfo.class}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-left">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-primary/10 hover:text-primary"
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setDetailsDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 ml-1.5" />
                          التفاصيل
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-center gap-2 bg-gray-50/30">
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                className={`w-8 h-8 p-0 ${currentPage === i + 1 ? "bg-primary text-primary-foreground" : "bg-white"}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        )}
      </Card>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              تفاصيل الموعد
            </DialogTitle>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">العميل</p>
                  <p className="font-semibold">{selectedAppointment.clientFirstName} {selectedAppointment.clientLastName}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">المحامي</p>
                  <p className="font-semibold">{selectedAppointment.lawyerFirstName} {selectedAppointment.lawyerLastName}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">موعد الجلسة</p>
                  <p className="text-sm font-semibold text-primary">{formatDateAr(selectedAppointment.sessionDate)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">الوقت</p>
                  <p className="text-sm font-semibold">{formatTime(selectedAppointment.startTime)} - {formatTime(selectedAppointment.endTime)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">نوع الجلسة</p>
                  <Badge variant="outline" className="bg-white">
                    {SESSION_TYPE_MAP[selectedAppointment.sessionType]?.label || "غير محدد"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">الحالة الحالية</p>
                  <Badge variant="outline" className={STATUS_MAP[selectedAppointment.status]?.class || ""}>
                    {STATUS_MAP[selectedAppointment.status]?.label || "غير معروف"}
                  </Badge>
                </div>
              </div>

              {selectedAppointment.status === 1 && (
                <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-lg text-sm text-center font-medium">
                  هذا الموعد بانتظار موافقتك لإرساله إلى المحامي
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:justify-start">
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              إغلاق
            </Button>
            {selectedAppointment?.status === 1 && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => rejectMutation.mutate(selectedAppointment.id)}
                  disabled={rejectMutation.isPending}
                >
                  {rejectMutation.isPending ? <Loader className="w-4 h-4 ml-2 animate-spin" /> : <XCircle className="w-4 h-4 ml-2" />}
                  رفض
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => approveMutation.mutate(selectedAppointment.id)}
                  disabled={approveMutation.isPending}
                >
                  {approveMutation.isPending ? <Loader className="w-4 h-4 ml-2 animate-spin" /> : <CheckCircle className="w-4 h-4 ml-2" />}
                  موافقة وإرسال للمحامي
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentsManagement;
