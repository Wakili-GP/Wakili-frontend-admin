import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import {
  GraduationCap,
  Award,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  FileText,
  User,
  Calendar,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import credentialService, {
  type CredentialItem,
  type CredentialType,
  type CredentialStatus,
} from "@/services/credential-services";
import { Spinner } from "@/components/ui/spinner";
import { formatDateTime, timeAgo } from "@/lib/utils";
import { mockCredentialPreview } from "@/data/admin-dashboard";

const CredentialReview = () => {
  const [selectedCredentialId, setSelectedCredentialId] = useState<
    string | null
  >(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [sortDescending, setSortDescending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const queryClient = useQueryClient();

  const { data: credentials, isPending } = useQuery({
    queryKey: [
      "credentials",
      currentPage,
      pageSize,
      searchQuery,
      typeFilter,
      statusFilter,
      sortDescending,
    ],
    queryFn: () =>
      credentialService.getCredentials(
        currentPage,
        pageSize,
        searchQuery,
        typeFilter === "all" ? undefined : typeFilter,
        statusFilter === "all" ? undefined : statusFilter,
        sortDescending,
      ),
  });

  const mockCredentials: CredentialItem[] = [mockCredentialPreview];
  const shouldUseMockData = !credentials || credentials.totalCount === 0;

  const mockFiltered = mockCredentials
    .filter((cred) => {
      const fullName =
        `${cred.lawyerFirstName} ${cred.lawyerLastName}`.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        fullName.includes(searchQuery.trim().toLowerCase());
      const matchesType = typeFilter === "all" || cred.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || cred.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      const aTime = new Date(a.submittedAt).getTime();
      const bTime = new Date(b.submittedAt).getTime();
      return sortDescending ? bTime - aTime : aTime - bTime;
    });

  const mockTotalPages = Math.max(1, Math.ceil(mockFiltered.length / pageSize));
  const mockActivePage = Math.min(currentPage, mockTotalPages);
  const mockPageItems = mockFiltered.slice(
    (mockActivePage - 1) * pageSize,
    mockActivePage * pageSize,
  );

  const meta = shouldUseMockData
    ? {
        totalEducation: mockCredentials.filter((c) => c.type === "Education")
          .length,
        totalCertifications: mockCredentials.filter(
          (c) => c.type === "Certification",
        ).length,
        totalExperience: mockCredentials.filter(
          (c) => c.type === "WorkExperience",
        ).length,
      }
    : credentials.meta;

  const { data: viewCredential } = useQuery({
    queryKey: ["credential", selectedCredentialId],
    queryFn: () => credentialService.getCredentialById(selectedCredentialId!),
    enabled: !!selectedCredentialId && !shouldUseMockData,
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => credentialService.approveCredential(id),
    onSuccess: () => {
      setSelectedCredentialId(null);
      toast.success("تمت الموافقة على المستند بنجاح");
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
    },
    onError: () => toast.error("حدث خطأ أثناء الموافقة"),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      credentialService.rejectCredential(id, reason),
    onSuccess: () => {
      setSelectedCredentialId(null);
      setRejectionReason("");
      toast.success("تم رفض المستند");
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
    },
    onError: () => toast.error("حدث خطأ أثناء الرفض"),
  });

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error("يرجى إدخال سبب الرفض");
      return;
    }
    if (!selectedCredentialId) return;
    rejectMutation.mutate({
      id: selectedCredentialId,
      reason: rejectionReason,
    });
  };

  const items = shouldUseMockData ? mockPageItems : (credentials?.items ?? []);
  const totalPages = shouldUseMockData
    ? mockTotalPages
    : Math.max(1, credentials?.totalPages ?? 1);
  const activePage = Math.min(currentPage, totalPages);
  const pageStart = items.length ? (activePage - 1) * pageSize + 1 : 0;
  const pageEnd = items.length ? pageStart + items.length - 1 : 0;
  const totalCount = shouldUseMockData
    ? mockFiltered.length
    : (credentials?.totalCount ?? 0);
  const activeCredential = shouldUseMockData
    ? (items.find((item) => item.id === selectedCredentialId) ?? null)
    : (viewCredential ?? null);

  const getTypeLabel = (type: CredentialType) => {
    const map: Record<CredentialType, string> = {
      Education: "تعليم",
      Certification: "شهادة",
      WorkExperience: "خبرة",
    };
    return map[type] ?? type;
  };

  const getTypeIcon = (type: CredentialType) => {
    if (type === "Education") return <GraduationCap className="w-4 h-4" />;
    if (type === "Certification") return <Award className="w-4 h-4" />;
    return <Briefcase className="w-4 h-4" />;
  };

  const getStatusBadge = (status: CredentialStatus) => {
    if (status === "Pending")
      return (
        <Badge className="bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3 ml-1" /> قيد المراجعة
        </Badge>
      );
    if (status === "Approved")
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle className="w-3 h-3 ml-1" /> موافق عليه
        </Badge>
      );
    return (
      <Badge className="bg-red-50 text-red-700 border border-red-200">
        <XCircle className="w-3 h-3 ml-1" /> مرفوض
      </Badge>
    );
  };

  const renderDetails = (cred: CredentialItem) => {
    if (cred.type === "Education")
      return (
        <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-sm text-gray-700">
            <span className="text-gray-500 font-medium">الدرجة:</span>{" "}
            {cred.degree || "-"}
          </p>
          <p className="text-sm text-gray-700">
            <span className="text-gray-500 font-medium">التخصص:</span>{" "}
            {cred.fieldOfStudy || "-"}
          </p>
          <p className="text-sm text-gray-700">
            <span className="text-gray-500 font-medium">الجامعة:</span>{" "}
            {cred.university || "-"}
          </p>
          <p className="text-sm text-gray-700">
            <span className="text-gray-500 font-medium">سنة التخرج:</span>{" "}
            {cred.graduationYear || "-"}
          </p>
          {cred.documentUrl && (
            <a
              href={cred.documentUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm mt-2"
            >
              <ExternalLink className="w-4 h-4" /> عرض الوثيقة
            </a>
          )}
        </div>
      );
    if (cred.type === "Certification")
      return (
        <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <p className="text-sm text-gray-700">
            <span className="text-gray-500 font-medium">اسم الشهادة:</span>{" "}
            {cred.certName || "-"}
          </p>
          <p className="text-sm text-gray-700">
            <span className="text-gray-500 font-medium">جهة الإصدار:</span>{" "}
            {cred.certIssuer || "-"}
          </p>
          <p className="text-sm text-gray-700">
            <span className="text-gray-500 font-medium">سنة الإصدار:</span>{" "}
            {cred.certYear || "-"}
          </p>
          {cred.certDocumentUrl && (
            <a
              href={cred.certDocumentUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm mt-2"
            >
              <ExternalLink className="w-4 h-4" /> عرض الوثيقة
            </a>
          )}
        </div>
      );
    return (
      <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-5">
        <p className="text-sm text-gray-700">
          <span className="text-gray-500 font-medium">المسمى الوظيفي:</span>{" "}
          {cred.jobTitle || "-"}
        </p>
        <p className="text-sm text-gray-700">
          <span className="text-gray-500 font-medium">جهة العمل:</span>{" "}
          {cred.organizationName || "-"}
        </p>
        <p className="text-sm text-gray-700">
          <span className="text-gray-500 font-medium">الفترة:</span>{" "}
          {cred.startYear || "-"} -{" "}
          {cred.isCurrentJob ? "حتى الآن" : cred.endYear || "-"}
        </p>
        <p className="text-sm text-gray-700">
          <span className="text-gray-500 font-medium">الوصف:</span>{" "}
          {cred.description || "-"}
        </p>
      </div>
    );
  };

  if (isPending)
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Spinner className="w-10 h-10 text-primary animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          مراجعة المؤهلات والشهادات
        </h1>
        <p className="text-gray-500 mt-1">
          مراجعة واعتماد المؤهلات المقدمة من المحامين
        </p>
      </div>

      {/* 3 Stat Cards: Education / Certification / Experience */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {meta.totalEducation}
              </p>
              <p className="text-sm text-gray-500">مؤهلات تعليمية</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {meta.totalCertifications}
              </p>
              <p className="text-sm text-gray-500">شهادات مهنية</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {meta.totalExperience}
              </p>
              <p className="text-sm text-gray-500">خبرات عملية</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="ابحث باسم المحامي..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pr-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <Select
              dir="rtl"
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-44 bg-gray-50 border-gray-200 text-gray-700">
                <Filter className="w-4 h-4 ml-2 text-gray-400" />
                <SelectValue placeholder="نوع المؤهل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الأنواع</SelectItem>
                <SelectItem value="Education">تعليم</SelectItem>
                <SelectItem value="Certification">شهادة</SelectItem>
                <SelectItem value="WorkExperience">خبرة</SelectItem>
              </SelectContent>
            </Select>
            <Select
              dir="rtl"
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-44 bg-gray-50 border-gray-200 text-gray-700">
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الحالات</SelectItem>
                <SelectItem value="Pending">قيد المراجعة</SelectItem>
                <SelectItem value="Approved">موافق عليه</SelectItem>
                <SelectItem value="Rejected">مرفوض</SelectItem>
              </SelectContent>
            </Select>
            <Select
              dir="rtl"
              value={sortDescending ? "desc" : "asc"}
              onValueChange={(v) => {
                setSortDescending(v === "desc");
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-44 bg-gray-50 border-gray-200 text-gray-700">
                <Clock className="w-4 h-4 ml-2 text-gray-400" />
                <SelectValue placeholder="الترتيب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">الأحدث أولاً</SelectItem>
                <SelectItem value="asc">الأقدم أولاً</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 bg-gray-50/80">
                <TableHead className="text-gray-600 text-right">
                  المحامي
                </TableHead>
                <TableHead className="text-gray-600 text-center">
                  النوع
                </TableHead>
                <TableHead className="text-gray-600 text-center">
                  تاريخ التقديم
                </TableHead>
                <TableHead className="text-gray-600 text-center">
                  الحالة
                </TableHead>
                <TableHead className="text-gray-600 text-center">
                  تمت بواسطة
                </TableHead>
                <TableHead className="text-gray-600 text-center">
                  تاريخ القرار
                </TableHead>
                <TableHead className="text-gray-600 text-center">
                  إجراء
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length > 0 ? (
                items.map((cred) => (
                  <TableRow
                    key={cred.id}
                    className="border-gray-100 hover:bg-gray-50/60 transition-colors"
                  >
                    <TableCell className="text-right">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                          {cred.lawyerProfileImage ? (
                            <img
                              src={cred.lawyerProfileImage}
                              alt=""
                              className="w-9 h-9 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium text-sm">
                            {cred.lawyerFirstName} {cred.lawyerLastName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {cred.lawyerEmail}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className="border-gray-200 text-gray-600 inline-flex items-center gap-1"
                      >
                        {getTypeIcon(cred.type)} {getTypeLabel(cred.type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-gray-500 text-sm">
                      <div className="space-y-0.5">
                        <p>{formatDateTime(cred.submittedAt)}</p>
                        <p className="text-xs text-gray-400">
                          {timeAgo(cred.submittedAt)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(cred.status)}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {cred.reviewedBy ? (
                        <span
                          className={
                            cred.status === "Approved"
                              ? "text-emerald-600"
                              : "text-red-600"
                          }
                        >
                          {cred.reviewedBy}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-sm text-gray-500">
                      {cred.reviewedAt ? (
                        <div className="space-y-0.5">
                          <p>{formatDateTime(cred.reviewedAt)}</p>
                          <p className="text-xs text-gray-400">
                            {timeAgo(cred.reviewedAt)}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCredentialId(cred.id)}
                        className="text-primary hover:text-primary/80 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4 ml-1" /> مراجعة
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-gray-400"
                  >
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    لا توجد نتائج مطابقة
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="px-4 py-4 border-t border-gray-100 flex flex-col md:flex-row gap-3 items-center justify-between">
            <p className="text-sm text-gray-500">
              عرض {pageStart} - {pageEnd} من {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <Select
                value={String(pageSize)}
                onValueChange={(v) => {
                  setPageSize(Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-24 bg-gray-50 border-gray-200 text-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-200"
                disabled={activePage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600 px-2">
                صفحة {activePage} من {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-200"
                disabled={activePage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Modal */}
      <Dialog
        open={!!selectedCredentialId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCredentialId(null);
            setRejectionReason("");
          }
        }}
      >
        <DialogContent className="bg-white border-gray-200 max-w-2xl max-h-[90vh] overflow-y-auto [&>button]:left-4 [&>button]:right-auto">
          <DialogHeader className="mt-4">
            <DialogTitle className="text-gray-900 text-xl text-center">
              مراجعة المستند
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-center">
              تحقق من البيانات قبل اتخاذ القرار
            </DialogDescription>
          </DialogHeader>

          {activeCredential && (
            <div className="space-y-5">
              {/* Lawyer Info */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden">
                      {activeCredential.lawyerProfileImage ? (
                        <img
                          src={activeCredential.lawyerProfileImage}
                          alt=""
                          className="w-11 h-11 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-gray-900 font-semibold flex items-center gap-2">
                        {activeCredential.lawyerFirstName}{" "}
                        {activeCredential.lawyerLastName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {activeCredential.lawyerEmail}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" /> تاريخ التقديم:{" "}
                        {formatDateTime(activeCredential.submittedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="border-gray-200 text-gray-600 inline-flex items-center gap-1"
                    >
                      {getTypeIcon(activeCredential.type)}{" "}
                      {getTypeLabel(activeCredential.type)}
                    </Badge>
                    {getStatusBadge(activeCredential.status)}
                  </div>
                </div>
              </div>

              {/* Credential Details */}
              {renderDetails(activeCredential)}

              {/* Rejection reason for already rejected */}
              {activeCredential.status === "Rejected" &&
                activeCredential.rejectionReason && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-700 mb-1">
                      سبب الرفض:
                    </p>
                    <p className="text-sm text-red-600">
                      {activeCredential.rejectionReason}
                    </p>
                  </div>
                )}

              {/* Rejection textarea for pending */}
              {activeCredential.status === "Pending" && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    سبب الرفض (مطلوب في حالة الرفض)
                  </p>
                  <Textarea
                    placeholder="أدخل سبب الرفض هنا..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 min-h-20"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-2 gap-2">
            {activeCredential?.status === "Pending" && (
              <>
                <Button
                  variant="outline"
                  disabled={
                    rejectMutation.isPending || approveMutation.isPending
                  }
                  onClick={handleReject}
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <XCircle className="w-4 h-4 ml-1" />
                  {rejectMutation.isPending ? "جارٍ الرفض..." : "رفض"}
                </Button>
                <Button
                  disabled={
                    approveMutation.isPending || rejectMutation.isPending
                  }
                  onClick={() =>
                    selectedCredentialId &&
                    approveMutation.mutate(selectedCredentialId)
                  }
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 ml-1" />
                  {approveMutation.isPending ? "جارٍ الموافقة..." : "موافقة"}
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedCredentialId(null);
                setRejectionReason("");
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CredentialReview;
