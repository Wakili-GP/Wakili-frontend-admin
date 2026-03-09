import { useState, useEffect } from "react";
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
  Loader,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

/* ---------------- MOCK DATA ---------------- */

const mockCredentials: PendingCredential[] = [
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
    diplomaUrl: "#",
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
    certDocumentUrl: "#",
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
    expDescription: "تقديم الاستشارات القانونية للبنك",
  },
];

/* ---------------- COMPONENT ---------------- */

const CredentialReview = () => {
  const [credentials, setCredentials] = useState<PendingCredential[]>([]);
  const [selectedCredential, setSelectedCredential] =
    useState<PendingCredential | null>(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const [activeTab, setActiveTab] = useState("pending");

  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  /* ---------------- LOAD MOCK DATA ---------------- */

  useEffect(() => {
    setTimeout(() => {
      setCredentials(mockCredentials);
      setIsLoading(false);
    }, 600);
  }, []);

  /* ---------------- COUNTS ---------------- */

  const pendingCount = credentials.filter((c) => c.status === "pending").length;

  const approvedCount = credentials.filter(
    (c) => c.status === "approved",
  ).length;

  const rejectedCount = credentials.filter(
    (c) => c.status === "rejected",
  ).length;

  /* ---------------- ACTIONS ---------------- */

  const handleApprove = (id: string) => {
    setIsApproving(true);

    setTimeout(() => {
      setCredentials((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "approved" } : c)),
      );

      setShowReviewModal(false);
      setSelectedCredential(null);
      setIsApproving(false);

      toast.success("تمت الموافقة على المستند");
    }, 600);
  };

  const handleReject = (id: string) => {
    if (!rejectionReason.trim()) {
      toast.error("يرجى إدخال سبب الرفض");
      return;
    }

    setIsRejecting(true);

    setTimeout(() => {
      setCredentials((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "rejected", rejectionReason } : c,
        ),
      );

      setShowReviewModal(false);
      setSelectedCredential(null);
      setRejectionReason("");

      setIsRejecting(false);

      toast.success("تم رفض المستند");
    }, 600);
  };

  const openReviewModal = (cred: PendingCredential) => {
    setSelectedCredential(cred);
    setShowReviewModal(true);
  };

  /* ---------------- HELPERS ---------------- */

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-500/20 text-amber-400">
            <Clock className="w-3 h-3 ml-1" />
            قيد المراجعة
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400">
            <CheckCircle className="w-3 h-3 ml-1" />
            موافق عليه
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-400">
            <XCircle className="w-3 h-3 ml-1" />
            مرفوض
          </Badge>
        );
    }
  };

  const filteredCredentials = credentials.filter((c) => {
    if (activeTab === "pending") return c.status === "pending";
    if (activeTab === "approved") return c.status === "approved";
    if (activeTab === "rejected") return c.status === "rejected";
    return true;
  });

  /* ---------------- LOADING ---------------- */

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="w-10 h-10 animate-spin text-amber-500" />
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold text-white">
          مراجعة المؤهلات والشهادات
        </h1>
        <p className="text-slate-400">
          مراجعة واعتماد المؤهلات المقدمة من المحامين
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <p className="text-slate-400">قيد المراجعة</p>
            <p className="text-3xl text-amber-400">{pendingCount}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <p className="text-slate-400">موافق عليها</p>
            <p className="text-3xl text-emerald-400">{approvedCount}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <p className="text-slate-400">مرفوضة</p>
            <p className="text-3xl text-red-400">{rejectedCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}

      <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
        <TabsList>
          <TabsTrigger value="pending">
            قيد المراجعة ({pendingCount})
          </TabsTrigger>

          <TabsTrigger value="approved">
            موافق عليها ({approvedCount})
          </TabsTrigger>

          <TabsTrigger value="rejected">مرفوضة ({rejectedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المحامي</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الحالة</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredCredentials.map((cred) => (
                    <TableRow key={cred.id}>
                      <TableCell>{cred.lawyerName}</TableCell>

                      <TableCell className="flex items-center gap-2">
                        {getTypeIcon(cred.type)}
                        {cred.type}
                      </TableCell>

                      <TableCell>{cred.submittedAt}</TableCell>

                      <TableCell>{getStatusBadge(cred.status)}</TableCell>

                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openReviewModal(cred)}
                        >
                          <Eye className="w-4 h-4 ml-1" />
                          مراجعة
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal */}

      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">مراجعة المستند</DialogTitle>

            <DialogDescription>
              تحقق من البيانات قبل اتخاذ القرار
            </DialogDescription>
          </DialogHeader>

          {selectedCredential?.status === "pending" && (
            <Textarea
              placeholder="سبب الرفض"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="bg-slate-900 border-slate-600 text-white"
            />
          )}

          <DialogFooter>
            {selectedCredential?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedCredential.id)}
                >
                  رفض
                </Button>

                <Button onClick={() => handleApprove(selectedCredential.id)}>
                  موافقة
                </Button>
              </>
            )}

            <Button variant="ghost" onClick={() => setShowReviewModal(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CredentialReview;
