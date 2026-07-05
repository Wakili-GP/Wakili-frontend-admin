import { useState, useEffect, useCallback } from "react";
import { forumService } from "@/services/forum-services";
import specializationsService, { type Specialization } from "@/services/specializations-service";
import type { ForumPost, ForumSearchParams } from "@/types/forum.types";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, XCircle, Eye, Search, Loader2 } from "lucide-react";

export default function ForumsManagement() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);

  // Pagination & Filtering
  const [keyword, setKeyword] = useState("");
  const [specializationId, setSpecializationId] = useState<string>("all");
  const [sortBy, setSortBy] = useState<ForumSearchParams["sortBy"]>("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // View post details modal
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);

  const fetchPosts = useCallback(async (p: number = page) => {
    setLoading(true);
    const params: ForumSearchParams = {
      keyword: keyword || undefined,
      specializationId: specializationId !== "all" ? Number(specializationId) : undefined,
      sortBy,
      page: p,
      limit: 10
    };

    const res = await forumService.getAdminPosts(params);
    if (res.success && res.data) {
      setPosts(res.data.items);
      setTotalPages(res.data.totalPages);
      setTotalCount(res.data.totalCount);
      setPage(res.data.pageNumber);
    } else {
      toast.error("حدث خطأ أثناء جلب الأسئلة");
    }
    setLoading(false);
  }, [keyword, specializationId, sortBy, page]);

  useEffect(() => {
    specializationsService.getAllActive().then((data) => {
      setSpecializations(data || []);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPosts(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [keyword, specializationId, sortBy]); // Automatically fetch on filter change

  const handleStatusChange = async (postId: string, newStatus: "Approved" | "Rejected") => {
    const loadingToastId = toast.loading("جاري تحديث الحالة...");
    const res = await forumService.changePostStatus(postId, newStatus);
    toast.dismiss(loadingToastId);

    if (res.success) {
      toast.success("تم تحديث حالة السؤال بنجاح");
      setPosts(posts.map(p => p.id === postId ? { ...p, status: newStatus } : p));
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost({ ...selectedPost, status: newStatus });
      }
    } else {
      toast.error(res.message || "فشل تحديث الحالة");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved": return <Badge className="bg-green-100 text-green-800 border-green-200">مقبول</Badge>;
      case "Rejected": return <Badge className="bg-red-100 text-red-800 border-red-200">مرفوض</Badge>;
      case "Pending": return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">قيد المراجعة</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">إدارة الأسئلة (المنتدى)</h2>
          <p className="text-muted-foreground">قم بمراجعة الأسئلة المطروحة وإدارتها</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="بحث في الأسئلة..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pr-10 bg-gray-50/50"
          />
        </div>

        <Select value={specializationId} onValueChange={setSpecializationId}>
          <SelectTrigger className="w-full sm:w-[200px] bg-gray-50/50">
            <SelectValue placeholder="التخصص" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع التخصصات</SelectItem>
            {specializations.map(s => (
              <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
          <SelectTrigger className="w-full sm:w-[200px] bg-gray-50/50">
            <SelectValue placeholder="ترتيب حسب" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">الأحدث</SelectItem>
            <SelectItem value="unanswered">الأسئلة بدون إجابة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead>عنوان السؤال</TableHead>
                <TableHead>الكاتب</TableHead>
                <TableHead>التخصص</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    لا توجد أسئلة تطابق معايير البحث
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium max-w-[300px] truncate">
                      {post.title}
                    </TableCell>
                    <TableCell>{post.author.firstName} {post.author.lastName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{post.specialization.name}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(post.createdAt).toLocaleDateString('ar-EG')}
                    </TableCell>
                    <TableCell>{getStatusBadge(post.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => setSelectedPost(post)}
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {post.status !== "Approved" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleStatusChange(post.id, "Approved")}
                            title="قبول"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                        )}
                        {post.status !== "Rejected" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleStatusChange(post.id, "Rejected")}
                            title="رفض"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
            <div className="text-sm text-muted-foreground">
              عرض صفحة {page} من {totalPages} (إجمالي {totalCount})
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchPosts(page - 1)}
                disabled={page <= 1 || loading}
              >
                السابق
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchPosts(page + 1)}
                disabled={page >= totalPages || loading}
              >
                التالي
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Post Details Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>تفاصيل السؤال</DialogTitle>
          </DialogHeader>

          {selectedPost && (
            <div className="space-y-6 py-4">
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-xl font-bold">{selectedPost.title}</h3>
                {getStatusBadge(selectedPost.status)}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">الكاتب:</span>
                  {selectedPost.author.firstName} {selectedPost.author.lastName}
                </div>
                <div>|</div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">التخصص:</span>
                  {selectedPost.specialization.name}
                </div>
                <div>|</div>
                <div>{new Date(selectedPost.createdAt).toLocaleString('ar-EG')}</div>
              </div>

              <div className="whitespace-pre-wrap leading-relaxed text-gray-700 bg-gray-50 p-4 rounded-lg border">
                {selectedPost.body}
              </div>

              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">الكلمات المفتاحية:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPost.tags.map(tag => (
                      <Badge key={tag} variant="secondary">#{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                {selectedPost.status !== "Rejected" && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleStatusChange(selectedPost.id, "Rejected");
                    }}
                  >
                    رفض السؤال
                  </Button>
                )}
                {selectedPost.status !== "Approved" && (
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleStatusChange(selectedPost.id, "Approved");
                    }}
                  >
                    قبول ونشر
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelectedPost(null)}>
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
