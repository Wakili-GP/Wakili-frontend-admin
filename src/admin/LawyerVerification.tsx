import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  UserCheck,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Award,
  Clock,
  Filter,
  Briefcase,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import verificationService from "@/services/verification-service";
import { Spinner } from "@/components/ui/spinner";
import type {
  Education,
  Certification,
  WorkExperience,
} from "@/services/verification-service";
import { formatDateTime, timeAgo } from "@/lib/utils";
import { toast } from "sonner";

const LawyerVerification = () => {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDescending, setSortDescending] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // status: 0 = Pending, 1 = UnderReview, 2 = Approved, 3 = Rejected
  const [statusFilter, setStatusFilter] = useState("all");
  const statusMap: Record<string, number | undefined> = {
    all: undefined,
    pending: 0,
    underReview: 1,
    approved: 2,
    rejected: 3,
  };

  // DateFilter: 0 = All, 1 = Last 24 hours, 2 = Last 7 days, 3 = Last 30 days, 4 = Last Year
  const dateFilterMap: Record<string, number | undefined> = {
    all: 0,
    last24Hours: 1,
    last7Days: 2,
    last30Days: 3,
    lastYear: 4,
  };
  const [dateFilter, setDateFilter] = useState("all");

  const { data: requests, isPending } = useQuery({
    queryKey: [
      "verificationRequests",
      currentPage,
      pageSize,
      statusFilter,
      searchQuery,
      sortDescending,
      dateFilter,
    ],
    queryFn: async () =>
      verificationService.getVerificationRequests(
        currentPage,
        pageSize,
        searchQuery,
        statusMap[statusFilter || "all"],
        sortDescending,
        dateFilterMap[dateFilter || "all"],
      ),
  });
  const queryClient = useQueryClient();

  // Fetch request by Id
  const { data: viewRequest } = useQuery({
    queryKey: ["verificationRequest", selectedRequestId],
    queryFn: () =>
      verificationService.getVerificationRequestById(selectedRequestId!),
    enabled: !!selectedRequestId,
  });

  const rejectMutation = useMutation({
    mutationFn: ({
      requestId,
      reason,
    }: {
      requestId: string;
      reason: string;
    }) => verificationService.rejectVerificationRequest(requestId, reason),
    onSuccess: () => {
      setRejectDialogOpen(false);
      setRejectionReason("");
      setSelectedRequestId(null);
      toast.success("تم رفض طلب التوثيق بنجاح", {
        description: "تم إرسال سبب الرفض إلى المحامي عبر البريد الإلكتروني",
      });
      queryClient.invalidateQueries(["verificationRequests"]);
    },
  });

  const paginatedRequests = requests?.items ?? [];
  const totalPages = Math.max(1, requests?.totalPages ?? 1);
  const activePage = Math.min(currentPage, totalPages);
  const pageStart = paginatedRequests.length
    ? (activePage - 1) * pageSize + 1
    : 0;
  const pageEnd = paginatedRequests.length
    ? pageStart + paginatedRequests.length - 1
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">توثيق المحامين</h1>
        <p className="text-slate-400 mt-1">إدارة طلبات توثيق حسابات المحامين</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {requests?.meta.total ?? 0}
              </p>
              <p className="text-sm text-slate-400">إجمالي الطلبات</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-500/10 border-slate-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-slate-300" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {requests?.meta.pending ?? 0}
              </p>
              <p className="text-sm text-slate-400">غير مكتملة</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {requests?.meta.underReview ?? 0}
              </p>
              <p className="text-sm text-slate-400">مكتملة وبانتظار المراجعة</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {requests?.meta.approved ?? 0}
              </p>
              <p className="text-sm text-slate-400">تمت الموافقة</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {requests?.meta.rejected ?? 0}
              </p>
              <p className="text-sm text-slate-400">مرفوضة</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="البحث بالاسم أو البريد الإلكتروني..."
                value={searchQuery}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearchQuery(e.target.value);
                }}
                className="pr-10 bg-slate-900/50 border-slate-600 text-white"
              />
            </div>

            <Select
              dir="rtl"
              value={statusFilter}
              onValueChange={(value) => {
                setCurrentPage(1);
                setStatusFilter(value);
              }}
            >
              <SelectTrigger className="cursor-pointer w-full md:w-48 bg-slate-900/50 border-slate-600 text-white">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="فلترة حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value="all">
                  جميع الحالات
                </SelectItem>
                <SelectItem className="cursor-pointer" value="pending">
                  معلق
                </SelectItem>
                <SelectItem className="cursor-pointer" value="underReview">
                  قيد المراجعة
                </SelectItem>
                <SelectItem className="cursor-pointer" value="approved">
                  موافق عليه
                </SelectItem>
                <SelectItem className="cursor-pointer" value="rejected">
                  مرفوض
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              dir="rtl"
              value={dateFilter}
              onValueChange={(value) => {
                setCurrentPage(1);
                setDateFilter(value);
              }}
            >
              <SelectTrigger className="cursor-pointer w-full md:w-48 bg-slate-900/50 border-slate-600 text-white">
                <Clock className="w-4 h-4 ml-2" />
                <SelectValue placeholder="فلترة التاريخ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value="all">
                  كل التواريخ
                </SelectItem>
                <SelectItem className="cursor-pointer" value="last24Hours">
                  آخر 24 ساعة
                </SelectItem>
                <SelectItem className="cursor-pointer" value="last7Days">
                  آخر 7 أيام
                </SelectItem>
                <SelectItem className="cursor-pointer" value="last30Days">
                  آخر 30 يوم
                </SelectItem>
                <SelectItem className="cursor-pointer" value="lastYear">
                  آخر سنة
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              dir="rtl"
              value={sortDescending ? "desc" : "asc"}
              onValueChange={(value) => {
                setCurrentPage(1);
                setSortDescending(value === "desc");
              }}
            >
              <SelectTrigger className="cursor-pointer w-full md:w-40 bg-slate-900/50 border-slate-600 text-white">
                <SelectValue placeholder="اتجاه الفرز" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="cursor-pointer" value="desc">
                  الأحدث أولاً
                </SelectItem>
                <SelectItem className="cursor-pointer" value="asc">
                  الأقدم أولاً
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-500" />
            طلبات التوثيق
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="text-center py-12">
              <Spinner className="w-8 h-8 mx-auto text-amber-400 mb-3" />
              <p className="text-slate-400">جاري تحميل الطلبات...</p>
            </div>
          ) : paginatedRequests.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-900/50">
                    <TableHead className="text-slate-400 text-right">
                      المحامي
                    </TableHead>
                    <TableHead className="text-slate-400 text-center">
                      التخصص
                    </TableHead>
                    <TableHead className="text-slate-400 text-center">
                      تاريخ التقديم
                    </TableHead>
                    <TableHead className="text-slate-400 text-center">
                      تاريخ الموافقة/الرفض
                    </TableHead>
                    <TableHead className="text-slate-400 text-center">
                      تمت الموافقة/الرفض بواسطة
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
                  {paginatedRequests.map((request) => (
                    <TableRow
                      key={request.id}
                      className="border-slate-700 hover:bg-slate-900/50"
                    >
                      <TableCell className="text-white font-medium text-right w-54">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-500/20">
                            {request.profileImageUrl ? (
                              <img
                                src={request.profileImageUrl}
                                alt={`${request.firstName} ${request.lastName}`}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <Briefcase className="w-5 h-5 text-purple-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {request.firstName} {request.lastName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {request.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300 text-center">
                        {(Array.isArray(request.specializations)
                          ? request.specializations
                          : (
                              request.specializations as unknown as string
                            )?.split(",") || []
                        ).map((s: string, i: number) => (
                          <Badge
                            variant="outline"
                            className={
                              i & 1
                                ? "border-purple-500/20 text-purple-400"
                                : "border-blue-500/20 text-blue-400"
                            }
                            key={i}
                          >
                            {typeof s === "string" ? s.trim() : s}
                          </Badge>
                        ))}
                      </TableCell>
                      <TableCell className="text-slate-400 text-center">
                        <div className="space-y-1">
                          <p>{formatDateTime(request.submittedAt)}</p>
                          <p className="text-xs text-slate-500">
                            {timeAgo(request.submittedAt)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400 text-center">
                        <div className="space-y-1">
                          {request.status === "Approved" && (
                            <>
                              <p className="text-emerald-400">
                                {formatDateTime(request.approvedAt)}
                              </p>
                              <p className="text-xs text-slate-500">
                                {timeAgo(request.approvedAt)}
                              </p>
                            </>
                          )}
                          {request.status === "UnderReview" && "قيد المراجعة"}
                          {request.status === "Pending" && "غير مكتمل بعد"}
                          {request.status === "Rejected" && (
                            <>
                              <p className="text-red-400">
                                {formatDateTime(request.rejectedAt)}
                              </p>
                              <p className="text-xs text-slate-500">
                                {timeAgo(request.rejectedAt)}
                              </p>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell
                        className={`${request.status === "Approved" ? "text-emerald-400" : request.status === "UnderReview" ? "text-amber-400" : request.status === "Rejected" ? "text-red-400" : "text-slate-400"} text-center`}
                      >
                        {request.status === "Approved" &&
                          "تمت الموافقة بواسطة: " + request.approvedBy}
                        {request.status === "UnderReview" && "قيد المراجعة"}{" "}
                        {request.status === "Pending" && "غير مكتمل بعد"}
                        {request.status === "Rejected" &&
                          "تمت الرفض بواسطة: " + request.rejectedBy}
                      </TableCell>
                      <TableCell className="text-center">
                        {getVerificatoinStatusBadge(request.status)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRequestId(request.id)}
                          className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                        >
                          <Eye className="w-4 h-4 ml-1" />
                          عرض
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                <p className="text-sm text-slate-400">
                  عرض {pageStart} - {pageEnd} من{" "}
                  {requests?.totalCount ?? requests?.totalItems ?? 0}
                </p>
              </div>

              <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                  <Select
                    value={String(pageSize)}
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      setCurrentPage(1);
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
                    disabled={activePage === totalPages}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    title="الصفحة التالية"
                    aria-label="الصفحة التالية"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="border-slate-600 text-slate-300"
                    disabled={activePage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    title="الصفحة السابقة"
                    aria-label="الصفحة السابقة"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">لا يوجد مستخدمين مطابقين للبحث</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedRequestId}
        onOpenChange={(open) => {
          if (!open) setSelectedRequestId(null);
        }}
      >
        <DialogContent className="bg-slate-800 border-slate-700 w-250 max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col [&>button]:left-4 [&>button]:right-auto">
          <DialogHeader className="mt-4">
            <DialogTitle className="text-white text-xl text-center">
              تفاصيل طلب التوثيق
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-center">
              {viewRequest?.status === "Approved"
                ? "تم الموافقة علي طلب توثيق هذا المحامي"
                : "مراجعة جميع البيانات المقدمة من المحامي"}
            </DialogDescription>
          </DialogHeader>
          {viewRequest && (
            <div
              className="overflow-y-auto pr-4 -mr-2 pl-2 dialog-scroll py-2"
              style={{
                direction: "ltr",
                scrollbarWidth: "thin",
                scrollbarColor: "#475569 transparent",
              }}
            >
              <div dir="rtl" className="space-y-6 w-full">
                <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/50 shadow-sm">
                  <h3 className="text-lg font-semibold text-amber-400 mb-5 flex items-center gap-2 pb-3 border-b border-slate-800">
                    <UserCheck className="w-5 h-5" />
                    المعلومات الأساسية
                  </h3>
                  <div className="flex items-start gap-4 mb-6 bg-slate-800/30 p-4 rounded-xl border border-slate-700/30">
                    {viewRequest.profileImage ? (
                      <img
                        src={viewRequest.profileImage}
                        alt={viewRequest.firstName}
                        className="w-20 h-20 rounded-full object-cover border-2 border-amber-500/50 shadow-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center border-2 border-purple-500/30 shadow-lg">
                        <Briefcase className="w-8 h-8 text-purple-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-white mb-1">
                        {viewRequest.firstName} {viewRequest.lastName}
                      </h4>
                      <p className="text-slate-400 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">
                        {viewRequest.bio || "لا يوجد نبذة تعريفية"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                      <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                        <FolderOpen className="w-3 h-3" /> رقم المحامي التعريفي
                      </p>
                      <p className="text-white font-medium text-sm">
                        {viewRequest.id}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                      <p className="text-xs text-slate-400 mb-1">
                        البريد الإلكتروني
                      </p>
                      <p
                        className="text-white font-medium text-sm truncate"
                        title={viewRequest.email}
                      >
                        {viewRequest.email}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                      <p className="text-xs text-slate-400 mb-1">رقم الهاتف</p>
                      <p
                        className="text-white font-medium text-sm"
                        style={{ direction: "ltr", textAlign: "right" }}
                      >
                        {viewRequest.phone || "-"}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                      <p className="text-xs text-slate-400 mb-1">الموقع</p>
                      <p className="text-white font-medium text-sm">
                        {viewRequest.location.city}،{" "}
                        {viewRequest.location.country}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                      <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> تاريخ التقديم
                      </p>
                      <p className="text-white font-medium text-sm">
                        {formatDateTime(viewRequest.submittedAt)}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                      <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> سنوات الخبرة
                      </p>
                      <p className="text-white font-medium text-sm">
                        {viewRequest.yearsExperience} سنة
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors col-span-2 md:col-span-3">
                      <p className="text-xs text-slate-400 mb-2">التخصصات</p>
                      <div className="flex flex-wrap gap-2">
                        {viewRequest.specialty.map((s: string, i: number) => (
                          <Badge
                            key={i}
                            className="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20 transition-colors"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors col-span-2 md:col-span-3 border-b-2 border-b-purple-500/20">
                      <p className="text-xs text-slate-400 mb-2">
                        أنواع الجلسات
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {viewRequest.sessionTypes.map(
                          (s: number, i: number) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="border-slate-600 text-slate-300 bg-slate-800/50"
                            >
                              {s === 0 && "مكتبية"}
                              {s === 1 && "هاتفيه"}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors col-span-2 md:col-span-3">
                      <p className="text-sm font-medium text-slate-300">
                        حالة الطلب
                      </p>
                      <div>
                        {getVerificatoinStatusBadge(viewRequest.status)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/50 shadow-sm">
                  <h3 className="text-lg font-semibold text-amber-400 mb-5 flex items-center gap-2 pb-3 border-b border-slate-800">
                    <Award className="w-5 h-5" />
                    المؤهلات العلمية
                  </h3>
                  {viewRequest.education.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {viewRequest.education.map(
                        (edu: Education, i: number) => (
                          <div
                            key={i}
                            className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/80 transition-colors flex flex-col justify-between gap-3 h-full"
                          >
                            <div>
                              <p className="text-white font-medium text-base mb-1">
                                {edu.degreeType} في {edu.fieldOfStudy}
                              </p>
                              <p className="text-slate-400 text-sm flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                {edu.university}
                              </p>
                              <p className="text-slate-500 text-sm mt-1">
                                سنة التخرج: {edu.graduationYear}
                              </p>
                            </div>
                            {edu.document && (
                              <div className="pt-3 mt-auto border-t border-slate-700/50">
                                <a
                                  href={edu.document}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium"
                                >
                                  <FileText className="w-4 h-4" />
                                  عرض المستند
                                </a>
                              </div>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-slate-800/20 rounded-xl border border-dashed border-slate-700/50">
                      <p className="text-slate-400">
                        لا توجد مؤهلات علمية مسجلة
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/50 shadow-sm">
                  <h3 className="text-lg font-semibold text-amber-400 mb-5 flex items-center gap-2 pb-3 border-b border-slate-800">
                    <FileText className="w-5 h-5" />
                    الشهادات المهنية
                  </h3>
                  {viewRequest.certifications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {viewRequest.certifications.map(
                        (cert: Certification, i: number) => (
                          <div
                            key={i}
                            className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/80 transition-colors flex flex-col justify-between gap-3 h-full"
                          >
                            <div>
                              <p className="text-white font-medium text-base mb-1">
                                {cert.name}
                              </p>
                              <p className="text-slate-400 text-sm flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                {cert.issuingOrg}
                              </p>
                              <p className="text-slate-500 text-sm mt-1">
                                سنة الحصول عليها: {cert.yearObtained}
                              </p>
                            </div>
                            {cert.document && (
                              <div className="pt-3 mt-auto border-t border-slate-700/50">
                                <a
                                  href={cert.document}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex w-full items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-amber-400 hover:text-amber-300 transition-colors text-sm font-medium"
                                >
                                  <FileText className="w-4 h-4" />
                                  عرض المستند
                                </a>
                              </div>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-slate-800/20 rounded-xl border border-dashed border-slate-700/50">
                      <p className="text-slate-400">
                        لا توجد شهادات مهنية مسجلة
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/50 shadow-sm">
                  <h3 className="text-lg font-semibold text-amber-400 mb-5 flex items-center gap-2 pb-3 border-b border-slate-800">
                    <Clock className="w-5 h-5" />
                    الخبرات العملية
                  </h3>
                  {viewRequest.workExperience.length > 0 ? (
                    <div className="space-y-4">
                      {viewRequest.workExperience.map(
                        (exp: WorkExperience, i: number) => (
                          <div
                            key={i}
                            className="p-5 rounded-xl bg-slate-800/40 border-r-4 border-slate-700/50 border-r-emerald-500 hover:bg-slate-800/60 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="text-white font-bold text-lg mb-1">
                                  {exp.jobTitle}
                                </p>
                                <p className="text-emerald-400 font-medium text-sm flex items-center gap-2">
                                  <Briefcase className="w-4 h-4" />
                                  {exp.organizationName}
                                </p>
                              </div>
                              <Badge
                                className={
                                  exp.isCurrentJob
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 px-3 py-1"
                                    : "bg-slate-800 text-slate-300 border-slate-600 px-3 py-1"
                                }
                              >
                                {exp.isCurrentJob
                                  ? "وظيفة حالية"
                                  : `${exp.startYear} - ${exp.endYear}`}
                              </Badge>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap bg-slate-900/30 p-3 rounded-lg border border-slate-800">
                              {exp.description}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-slate-800/20 rounded-xl border border-dashed border-slate-700/50">
                      <p className="text-slate-400">
                        لا توجد خبرات عملية مسجلة
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/50 shadow-sm">
                  <h3 className="text-lg font-semibold text-amber-400 mb-5 flex items-center gap-2 pb-3 border-b border-slate-800">
                    <FolderOpen className="w-5 h-5" />
                    مستندات التوثيق
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors text-center">
                      <p className="text-xs text-slate-400 mb-2">رقم الرخصة</p>
                      <p className="text-white font-bold text-lg">
                        {viewRequest.verification.lawyerLicenseNumber || "-"}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors text-center">
                      <p className="text-xs text-slate-400 mb-2">جهة الإصدار</p>
                      <p className="text-white font-bold text-lg">
                        {viewRequest.verification
                          .lawyerLicenseIssuingAuthority || "-"}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors text-center">
                      <p className="text-xs text-slate-400 mb-2">سنة الإصدار</p>
                      <p
                        className="text-white font-bold text-lg"
                        style={{ direction: "ltr" }}
                      >
                        {viewRequest.verification.lawyerLicenseYearOfIssue ||
                          "-"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-900/80 flex items-center justify-center border border-slate-700">
                          <FileText className="w-5 h-5 text-slate-400" />
                        </div>
                        <span className="text-slate-200 font-medium">
                          بطاقة الهوية (الأمام)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {viewRequest.verification.nationalIdFront ? (
                          <>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                              تم الرفع
                            </Badge>
                            {viewRequest.verification.nationalIdFront && (
                              <a
                                href={viewRequest.verification.nationalIdFront}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 transition-colors text-sm font-medium"
                              >
                                <Eye className="w-4 h-4" />
                                عرض
                              </a>
                            )}
                          </>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-400 border-red-500/20 px-3 py-1">
                            غير موجود
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-900/80 flex items-center justify-center border border-slate-700">
                          <FileText className="w-5 h-5 text-slate-400" />
                        </div>
                        <span className="text-slate-200 font-medium">
                          بطاقة الهوية (الخلف)
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {viewRequest.verification.nationalIdBack ? (
                          <>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                              تم الرفع
                            </Badge>
                            {viewRequest.verification.nationalIdBack && (
                              <a
                                href={viewRequest.verification.nationalIdBack}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 transition-colors text-sm font-medium"
                              >
                                <Eye className="w-4 h-4" />
                                عرض
                              </a>
                            )}
                          </>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-400 border-red-500/20 px-3 py-1">
                            غير موجود
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-900/80 flex items-center justify-center border border-slate-700">
                          <Award className="w-5 h-5 text-slate-400" />
                        </div>
                        <span className="text-slate-200 font-medium">
                          رخصة المحاماة
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {viewRequest.verification.lawyerLicense ? (
                          <>
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                              تم الرفع
                            </Badge>
                            <a
                              href={viewRequest.verification.lawyerLicense}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 transition-colors text-sm font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              عرض
                            </a>
                          </>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-400 border-red-500/20 px-3 py-1">
                            غير موجود
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {viewRequest.status === "UnderReview" && (
                  <DialogFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRejectDialogOpen(true);
                      }}
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                    >
                      <XCircle className="w-4 h-4 ml-2" />
                      رفض
                    </Button>
                    <Button
                      onClick={() => null}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <CheckCircle className="w-4 h-4 ml-2" />
                      الموافقة والتوثيق
                    </Button>
                  </DialogFooter>
                )}

                {viewRequest.status === "Pending" && (
                  <DialogFooter className="gap-2">
                    <p className="text-slate-400 text-sm w-full text-center">
                      هذا الطلب غير مكتمل من جهة المحامي ولا يمكن اتخاذ إجراء
                      حالياً.
                    </p>
                  </DialogFooter>
                )}

                {viewRequest.status === "Approved" && (
                  <DialogFooter className="gap-2">
                    <p className="text-emerald-400 text-sm w-full text-center">
                      تم توثيق هذا الطلب بالفعل.
                    </p>
                  </DialogFooter>
                )}

                {viewRequest.status === "Rejected" && (
                  <DialogFooter className="gap-2">
                    <p className="text-red-400 text-sm w-full text-center">
                      تم رفض هذا الطلب مسبقاً.
                    </p>
                  </DialogFooter>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">رفض طلب التوثيق</DialogTitle>
            <DialogDescription className="text-slate-400">
              يرجى توضيح أسباب رفض الطلب ليتمكن المحامي من إعادة التقديم
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="اكتب أسباب الرفض هنا..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="bg-slate-900/50 border-slate-600 text-white min-h-30"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              className="border-slate-600 text-slate-300"
            >
              إلغاء
            </Button>
            <Button
              onClick={() =>
                rejectMutation.mutate({
                  requestId: selectedRequestId!,
                  reason: rejectionReason,
                })
              }
              disabled={!rejectionReason}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              تأكيد الرفض
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const getVerificatoinStatusBadge = (status: string) => {
  switch (status) {
    case "Pending":
      return (
        <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20">
          غير مكتمل
        </Badge>
      );
    case "UnderReview":
      return (
        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
          قيد المراجعة
        </Badge>
      );
    case "Approved":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
          موافق عليه
        </Badge>
      );
    case "Rejected":
      return (
        <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
          مرفوض
        </Badge>
      );
    default:
      return null;
  }
};

export default LawyerVerification;
