import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Eye,
  FileText,
  User,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface PendingCredential {
  id: string;
  lawyerId: string;
  lawyerName: string;
  lawyerImage: string;
  type: "education" | "certificate" | "experience";
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  // Education fields
  degree?: string;
  field?: string;
  university?: string;
  year?: string;
  diplomaUrl?: string;
  // Certificate fields
  certName?: string;
  certIssuer?: string;
  certYear?: string;
  certDocumentUrl?: string;
  // Experience fields
  expTitle?: string;
  expCompany?: string;
  expStartYear?: string;
  expEndYear?: string;
  expDescription?: string;
}

const initialCredentials: PendingCredential[] = [
  {
    id: "1",
    lawyerId: "1",
    lawyerName: "د. أحمد سليمان",
    lawyerImage:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=100&h=100&fit=crop",
    type: "education",
    submittedAt: "2024-12-01",
    status: "pending",
    degree: "دكتوراه",
    field: "القانون الدولي",
    university: "جامعة الأزهر",
    year: "2023",
    diplomaUrl: "#diploma-doc",
  },
  {
    id: "2",
    lawyerId: "2",
    lawyerName: "سارة محمود",
    lawyerImage:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    type: "certificate",
    submittedAt: "2024-11-28",
    status: "pending",
    certName: "شهادة المحكم الدولي",
    certIssuer: "غرفة التجارة الدولية",
    certYear: "2024",
    certDocumentUrl: "#cert-doc",
  },
  {
    id: "3",
    lawyerId: "3",
    lawyerName: "خالد عبدالرحمن",
    lawyerImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    type: "experience",
    submittedAt: "2024-11-25",
    status: "pending",
    expTitle: "مستشار قانوني أول",
    expCompany: "بنك مصر",
    expStartYear: "2020",
    expEndYear: "2024",
    expDescription:
      "تقديم الاستشارات القانونية للبنك في المعاملات التجارية الدولية",
  },
  {
    id: "4",
    lawyerId: "1",
    lawyerName: "د. أحمد سليمان",
    lawyerImage:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=100&h=100&fit=crop",
    type: "certificate",
    submittedAt: "2024-11-20",
    status: "approved",
    certName: "شهادة التحكيم التجاري",
    certIssuer: "مركز القاهرة للتحكيم",
    certYear: "2023",
    certDocumentUrl: "#cert-doc-2",
  },
  {
    id: "5",
    lawyerId: "4",
    lawyerName: "منى الشافعي",
    lawyerImage:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    type: "education",
    submittedAt: "2024-11-18",
    status: "rejected",
    degree: "ماجستير",
    field: "القانون الجنائي",
    university: "جامعة عين شمس",
    year: "2022",
    diplomaUrl: "#diploma-doc-2",
  },
];

