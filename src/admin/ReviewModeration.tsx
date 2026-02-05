import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  MessageSquare,
  Search,
  Eye,
  EyeOff,
  Star,
  Flag,
  AlertTriangle,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Review {
  id: string;
  clientName: string;
  lawyerName: string;
  rating: number;
  content: string;
  createdAt: string;
  status: "visible" | "hidden" | "flagged";
  flagReason?: string;
}

const mockReviews: Review[] = [
  {
    id: "1",
    clientName: "محمد أحمد",
    lawyerName: "أحمد محمد علي",
    rating: 5,
    content:
      "محامي ممتاز ومتعاون جداً. أنصح به بشدة لأي شخص يحتاج استشارة قانونية.",
    createdAt: "2024-01-15",
    status: "visible",
  },
  {
    id: "2",
    clientName: "فاطمة حسن",
    lawyerName: "سارة أحمد محمود",
    rating: 4,
    content: "خدمة جيدة جداً والمحامية متفهمة ومحترفة.",
    createdAt: "2024-01-14",
    status: "visible",
  },
  {
    id: "3",
    clientName: "علي محمود",
    lawyerName: "خالد عبدالله حسن",
    rating: 1,
    content: "هذا المحتوى يحتوي على كلمات غير لائقة وإساءة شخصية للمحامي.",
    createdAt: "2024-01-13",
    status: "flagged",
    flagReason: "محتوى مسيء",
  },
  {
    id: "4",
    clientName: "منى إبراهيم",
    lawyerName: "أحمد محمد علي",
    rating: 3,
    content: "الخدمة كانت متوسطة، كان يمكن أن تكون أفضل.",
    createdAt: "2024-01-12",
    status: "hidden",
  },
  {
    id: "5",
    clientName: "حسين علي",
    lawyerName: "سارة أحمد محمود",
    rating: 2,
    content: "تم الإبلاغ عن هذه المراجعة لأنها تحتوي على معلومات مضللة.",
    createdAt: "2024-01-11",
    status: "flagged",
    flagReason: "معلومات مضللة",
  },
];

