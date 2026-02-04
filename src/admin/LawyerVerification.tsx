import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

interface VerificationDocument {
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

interface Education {
  degreeType: string;
  fieldOfStudy: string;
  university: string;
  graduationYear: string;
}

interface Certification {
  name: string;
  issuingOrg: string;
  yearObtained: string;
  documentUrl?: string;
}

interface Experience {
  jobTitle: string;
  organization: string;
  startYear: string;
  endYear: string;
  isCurrent: boolean;
  description: string;
}

interface VerificationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string[];
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  profileImage: string;
  bio: string;
  location: {
    country: string;
    city: string;
  };
  yearsExperience: number;
  sessionTypes: string[];
  education: Education[];
  certifications: Certification[];
  workExperience: Experience[];
  documents: {
    governmentId: boolean;
    governmentIdUrl?: string;
    professionalLicense: boolean;
    professionalLicenseUrl?: string;
    identityVerification: boolean;
    educationCertificates: VerificationDocument[];
  };
  licenseNumber: string;
  issuingAuthority: string;
  licenseYear: string;
  barNumber: string;
}

const mockRequests: VerificationRequest[] = [
  {
    id: "1",
    name: "أحمد محمد علي",
    email: "ahmed@example.com",
    phone: "+20 100 123 4567",
    specialty: ["القانون الجنائي", "القانون التجاري"],
    submittedAt: "2024-01-15",
    status: "pending",
    profileImage:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
    bio: "محامي متخصص في القضايا الجنائية والتجارية مع خبرة تزيد عن 10 سنوات في المحاكم المصرية",
    location: { country: "مصر", city: "القاهرة" },
    yearsExperience: 10,
    sessionTypes: ["مكتب", "هاتف"],
    education: [
      {
        degreeType: "بكالوريوس",
        fieldOfStudy: "القانون",
        university: "جامعة القاهرة",
        graduationYear: "2012",
      },
      {
        degreeType: "ماجستير",
        fieldOfStudy: "القانون الجنائي",
        university: "جامعة عين شمس",
        graduationYear: "2015",
      },
    ],
    certifications: [
      {
        name: "شهادة التحكيم التجاري الدولي",
        issuingOrg: "مركز القاهرة للتحكيم",
        yearObtained: "2018",
        documentUrl: "#",
      },
      {
        name: "دبلوم القانون الدولي",
        issuingOrg: "الأكاديمية العربية",
        yearObtained: "2020",
        documentUrl: "#",
      },
    ],
    workExperience: [
      {
        jobTitle: "محامي رئيسي",
        organization: "مكتب العدالة للمحاماة",
        startYear: "2018",
        endYear: "",
        isCurrent: true,
        description:
          "إدارة القضايا الجنائية والتجارية الكبرى والتمثيل أمام المحاكم العليا",
      },
      {
        jobTitle: "محامي مساعد",
        organization: "مكتب النور للمحاماة",
        startYear: "2012",
        endYear: "2018",
        isCurrent: false,
        description: "المساعدة في إعداد المذكرات القانونية وحضور الجلسات",
      },
    ],
    documents: {
      governmentId: true,
      governmentIdUrl: "#",
      professionalLicense: true,
      professionalLicenseUrl: "#",
      identityVerification: true,
      educationCertificates: [
        {
          name: "شهادة البكالوريوس",
          url: "#",
          type: "pdf",
          uploadedAt: "2024-01-10",
        },
        {
          name: "شهادة الماجستير",
          url: "#",
          type: "pdf",
          uploadedAt: "2024-01-10",
        },
      ],
    },
    licenseNumber: "12345",
    issuingAuthority: "نقابة المحامين المصرية",
    licenseYear: "2012",
    barNumber: "12345",
  },
  {
    id: "2",
    name: "سارة أحمد محمود",
    email: "sara@example.com",
    phone: "+20 101 234 5678",
    specialty: ["قانون الأسرة"],
    submittedAt: "2024-01-14",
    status: "pending",
    profileImage:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    bio: "محامية متخصصة في قضايا الأسرة والأحوال الشخصية",
    location: { country: "مصر", city: "الإسكندرية" },
    yearsExperience: 5,
    sessionTypes: ["مكتب", "هاتف"],
    education: [
      {
        degreeType: "بكالوريوس",
        fieldOfStudy: "القانون",
        university: "جامعة الإسكندرية",
        graduationYear: "2018",
      },
    ],
    certifications: [],
    workExperience: [
      {
        jobTitle: "محامية",
        organization: "مكتب الأسرة للمحاماة",
        startYear: "2019",
        endYear: "",
        isCurrent: true,
        description: "التعامل مع قضايا الطلاق والحضانة والنفقة",
      },
    ],
    documents: {
      governmentId: true,
      governmentIdUrl: "#",
      professionalLicense: true,
      professionalLicenseUrl: "#",
      identityVerification: false,
      educationCertificates: [
        {
          name: "شهادة البكالوريوس",
          url: "#",
          type: "pdf",
          uploadedAt: "2024-01-12",
        },
      ],
    },
    licenseNumber: "67890",
    issuingAuthority: "نقابة المحامين المصرية",
    licenseYear: "2019",
    barNumber: "67890",
  },
  {
    id: "3",
    name: "خالد عبدالله حسن",
    email: "khaled@example.com",
    phone: "+20 102 345 6789",
    specialty: ["القانون التجاري"],
    submittedAt: "2024-01-13",
    status: "approved",
    profileImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    bio: "خبير في القانون التجاري والشركات مع 15 عاماً من الخبرة",
    location: { country: "مصر", city: "الجيزة" },
    yearsExperience: 15,
    sessionTypes: ["مكتب"],
    education: [
      {
        degreeType: "دكتوراه",
        fieldOfStudy: "القانون التجاري",
        university: "جامعة القاهرة",
        graduationYear: "2012",
      },
    ],
    certifications: [
      {
        name: "شهادة التحكيم الدولي",
        issuingOrg: "ICC",
        yearObtained: "2015",
        documentUrl: "#",
      },
    ],
    workExperience: [
      {
        jobTitle: "شريك مؤسس",
        organization: "مكتب حسن والشركاء",
        startYear: "2015",
        endYear: "",
        isCurrent: true,
        description: "إدارة المكتب والقضايا التجارية الكبرى",
      },
    ],
    documents: {
      governmentId: true,
      governmentIdUrl: "#",
      professionalLicense: true,
      professionalLicenseUrl: "#",
      identityVerification: true,
      educationCertificates: [],
    },
    licenseNumber: "11111",
    issuingAuthority: "نقابة المحامين المصرية",
    licenseYear: "2008",
    barNumber: "11111",
  },
  {
    id: "4",
    name: "منى إبراهيم سعيد",
    email: "mona@example.com",
    phone: "+20 103 456 7890",
    specialty: ["قانون العمل"],
    submittedAt: "2024-01-12",
    status: "rejected",
    profileImage:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    bio: "محامية متخصصة في قانون العمل والعلاقات العمالية",
    location: { country: "مصر", city: "المنصورة" },
    yearsExperience: 3,
    sessionTypes: ["هاتف"],
    education: [
      {
        degreeType: "بكالوريوس",
        fieldOfStudy: "القانون",
        university: "جامعة المنصورة",
        graduationYear: "2020",
      },
    ],
    certifications: [],
    workExperience: [
      {
        jobTitle: "محامية مبتدئة",
        organization: "مكتب العمل للمحاماة",
        startYear: "2021",
        endYear: "",
        isCurrent: true,
        description: "متابعة القضايا العمالية",
      },
    ],
    documents: {
      governmentId: true,
      governmentIdUrl: "#",
      professionalLicense: false,
      identityVerification: true,
      educationCertificates: [],
    },
    licenseNumber: "22222",
    issuingAuthority: "نقابة المحامين المصرية",
    licenseYear: "2021",
    barNumber: "22222",
  },
];