const CredentialReview = () => {
  const [credentials, setCredentials] =
    useState<PendingCredential[]>(initialCredentials);
  const [selectedCredential, setSelectedCredential] =
    useState<PendingCredential | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  const pendingCount = credentials.filter((c) => c.status === "pending").length;
  const approvedCount = credentials.filter(
    (c) => c.status === "approved",
  ).length;
  const rejectedCount = credentials.filter(
    (c) => c.status === "rejected",
  ).length;

  const handleApprove = (id: string) => {
    setCredentials((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "approved" as const } : c,
      ),
    );
    setShowReviewModal(false);
    setSelectedCredential(null);
    // toast.success("تمت الموافقة على المستند بنجاح", {
    //   style: {
    //     "--normal-bg":
    //       "color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))",
    //     "--normal-text":
    //       "light-dark(var(--color-green-600), var(--color-green-400))",
    //     "--normal-border":
    //       "light-dark(var(--color-green-600), var(--color-green-400))",
    //   } as React.CSSProperties,
    // });
    toast.success("تمت الموافقة على المستند بنجاح");
  };

  const handleReject = (id: string) => {
    if (!rejectionReason.trim()) {
      toast.error("يرجى إدخال سبب الرفض");
      return;
    }
    setCredentials((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "rejected" as const } : c,
      ),
    );
    setShowReviewModal(false);
    setSelectedCredential(null);
    setRejectionReason("");
    toast.success("تم رفض المستند وإرسال إشعار للمحامي");
  };

  const openReviewModal = (credential: PendingCredential) => {
    setSelectedCredential(credential);
    setShowReviewModal(true);
    setRejectionReason("");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "education":
        return <GraduationCap className="w-4 h-4" />;
      case "certificate":
        return <Award className="w-4 h-4" />;
      case "experience":
        return <Briefcase className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "education":
        return "مؤهل علمي";
      case "certificate":
        return "شهادة مهنية";
      case "experience":
        return "خبرة عملية";
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/20">
            <Clock className="w-3 h-3 ml-1" />
            قيد المراجعة
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20">
            <CheckCircle className="w-3 h-3 ml-1" />
            موافق عليه
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/20">
            <XCircle className="w-3 h-3 ml-1" />
            مرفوض
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCredentialTitle = (cred: PendingCredential) => {
    switch (cred.type) {
      case "education":
        return `${cred.degree} في ${cred.field}`;
      case "certificate":
        return cred.certName;
      case "experience":
        return `${cred.expTitle} - ${cred.expCompany}`;
      default:
        return "";
    }
  };

  const filteredCredentials = credentials.filter((c) => {
    if (activeTab === "pending") return c.status === "pending";
    if (activeTab === "approved") return c.status === "approved";
    if (activeTab === "rejected") return c.status === "rejected";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          مراجعة المؤهلات والشهادات
        </h1>
        <p className="text-slate-400 mt-1">
          مراجعة واعتماد المؤهلات والشهادات المقدمة من المحامين
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">في انتظار المراجعة</p>
                <p className="text-3xl font-bold text-amber-400 mt-1">
                  {pendingCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">تمت الموافقة</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">
                  {approvedCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">مرفوضة</p>
                <p className="text-3xl font-bold text-red-400 mt-1">
                  {rejectedCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs dir="rtl" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-800 border-slate-700">
          <TabsTrigger
            value="pending"
            className="cursor-pointer data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400"
          >
            قيد المراجعة ({pendingCount})
          </TabsTrigger>
          <TabsTrigger
            value="approved"
            className="cursor-pointer data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400"
          >
            موافق عليها ({approvedCount})
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            className="cursor-pointer data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400"
          >
            مرفوضة ({rejectedCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700 hover:bg-slate-900/50">
                    <TableHead className="text-center text-slate-400">
                      المحامي
                    </TableHead>
                    <TableHead className="text-center text-slate-400">
                      النوع
                    </TableHead>
                    <TableHead className="text-center text-slate-400">
                      التفاصيل
                    </TableHead>
                    <TableHead className="text-center text-slate-400">
                      تاريخ التقديم
                    </TableHead>
                    <TableHead className="text-center text-slate-400">
                      الحالة
                    </TableHead>
                    <TableHead className="text-center text-slate-400">
                      الإجراءات
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-center">
                  {filteredCredentials.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-slate-400 py-8"
                      >
                        لا توجد طلبات في هذه الفئة
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCredentials.map((cred) => (
                      <TableRow
                        key={cred.id}
                        className="text-center border-slate-700 hover:bg-slate-900/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3 justify-center">
                            <img
                              src={cred.lawyerImage}
                              alt={cred.lawyerName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="text-white font-medium">
                              {cred.lawyerName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2 text-slate-300">
                            {getTypeIcon(cred.type)}
                            <span>{getTypeLabel(cred.type)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-300 max-w-xs truncate">
                          {getCredentialTitle(cred)}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {cred.submittedAt}
                        </TableCell>
                        <TableCell>{getStatusBadge(cred.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openReviewModal(cred)}
                            className="cursor-pointer text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                          >
                            <Eye className="w-4 h-4 ml-1" />
                            مراجعة
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent
          className="bg-slate-800 border-slate-700 max-w-2xl"
          dir="rtl"
        >
          <DialogHeader className="mt-4">
            <DialogTitle className="text-white flex items-center justify-center gap-2">
              <Eye className="text-white w-7 h-7" />
              مراجعة{" "}
              {selectedCredential && getTypeLabel(selectedCredential.type)}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-center">
              راجع التفاصيل والمستندات المرفقة قبل اتخاذ القرار
            </DialogDescription>
          </DialogHeader>

          {selectedCredential && (
            <div className="space-y-6 mt-4">
              {/* Lawyer Info */}
              <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <img
                  src={selectedCredential.lawyerImage}
                  alt={selectedCredential.lawyerName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-white font-medium">
                      {selectedCredential.lawyerName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400 text-sm">
                      تاريخ التقديم: {selectedCredential.submittedAt}
                    </span>
                  </div>
                </div>
              </div>

              {/* Credential Details */}
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  {getTypeIcon(selectedCredential.type)}
                  <span className="text-white font-medium">
                    {getTypeLabel(selectedCredential.type)}
                  </span>
                  {getStatusBadge(selectedCredential.status)}
                </div>

                {selectedCredential.type === "education" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">الدرجة العلمية</p>
                      <p className="text-white font-medium">
                        {selectedCredential.degree}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">التخصص</p>
                      <p className="text-white font-medium">
                        {selectedCredential.field}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">الجامعة</p>
                      <p className="text-white font-medium">
                        {selectedCredential.university}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">سنة التخرج</p>
                      <p className="text-white font-medium">
                        {selectedCredential.year}
                      </p>
                    </div>
                    {selectedCredential.diplomaUrl && (
                      <div className="col-span-2">
                        <p className="text-sm text-slate-400 mb-2">
                          شهادة التخرج
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <a
                            href={selectedCredential.diplomaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText className="w-4 h-4 ml-2" />
                            عرض المستند
                            <ExternalLink className="w-3 h-3 mr-2" />
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {selectedCredential.type === "certificate" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <p className="text-sm text-slate-400">اسم الشهادة</p>
                      <p className="text-white font-medium">
                        {selectedCredential.certName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">الجهة المانحة</p>
                      <p className="text-white font-medium">
                        {selectedCredential.certIssuer}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">سنة الحصول</p>
                      <p className="text-white font-medium">
                        {selectedCredential.certYear}
                      </p>
                    </div>
                    {selectedCredential.certDocumentUrl && (
                      <div className="col-span-2">
                        <p className="text-sm text-slate-400 mb-2">
                          المستند المرفق
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <a
                            href={selectedCredential.certDocumentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText className="w-4 h-4 ml-2" />
                            عرض المستند
                            <ExternalLink className="w-3 h-3 mr-2" />
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {selectedCredential.type === "experience" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-400">المسمى الوظيفي</p>
                      <p className="text-white font-medium">
                        {selectedCredential.expTitle}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">جهة العمل</p>
                      <p className="text-white font-medium">
                        {selectedCredential.expCompany}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">فترة العمل</p>
                      <p className="text-white font-medium">
                        {selectedCredential.expStartYear} -{" "}
                        {selectedCredential.expEndYear}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-slate-400">الوصف</p>
                      <p className="text-slate-300">
                        {selectedCredential.expDescription}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Rejection Reason (only for pending) */}
              {selectedCredential.status === "pending" && (
                <div className="space-y-2">
                  <label className="text-sm text-slate-300 mb-2">
                    سبب الرفض (مطلوب في حالة الرفض)
                  </label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="أدخل سبب الرفض ليتم إرساله للمحامي..."
                    className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 mt-4">
            {selectedCredential?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedCredential.id)}
                  className="cursor-pointer border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <XCircle className="w-4 h-4 ml-2" />
                  رفض
                </Button>
                <Button
                  onClick={() => handleApprove(selectedCredential.id)}
                  className="cursor-pointer bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle className="w-4 h-4 ml-2" />
                  موافقة
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              onClick={() => setShowReviewModal(false)}
              className="cursor-pointer text-slate-400 hover:text-slate-300"
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
