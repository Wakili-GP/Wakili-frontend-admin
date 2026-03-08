import { useState, useEffect } from "react";
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
  Loader,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

type Review = {
  id: string;
  clientName: string;
  lawyerName: string;
  rating: number;
  content: string;
  createdAt: string;
  status: "visible" | "hidden" | "flagged";
  flagReason?: string;
};

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
];

const ReviewModeration = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  }, []);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.clientName.includes(searchQuery) ||
      review.lawyerName.includes(searchQuery) ||
      review.content.includes(searchQuery);

    const matchesTab = activeTab === "all" || review.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const handleHide = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "hidden" } : r)),
    );

    setViewDialogOpen(false);
    toast.success("تم إخفاء المراجعة");
  };

  const handleShow = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "visible" } : r)),
    );

    setViewDialogOpen(false);
    toast.success("تم إظهار المراجعة");
  };

  const handleApprove = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "visible" } : r)),
    );

    setViewDialogOpen(false);
    toast.success("تم قبول المراجعة");
  };

  const handleDelete = () => {
    if (!selectedReview) return;

    setReviews((prev) => prev.filter((r) => r.id !== selectedReview.id));

    setDeleteDialogOpen(false);
    setViewDialogOpen(false);

    toast.error("تم حذف المراجعة");
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
        <h1 className="text-2xl font-bold text-white">المراجعات والتقييمات</h1>
        <p className="text-slate-400 mt-1">مراقبة وإدارة مراجعات العملاء</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <MessageSquare className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-2xl text-white">{reviews.length}</p>
              <p className="text-sm text-slate-400">إجمالي المراجعات</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-2xl text-white">
                {reviews.filter((r) => r.status === "visible").length}
              </p>
              <p className="text-sm text-slate-400">مرئية</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <Flag className="w-6 h-6 text-red-400" />
            <div>
              <p className="text-2xl text-white">
                {reviews.filter((r) => r.status === "flagged").length}
              </p>
              <p className="text-sm text-slate-400">مُبلغ عنها</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 flex items-center gap-4">
            <EyeOff className="w-6 h-6 text-slate-400" />
            <div>
              <p className="text-2xl text-white">
                {reviews.filter((r) => r.status === "hidden").length}
              </p>
              <p className="text-sm text-slate-400">مخفية</p>
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
              <TabsTrigger value="visible">مرئية</TabsTrigger>
              <TabsTrigger value="flagged">مُبلغ عنها</TabsTrigger>
              <TabsTrigger value="hidden">مخفية</TabsTrigger>
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

      {/* Reviews */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between">
                <div>
                  <p className="text-white font-medium">{review.clientName}</p>
                  <p className="text-xs text-slate-400">
                    عن: {review.lawyerName}
                  </p>
                </div>

                <Badge>{review.status}</Badge>
              </div>

              {renderStars(review.rating)}

              <p className="text-slate-300 text-sm">{review.content}</p>

              <Button
                size="sm"
                onClick={() => {
                  setSelectedReview(review);
                  setViewDialogOpen(true);
                }}
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
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">تفاصيل المراجعة</DialogTitle>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              <p className="text-white">{selectedReview.content}</p>

              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleHide(selectedReview.id)}
                >
                  <EyeOff className="w-4 h-4 ml-2" />
                  إخفاء
                </Button>

                <Button onClick={() => handleShow(selectedReview.id)}>
                  <Eye className="w-4 h-4 ml-2" />
                  إظهار
                </Button>

                <Button onClick={() => handleApprove(selectedReview.id)}>
                  <CheckCircle className="w-4 h-4 ml-2" />
                  قبول
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  حذف
                </Button>
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
              هل أنت متأكد من حذف هذه المراجعة؟
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              إلغاء
            </Button>

            <Button variant="destructive" onClick={handleDelete}>
              تأكيد الحذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewModeration;