const ReviewModeration = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.clientName.includes(searchQuery) ||
      review.lawyerName.includes(searchQuery) ||
      review.content.includes(searchQuery);
    const matchesTab = activeTab === "all" || review.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleHide = (id: string) => {
    setReviews(
      reviews.map((r) =>
        r.id === id ? { ...r, status: "hidden" as const } : r,
      ),
    );
    setViewDialogOpen(false);
    toast.success("تم إخفاء المراجعة", {
      description: "تم إخفاء المراجعة من صفحة المحامي",
    });
  };

  const handleShow = (id: string) => {
    setReviews(
      reviews.map((r) =>
        r.id === id ? { ...r, status: "visible" as const } : r,
      ),
    );
    setViewDialogOpen(false);
    toast.success("تم إظهار المراجعة", {
      description: "أصبحت المراجعة مرئية على صفحة المحامي",
    });
  };

  const handleDelete = () => {
    if (!selectedReview) return;
    setReviews(reviews.filter((r) => r.id !== selectedReview.id));
    setDeleteDialogOpen(false);
    setViewDialogOpen(false);
    toast.error("تم حذف المراجعة", {
      description: "تم حذف المراجعة نهائياً من النظام",
    });
  };

  const handleApprove = (id: string) => {
    setReviews(
      reviews.map((r) =>
        r.id === id
          ? { ...r, status: "visible" as const, flagReason: undefined }
          : r,
      ),
    );
    setViewDialogOpen(false);
    toast.success("تم قبول المراجعة", {
      description: "تم قبول المراجعة وإظهارها على صفحة المحامي",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-amber-400 fill-amber-400"
                : "text-slate-600"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">المراجعات والتقييمات</h1>
        <p className="text-slate-400 mt-1">مراقبة وإدارة مراجعات العملاء</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{reviews.length}</p>
              <p className="text-sm text-slate-400">إجمالي المراجعات</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {reviews.filter((r) => r.status === "visible").length}
              </p>
              <p className="text-sm text-slate-400">مراجعات مرئية</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Flag className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {reviews.filter((r) => r.status === "flagged").length}
              </p>
              <p className="text-sm text-slate-400">مُبلغ عنها</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-500/20 flex items-center justify-center">
              <EyeOff className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {reviews.filter((r) => r.status === "hidden").length}
              </p>
              <p className="text-sm text-slate-400">مخفية</p>
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
                <TabsTrigger className="cursor-pointer" value="visible">
                  مرئية
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="flagged">
                  مُبلغ عنها
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="hidden">
                  مخفية
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

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map((review) => (
          <Card
            key={review.id}
            className={`bg-slate-800/50 border-slate-700 ${
              review.status === "flagged" ? "border-r-4 border-r-red-500" : ""
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-medium">{review.clientName}</p>
                  <p className="text-xs text-slate-400">
                    عن: {review.lawyerName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {review.status === "flagged" && (
                    <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                      <AlertTriangle className="w-3 h-3 ml-1" />
                      مُبلغ عنها
                    </Badge>
                  )}
                  {review.status === "hidden" && (
                    <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20">
                      <EyeOff className="w-3 h-3 ml-1" />
                      مخفية
                    </Badge>
                  )}
                  {review.status === "visible" && (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                      <Eye className="w-3 h-3 ml-1" />
                      مرئية
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                {renderStars(review.rating)}
                <span className="text-sm text-slate-400">
                  {review.createdAt}
                </span>
              </div>

              <p className="text-slate-300 text-sm line-clamp-2 mb-4">
                {review.content}
              </p>

              {review.flagReason && (
                <div className="p-2 rounded bg-red-500/10 border border-red-500/20 mb-4">
                  <p className="text-xs text-red-400">
                    <Flag className="w-3 h-3 inline ml-1" />
                    سبب البلاغ: {review.flagReason}
                  </p>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedReview(review);
                  setViewDialogOpen(true);
                }}
                className="cursor-pointer text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
              >
                <Eye className="w-4 h-4 ml-1" />
                عرض التفاصيل
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">تفاصيل المراجعة</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-900/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-medium">
                    {selectedReview.clientName}
                  </p>
                  {renderStars(selectedReview.rating)}
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  مراجعة للمحامي: {selectedReview.lawyerName}
                </p>
                <p className="text-slate-300">{selectedReview.content}</p>
                <p className="text-xs text-slate-500 mt-3">
                  {selectedReview.createdAt}
                </p>
              </div>

              {selectedReview.flagReason && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <p className="text-red-400 font-medium">
                      تم الإبلاغ عن هذه المراجعة
                    </p>
                  </div>
                  <p className="text-sm text-slate-300">
                    السبب: {selectedReview.flagReason}
                  </p>
                </div>
              )}

              <DialogFooter className="gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  حذف
                </Button>

                {selectedReview.status === "visible" ? (
                  <Button
                    variant="outline"
                    onClick={() => handleHide(selectedReview.id)}
                    className="border-slate-600 text-slate-300"
                  >
                    <EyeOff className="w-4 h-4 ml-2" />
                    إخفاء
                  </Button>
                ) : selectedReview.status === "hidden" ? (
                  <Button
                    onClick={() => handleShow(selectedReview.id)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    <Eye className="w-4 h-4 ml-2" />
                    إظهار
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleHide(selectedReview.id)}
                      className="border-slate-600 text-slate-300"
                    >
                      <EyeOff className="w-4 h-4 ml-2" />
                      إخفاء
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedReview.id)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      <CheckCircle className="w-4 h-4 ml-2" />
                      قبول
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">تأكيد الحذف</DialogTitle>
            <DialogDescription className="text-slate-400">
              هل أنت متأكد من حذف هذه المراجعة نهائياً؟ لا يمكن التراجع عن هذا
              الإجراء.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="border-slate-600 text-slate-300"
            >
              إلغاء
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              تأكيد الحذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewModeration;