const LawyerVerification = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] =
    useState<VerificationRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  //   const { toast } = useToast();

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.name.includes(searchQuery) || request.email.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setRequests(
      requests.map((r) =>
        r.id === id ? { ...r, status: "approved" as const } : r,
      ),
    );
    setViewDialogOpen(false);
    // toast({
    //   title: "تمت الموافقة",
    //   description: "تم توثيق حساب المحامي بنجاح وإرسال إشعار له",
    // });
  };

  const handleReject = () => {
    if (!selectedRequest || !rejectionReason) return;

    setRequests(
      requests.map((r) =>
        r.id === selectedRequest.id ? { ...r, status: "rejected" as const } : r,
      ),
    );
    setRejectDialogOpen(false);
    setViewDialogOpen(false);
    setRejectionReason("");
    // toast({
    //   title: "تم الرفض",
    //   description: "تم رفض طلب التوثيق وإرسال إشعار للمحامي بأسباب الرفض",
    //   variant: "destructive",
    // });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
            معلق
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            موافق عليه
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
            مرفوض
          </Badge>
        );
      default:
        return null;
    }
  };

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
                {requests.filter((r) => r.status === "pending").length}
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
                {requests.filter((r) => r.status === "approved").length}
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
                {requests.filter((r) => r.status === "rejected").length}
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
              <SelectTrigger className="w-full md:w-48 bg-slate-900/50 border-slate-600 text-white">
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
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-center py-3 px-4 text-slate-400 font-medium">
                    المحامي
                  </th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium">
                    التخصص
                  </th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium">
                    تاريخ التقديم
                  </th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium">
                    المستندات
                  </th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium">
                    الحالة
                  </th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="text-center border-b border-slate-700/50 hover:bg-slate-700/20"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-white font-medium">{request.name}</p>
                        <p className="text-xs text-slate-400">
                          {request.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {request.specialty}
                    </td>
                    <td className="py-4 px-4 text-slate-300">
                      {request.submittedAt}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-1 items-center justify-center">
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center ${request.documents.governmentId ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
                        >
                          <IdCard className="w-3 h-3" />
                        </div>
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center ${request.documents.professionalLicense ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
                        >
                          <Award className="w-3 h-3" />
                        </div>
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center ${request.documents.identityVerification ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
                        >
                          <FileText className="w-3 h-3" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setViewDialogOpen(true);
                        }}
                        className="cursor-pointer text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                      >
                        <Eye className="w-4 h-4 ml-1" />
                        عرض
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Dialog - Full Details */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="mt-5 text-center text-white text-xl">
              تفاصيل طلب التوثيق
            </DialogTitle>
            <DialogDescription className="text-center text-slate-400">
              مراجعة جميع البيانات المقدمة من المحامي
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              {/* Basic Info Section */}
              <div className="p-4 rounded-lg bg-slate-900/50">
                <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  المعلومات الأساسية
                </h3>
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={selectedRequest.profileImage}
                    alt={selectedRequest.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-amber-500/30"
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white">
                      {selectedRequest.name}
                    </h4>
                    <p className="text-slate-400 text-sm mt-1">
                      {selectedRequest.bio}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400 mb-1">
                      البريد الإلكتروني
                    </p>
                    <p className="text-white text-sm">
                      {selectedRequest.email}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400 mb-1">رقم الهاتف</p>
                    <p className="text-white text-sm">
                      {selectedRequest.phone}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400 mb-1">الموقع</p>
                    <p className="text-white text-sm">
                      {selectedRequest.location.city}،{" "}
                      {selectedRequest.location.country}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400 mb-1">سنوات الخبرة</p>
                    <p className="text-white text-sm">
                      {selectedRequest.yearsExperience} سنة
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400 mb-1">التخصصات</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedRequest.specialty.map((s, i) => (
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
                      {selectedRequest.sessionTypes.map((s, i) => (
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
                {selectedRequest.education.length > 0 ? (
                  <div className="space-y-3">
                    {selectedRequest.education.map((edu, i) => (
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
                {selectedRequest.certifications.length > 0 ? (
                  <div className="space-y-3">
                    {selectedRequest.certifications.map((cert, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-slate-800/50 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-white font-medium">{cert.name}</p>
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
                    ))}
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
                {selectedRequest.workExperience.length > 0 ? (
                  <div className="space-y-3">
                    {selectedRequest.workExperience.map((exp, i) => (
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
                              {exp.organization}
                            </p>
                          </div>
                          <Badge
                            className={
                              exp.isCurrent
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-slate-700 text-slate-300"
                            }
                          >
                            {exp.isCurrent
                              ? "حالياً"
                              : `${exp.startYear} - ${exp.endYear}`}
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-sm mt-2">
                          {exp.description}
                        </p>
                      </div>
                    ))}
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
                      {selectedRequest.licenseNumber}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400 mb-1">جهة الإصدار</p>
                    <p className="text-white font-medium">
                      {selectedRequest.issuingAuthority}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400 mb-1">سنة الإصدار</p>
                    <p className="text-white font-medium">
                      {selectedRequest.licenseYear}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <p className="text-xs text-slate-400 mb-1">
                      رقم القيد بالنقابة
                    </p>
                    <p className="text-white font-medium">
                      {selectedRequest.barNumber}
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
                      {selectedRequest.documents.governmentId ? (
                        <>
                          <Badge className="bg-emerald-500/10 text-emerald-400">
                            تم الرفع
                          </Badge>
                          {selectedRequest.documents.governmentIdUrl && (
                            <a
                              href={selectedRequest.documents.governmentIdUrl}
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
                      {selectedRequest.documents.professionalLicense ? (
                        <>
                          <Badge className="bg-emerald-500/10 text-emerald-400">
                            تم الرفع
                          </Badge>
                          {selectedRequest.documents.professionalLicenseUrl && (
                            <a
                              href={
                                selectedRequest.documents.professionalLicenseUrl
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
                    {selectedRequest.documents.identityVerification ? (
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
                {selectedRequest.documents.educationCertificates.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-slate-400 mb-2">
                      الشهادات التعليمية المرفقة:
                    </p>
                    <div className="space-y-2">
                      {selectedRequest.documents.educationCertificates.map(
                        (doc, i) => (
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

              {selectedRequest.status === "pending" && (
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
                    onClick={() => handleApprove(selectedRequest.id)}
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

      {/* Reject Dialog */}
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
              className="cursor-pointer border-slate-600 text-slate-300"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleReject}
              disabled={!rejectionReason}
              className="cursor-pointer bg-red-500 hover:bg-red-600 text-white"
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
// function toast(arg0: { title: string; description: string; variant: string; }) {
//     throw new Error("Function not implemented.");
// }
