import { useState, useEffect, useMemo } from "react";
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Search,
  Eye,
  EyeOff,
  Star,
  Flag,
  CheckCircle,
  Loader,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Scale
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

import { type Review, reviewsService } from "../services/reviews-service";

const ITEMS_PER_PAGE = 10;

const ReviewModeration = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [aiFilter, setAiFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("recent");

  const [currentPage, setCurrentPage] = useState(1);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const data = await reviewsService.getAllReviews();
      setReviews(data);
    } catch (error) {
      toast.error("حدث خطأ أثناء جلب التقييمات");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    let result = reviews.filter((review) => {
      const clientFullName = `${review.client.firstName} ${review.client.lastName}`;
      const matchesSearch =
        clientFullName.includes(searchQuery) ||
        review.comment.includes(searchQuery);

      const matchesTab = activeTab === "all" || review.visibility.toLowerCase() === activeTab;
      const matchesAi = aiFilter === "ALL" ||
        (aiFilter === "COMPLETED" && review.aiStatus === "Completed") ||
        (aiFilter === "PENDING" && review.aiStatus === "Pending") ||
        (aiFilter === "FAILED" && review.aiStatus === "Failed");

      return matchesSearch && matchesTab && matchesAi;
    });

    if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "highest") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "lowest") {
      result.sort((a, b) => a.rating - b.rating);
    }

    return result;
  }, [reviews, searchQuery, activeTab, aiFilter, sortBy]);

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, aiFilter, sortBy]);

  const handleHide = async (id: string) => {
    try {
      await reviewsService.hideReview(id);
      toast.success("تم إخفاء المراجعة");
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, visibility: "Hidden" } : r)));
      if (selectedReview?.id === id) {
        setSelectedReview({ ...selectedReview, visibility: "Hidden" });
      }
      setDetailsDialogOpen(false);
    } catch (error) {
      toast.error("فشل في إخفاء المراجعة");
    }
  };

  const handleShow = async (id: string) => {
    try {
      await reviewsService.approveReview(id);
      toast.success("تم إظهار المراجعة");
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, visibility: "Visible" } : r)));
      if (selectedReview?.id === id) {
        setSelectedReview({ ...selectedReview, visibility: "Visible" });
      }
      setDetailsDialogOpen(false);
    } catch (error) {
      toast.error("فشل في إظهار المراجعة");
    }
  };

  const handleRetryModeration = async (id: string) => {
    try {
      await reviewsService.retryModeration(id);
      toast.success("تم إعادة طلب فحص الذكاء الاصطناعي");
      fetchReviews(); // Refresh fully to get new statuses
    } catch (error) {
      toast.error("فشل في إعادة فحص الذكاء الاصطناعي");
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5" dir="ltr">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating
              ? "text-amber-400 fill-amber-400"
              : "text-gray-300"
              }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "visible": return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
      case "hidden": return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
      default: return "";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "visible": return "مرئية";
      case "hidden": return "مخفية";
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">المراجعات والتقييمات</h1>
        <p className="text-gray-500 mt-1">مراقبة وإدارة مراجعات العملاء (النظام والمحامين)</p>
      </div>

      {/* Stats Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <MessageSquare className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              <p className="text-sm text-gray-500">إجمالي المراجعات</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <Monitor className="w-6 h-6 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                0
              </p>
              <p className="text-sm text-gray-500">مراجعات النظام</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <Scale className="w-6 h-6 text-amber-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {reviews.length}
              </p>
              <p className="text-sm text-gray-500">مراجعات المحامين</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <EyeOff className="w-6 h-6 text-gray-500" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {reviews.filter((r) => r.visibility === "Hidden").length}
              </p>
              <p className="text-sm text-gray-500">مخفية</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Actions */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="visible">مرئية</TabsTrigger>
              <TabsTrigger value="hidden">مخفية</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-56">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="البحث بالاسم أو التعليق..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-gray-50 border-gray-200 text-gray-900 w-full"
              />
            </div>



            <Select value={aiFilter} onValueChange={setAiFilter}>
              <SelectTrigger className="w-full md:w-[150px] bg-white">
                <SelectValue placeholder="حالة الذكاء الاصطناعي" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">الكل (AI)</SelectItem>
                <SelectItem value="COMPLETED">مكتملة</SelectItem>
                <SelectItem value="PENDING">قيد المعالجة</SelectItem>
                <SelectItem value="FAILED">فشلت</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[150px] bg-white">
                <SelectValue placeholder="الترتيب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">الأحدث أولاً</SelectItem>
                <SelectItem value="oldest">الأقدم أولاً</SelectItem>
                <SelectItem value="highest">الأعلى تقييماً</SelectItem>
                <SelectItem value="lowest">الأقل تقييماً</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-right">العميل</TableHead>
                <TableHead className="font-semibold text-right">النوع</TableHead>
                <TableHead className="font-semibold text-right">التقييم</TableHead>
                <TableHead className="font-semibold text-right">التعليق</TableHead>
                <TableHead className="font-semibold text-right">الذكاء الاصطناعي</TableHead>
                <TableHead className="font-semibold text-right">التاريخ</TableHead>
                <TableHead className="font-semibold text-right">الحالة</TableHead>
                <TableHead className="font-semibold text-right">المشرف والتاريخ</TableHead>
                <TableHead className="font-semibold text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReviews.length > 0 ? (
                paginatedReviews.map((review) => (
                  <TableRow key={review.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={review.client.profileImageUrl}
                          alt="avatar"
                          className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {review.client.firstName} {review.client.lastName}
                          </span>
                          <span className="text-xs text-gray-500" dir="ltr">
                            {review.client.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="cursor-pointer transition-colors border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100"
                        onClick={() => {
                          setSelectedReview(review);
                          setDetailsDialogOpen(true);
                        }}
                      >
                        محامي
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {renderStars(review.rating)}
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-gray-600" title={review.comment}>
                      {review.comment}
                    </TableCell>
                    <TableCell>
                      {review.aiStatus === "Failed" ? (
                        <Badge variant="destructive" className="bg-red-50 text-red-600 border-red-200">
                          <Flag className="w-3 h-3 ml-1" />
                          فشل
                        </Badge>
                      ) : review.visibility === "Hidden" ? (
                        <Badge variant="destructive" className="bg-red-50 text-red-600 border-red-200">
                          <Flag className="w-3 h-3 ml-1" />
                          مُبلغ
                        </Badge>
                      ) : review.visibility === "Visible" ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">
                          <CheckCircle className="w-3 h-3 ml-1" />
                          سليمة
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                          <Loader className="w-3 h-3 ml-1 animate-spin" />
                          قيد المعالجة
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-500 whitespace-nowrap">
                      {formatDate(review.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeStyles(review.visibility.toLowerCase())}>
                        {getStatusLabel(review.visibility.toLowerCase())}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {review.statusChangedBy && review.statusChangedAt ? (
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 text-sm">{review.statusChangedBy}</span>
                          <span className="text-xs text-gray-500">{formatDate(review.statusChangedAt)}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => {
                            setSelectedReview(review);
                            setDetailsDialogOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                    لا توجد مراجعات مطابقة للبحث
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
            <span className="text-sm text-gray-500">
              عرض {(currentPage - 1) * ITEMS_PER_PAGE + 1} إلى {Math.min(currentPage * ITEMS_PER_PAGE, filteredReviews.length)} من {filteredReviews.length}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Full Details Modal */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="bg-white border-gray-200 sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gray-900 border-b pb-4">تفاصيل تقييم المحامي</DialogTitle>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-gray-500 mb-1">معرف المراجعة</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800 break-all">{selectedReview.id}</code>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">معرف الموعد</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800 break-all">{selectedReview.appointmentId}</code>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">معرف المستخدم</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800 break-all">{selectedReview.userId}</code>
                </div>
                <div>
                  <span className="block text-gray-500 mb-1">معرف المحامي</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800 break-all">{selectedReview.lawyerId}</code>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-2">بيانات العميل</h4>
                <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-md">
                  <img src={selectedReview.client.profileImageUrl || undefined} alt="client" className="w-12 h-12 rounded-full object-cover bg-gray-200" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedReview.client.firstName} {selectedReview.client.lastName}</p>
                    <p className="text-sm text-gray-500" dir="ltr">{selectedReview.client.email || ""} • {selectedReview.client.phoneNumber || ""}</p>
                  </div>
                </div>
              </div>

              {selectedReview.lawyer && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">بيانات المحامي</h4>
                  <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-md">
                    <img src={selectedReview.lawyer.profileImageUrl || undefined} alt="lawyer" className="w-12 h-12 rounded-full object-cover bg-gray-200" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedReview.lawyer.firstName} {selectedReview.lawyer.lastName}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-2">معلومات التقييم والموعد</h4>
                <div className="bg-blue-50/50 p-3 rounded-md space-y-2 text-sm border border-blue-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">تاريخ التقييم:</span>
                    <span className="font-medium text-gray-900">{formatDate(selectedReview.createdAt)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">التقييم:</span>
                    <span>{renderStars(selectedReview.rating)}</span>
                  </div>
                  <div className="pt-2 border-t border-blue-100/50">
                    <span className="block text-gray-600 mb-1">التعليق:</span>
                    <p className="text-gray-900 bg-white p-2 rounded border border-blue-50">{selectedReview.comment}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-2">تحليل الذكاء الاصطناعي</h4>
                <div className={`${selectedReview.visibility === "Hidden" ? "bg-red-50/50 border-red-100" : "bg-emerald-50/50 border-emerald-100"} p-3 rounded-md space-y-2 text-sm border`}>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">حالة التقييم:</span>
                    <span>
                      {selectedReview.visibility === "Hidden" ? (
                        <span className="text-red-600 flex items-center text-xs font-medium"><Flag className="w-3 h-3 ml-1" />مُبلغ عنها</span>
                      ) : (
                        <span className="text-emerald-600 flex items-center text-xs font-medium"><CheckCircle className="w-3 h-3 ml-1" />سليمة</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">نسبة الثقة (Confidence):</span>
                    <span className="font-medium text-gray-900">{((selectedReview.aiConfidenceRate || 0) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="pt-2 border-t border-gray-100/50">
                    <span className="block text-gray-600 mb-1">ملخص التحليل (Summary):</span>
                    <p className="text-gray-900">{selectedReview.aiComment || "لا يوجد تحليل متاح."}</p>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex gap-2 flex-col sm:flex-row mt-6 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => handleRetryModeration(selectedReview.id)}
                >
                  إعادة فحص AI
                </Button>
                
                {selectedReview.visibility === "Visible" ? (
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => handleHide(selectedReview.id)}
                  >
                    <EyeOff className="w-4 h-4 ml-2" />
                    إخفاء التقييم
                  </Button>
                ) : (
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
                    onClick={() => handleShow(selectedReview.id)}
                  >
                    <Eye className="w-4 h-4 ml-2" />
                    إظهار التقييم
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ReviewModeration;
