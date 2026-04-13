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
  IdCard,
  Award,
  Clock,
  Filter,
  Briefcase,
  FolderOpen,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import verificationService from "@/services/verification-service";
import type {
  Education,
  Certification,
  WorkExperience,
} from "@/services/verification-service";
import { formatDateTime, timeAgo } from "@/lib/utils";

const getVerificatoinStatusBadge = (status: string) => {
  switch (status) {
    case "Pending":
      return (
        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
          معلق
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

const LawyerVerification = () => {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Status Filters
  // status: 0 = Pending, 1 = UnderReview, 2 = Approved, 3 = Rejected
  const [statusFilter, setStatusFilter] = useState("all");
  const statusMap: Record<string, number | undefined> = {
    all: undefined,
    Pending: 0,
    UnderReview: 1,
    Approved: 2,
    Rejected: 3,
  };

  // Fetching Request Table
  const { data: requests } = useQuery({
    queryKey: ["verificationRequests", statusFilter],
    queryFn: async () =>
      verificationService.getVerificationRequests(
        statusMap[statusFilter || "all"],
      ),
  });

  // Fetching A Full Request by Id
  const { data: viewRequest } = useQuery({
    queryKey: ["verificationRequest", selectedRequestId],
    queryFn: () =>
      verificationService.getVerificationRequestById(selectedRequestId!),
    enabled: !!selectedRequestId,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">توثيق المحامين</h1>
        <p className="text-slate-400 mt-1">إدارة طلبات توثيق حسابات المحامين</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {requests?.filter((req) => req.status === "Pending")?.length}
              </p>
              <p className="text-sm text-slate-400">طلبات معلقة</p>
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
                {requests?.filter((req) => req.status === "Approved")?.length}
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
                {requests?.filter((req) => req.status === "Rejected")?.length}
              </p>
              <p className="text-sm text-slate-400">مرفوضة</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="البحث بالاسم أو البريد الإلكتروني..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-slate-900/50 border-slate-600 text-white"
              />
            </div>
            <Select
              dir="rtl"
              value={statusFilter}
              onValueChange={setStatusFilter}
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
                <SelectItem className="cursor-pointer" value="approved">
                  موافق عليه
                </SelectItem>
                <SelectItem className="cursor-pointer" value="rejected">
                  مرفوض
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-amber-500" />
            طلبات التوثيق
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requests ? (
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
                    الحالة
                  </TableHead>
                  <TableHead className="text-slate-400 text-center">
                    الإجراءات
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests?.map((request) => (
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
                      {request.specializations
                        ?.split(",")
                        .map((s: string, i: number) => (
                          <Badge
                            variant="outline"
                            className={
                              i & 1
                                ? "border-purple-500/20 text-purple-400"
                                : "border-blue-500/20 text-blue-400"
                            }
                            key={i}
                          >
                            {s.trim()}
                          </Badge>
                        ))}
                    </TableCell>
                    <TableCell className="text-slate-400 text-center">
                      <div className="space-y-1">
                        <p> {formatDateTime(request.submittedAt)}</p>
                        <p className="text-xs text-slate-500">
                          {timeAgo(request.submittedAt)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getVerificatoinStatusBadge(request.status)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
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
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">لا يوجد مستخدمين مطابقين للبحث</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog - Full Details */}
      <Dialog
        open={!!selectedRequestId}
        onOpenChange={(open) => {
          if (!open) setSelectedRequestId(null);
        }}
      >
        <DialogContent className="bg-slate-800 border-slate-700 w-200 max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col [&>button]:left-4 [&>button]:right-auto">
          {" "}
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              تفاصيل طلب التوثيق
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {viewRequest?.status === "Approved"
                ? "تم الموافقة علي طلب توثيق هذا المحامي"
                : "مراجعة جميع البيانات المقدمة من المحامي"}
            </DialogDescription>
          </DialogHeader>
          {viewRequest && (
            <div
              className="space-y-6 overflow-y-auto pl-4 -mr-2 pr-2 dialog-scroll"
              style={{
                direction: "rtl",
                scrollbarWidth: "thin",
                scrollbarColor: "#475569 transparent",
              }}
            >
              {/* Basic Info Section */}
              <div className="p-4 rounded-lg bg-slate-900/50">
                <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  المعلومات الأساسية
                </h3>
                <div className="flex items-start gap-4 mb-4">
                  {viewRequest.profileImage ? (
                    <img
                      src={viewRequest.profileImage}
                      alt={viewRequest.firstName}
                      className="w-20 h-20 rounded-full object-cover border-2 border-amber-500/30"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center border-2 border-amber-500/30">
                      <Briefcase className="w-8 h-8 text-purple-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white">
                      {viewRequest.firstName} {viewRequest.lastName}
                    </h4>
                    <p className="text-slate-400 text-sm mt-1 wrap-break-word whitespace-pre-wrap">
                      {viewRequest.bio}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400 mb-1">
                      البريد الإلكتروني
                    </p>
                    <p className="text-white text-sm">{viewRequest.email}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400 mb-1">رقم الهاتف</p>
                    <p className="text-white text-sm">{viewRequest.phone}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400 mb-1">الموقع</p>
                    <p className="text-white text-sm">
                      {viewRequest.location.city}،{" "}
                      {viewRequest.location.country}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400 mb-1">سنوات الخبرة</p>
                    <p className="text-white text-sm">
                      {viewRequest.yearsExperience} سنة
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400 mb-1">التخصصات</p>
                    <div className="flex flex-wrap gap-1">
                      {viewRequest.specialty.map((s: string, i: number) => (
                        <Badge
                          key={i}
                          className="bg-amber-500/10 text-amber-400 text-xs"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400 mb-1">أنواع الجلسات</p>
                    <div className="flex flex-wrap gap-1">
                      {viewRequest.sessionTypes.map((s: string, i: number) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="border-slate-600 text-slate-300 text-xs"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Education Section */}
              <div className="p-4 rounded-lg bg-slate-900/50">
                <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  المؤهلات العلمية
                </h3>
                {viewRequest.education.length > 0 ? (
                  <div className="space-y-3">
                    {viewRequest.education.map((edu: Education, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-slate-800/50 border-r-2 border-amber-500"
                      >
                        <p className="text-white font-medium">
                          {edu.degreeType} في {edu.fieldOfStudy}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {edu.university} - {edu.graduationYear}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">لا توجد مؤهلات علمية مسجلة</p>
                )}
              </div>

              {/* Certifications Section */}
              <div className="p-4 rounded-lg bg-slate-900/50">
                <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  الشهادات المهنية
                </h3>
                {viewRequest.certifications.length > 0 ? (
                  <div className="space-y-3">
                    {viewRequest.certifications.map(
                      (cert: Certification, i: number) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-slate-800/50 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-white font-medium">
                              {cert.name}
                            </p>
                            <p className="text-slate-400 text-sm">
                              {cert.issuingOrg} - {cert.yearObtained}
                            </p>
                          </div>
                          {cert.documentUrl && (
                            <a
                              href={cert.documentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1"
                            >
                              <FileText className="w-4 h-4" />
                              عرض
                            </a>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-slate-400">لا توجد شهادات مهنية مسجلة</p>
                )}
              </div>

              {/* Work Experience Section */}
              <div className="p-4 rounded-lg bg-slate-900/50">
                <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  الخبرات العملية
                </h3>
                {viewRequest.workExperience.length > 0 ? (
                  <div className="space-y-3">
                    {viewRequest.workExperience.map(
                      (exp: WorkExperience, i: number) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-slate-800/50 border-r-2 border-emerald-500"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-white font-medium">
                                {exp.jobTitle}
                              </p>
                              <p className="text-slate-300 text-sm">
                                {exp.organizationName}
                              </p>
                            </div>
                            <Badge
                              className={
                                exp.isCurrentJob
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-slate-700 text-slate-300"
                              }
                            >
                              {exp.isCurrentJob
                                ? "حالياً"
                                : `${exp.startYear} - ${exp.endYear}`}
                            </Badge>
                          </div>
                          // Work experience description
                          <p className="text-slate-400 text-sm mt-2 wrap-break-word whitespace-pre-wrap">
                            {exp.description}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-slate-400">لا توجد خبرات عملية مسجلة</p>
                )}
              </div>

              {/* Verification Documents Section */}
              <div className="p-4 rounded-lg bg-slate-900/50">
                <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                  <IdCard className="w-5 h-5" />
                  مستندات التوثيق
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400 mb-1">رقم الرخصة</p>
                    <p className="text-white font-medium">
                      {viewRequest.licenseNumber}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400 mb-1">جهة الإصدار</p>
                    <p className="text-white font-medium">
                      {viewRequest.issuingAuthority}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400 mb-1">سنة الإصدار</p>
                    <p className="text-white font-medium">
                      {viewRequest.licenseYear}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400 mb-1">
                      رقم القيد بالنقابة
                    </p>
                    <p className="text-white font-medium">
                      {viewRequest.barNumber}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-2">
                      <IdCard className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">الهوية الحكومية</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {viewRequest.documents.governmentId ? (
                        <>
                          <Badge className="bg-emerald-500/10 text-emerald-400">
                            تم الرفع
                          </Badge>
                          {viewRequest.documents.governmentIdUrl && (
                            <a
                              href={viewRequest.documents.governmentIdUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-400 hover:text-amber-300 text-sm"
                            >
                              عرض
                            </a>
                          )}
                        </>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-400">
                          غير موجود
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">رخصة المحاماة</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {viewRequest.documents.professionalLicense ? (
                        <>
                          <Badge className="bg-emerald-500/10 text-emerald-400">
                            تم الرفع
                          </Badge>
                          {viewRequest.documents.professionalLicenseUrl && (
                            <a
                              href={
                                viewRequest.documents.professionalLicenseUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-400 hover:text-amber-300 text-sm"
                            >
                              عرض
                            </a>
                          )}
                        </>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-400">
                          غير موجود
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">التحقق من الهوية</span>
                    </div>
                    {viewRequest.documents.identityVerification ? (
                      <Badge className="bg-emerald-500/10 text-emerald-400">
                        تم التحقق
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-400">
                        لم يتم التحقق
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Education Certificates */}
                {viewRequest.documents.educationCertificates.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-slate-400 mb-2">
                      الشهادات التعليمية المرفقة:
                    </p>
                    <div className="space-y-2">
                      {viewRequest.documents.educationCertificates.map(
                        (doc: { name: string; url: string }, i: number) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 rounded bg-slate-800/30"
                          >
                            <span className="text-slate-300 text-sm">
                              {doc.name}
                            </span>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" />
                              عرض
                            </a>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>

              {viewRequest.status === "Pending" && (
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
              onClick={() => null}
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

export default LawyerVerification;
