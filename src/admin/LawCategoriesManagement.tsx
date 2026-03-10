import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  Scale,
  Plus,
  Trash2,
  Search,
  FolderOpen,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import lawCategoriesService, {
  type SpeciliazationInput,
} from "@/services/specializations.service";
import {
  LawCategorySchema,
  type LawCategoryInput,
} from "@/validation/category.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const LawCategoriesManagement = () => {
  // Modals state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Search Query
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LawCategoryInput>({
    resolver: zodResolver(LawCategorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Fetch Categories
  const { data: categories } = useQuery({
    queryKey: ["lawCategories"],
    queryFn: () => lawCategoriesService.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  const queryClient = useQueryClient();
  // Add New Category Mutation
  const AddCategoryMutation = useMutation({
    mutationKey: ["lawCategories", "Add"],
    mutationFn: (data: LawCategoryInput) =>
      lawCategoriesService.addCategory({
        ...data,
        isActive: true,
      }),
    onSuccess: () => {
      toast.success("تم إضافة الفئة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["lawCategories"] });
      setShowAddCategoryModal(false);
      reset();
    },
    onError: () => {
      toast.error("حدث خطأ أثناء إضافة الفئة");
    },
  });

  // Toggle Category Active State Mutation
  const ToggleActivityMutation = useMutation({
    mutationKey: ["lawCategories", "ToggleActivity"],
    mutationFn: ({ id, data }: { id: number; data: SpeciliazationInput }) =>
      lawCategoriesService.deActivateCategory(id, data),
    onSuccess: () => {
      toast.success("تم تحديث حالة الفئة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["lawCategories"] });
    },
    onError: () => {
      toast.error("حدث خطأ أثناء تحديث حالة الفئة");
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">إدارة فئات القانون</h1>
          <p className="text-slate-400 mt-1">إنشاء وإدارة فئات القانون</p>
        </div>
        <Button
          onClick={() => setShowAddCategoryModal(true)}
          className="cursor-pointer bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 ml-2" />
          إضافة فئة
        </Button>
      </div>

      {/* Stats */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-400">فئات القانون</p>
              <p className="text-3xl font-bold text-white">
                {categories?.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث..."
          className="pr-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
        />
      </div>

      {/* Categories Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-500" />
            فئات القانون ({categories?.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories ? (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-slate-900/50">
                  <TableHead className="text-slate-400 text-center">
                    اسم الفئة
                  </TableHead>
                  <TableHead className="text-slate-400 text-center">
                    الوصف
                  </TableHead>
                  <TableHead className="text-slate-400 text-center">
                    تاريخ الإنشاء
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
                {categories?.map((category) => (
                  <TableRow
                    key={category.id}
                    className="border-slate-700 hover:bg-slate-900/50"
                  >
                    <TableCell className="text-white font-medium text-center">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-slate-300 max-w-xs truncate text-center">
                      {category.description}
                    </TableCell>
                    <TableCell className="text-slate-400 text-center">
                      {new Date(category.createdAt).toLocaleDateString(
                        "ar-EG",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          dir="rtl"
                          checked={category.isActive}
                          onCheckedChange={() =>
                            ToggleActivityMutation.mutate({
                              id: category.id,
                              data: {
                                name: category.name,
                                description: category.description,
                                isActive: !category.isActive,
                              },
                            })
                          }
                        />
                        <span
                          className={`text-sm ${category.isActive ? "text-green-400" : "text-slate-500"}`}
                        >
                          {category.isActive ? "مفعّل" : "معطّل"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">لا توجد فئات مطابقة للبحث</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Category Modal */}
      <Dialog
        open={showAddCategoryModal}
        onOpenChange={setShowAddCategoryModal}
      >
        <DialogContent className="bg-slate-800 border-slate-700" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-white flex justify-center gap-2">
              <Scale className="w-5 h-5 text-white" />
              إضافة فئة قانون جديدة
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-center">
              أدخل بيانات الفئة الجديدة
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-slate-300">اسم الفئة *</Label>
              <Input
                {...register("name")}
                placeholder="مثال: القانون المدني"
                className={`bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && (
                <p className="text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">الوصف</Label>
              <Textarea
                {...register("description")}
                placeholder="وصف موجز للفئة..."
                className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 min-h-25"
              />
              {errors.description && (
                <p className="text-sm text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="destructive"
              onClick={() => {
                setShowAddCategoryModal(false);
                reset();
              }}
            >
              إلغاء
            </Button>
            <Button
              variant="default"
              onClick={handleSubmit((data) => AddCategoryMutation.mutate(data))}
            >
              <Plus className=" w-4 h-4 ml-2" />
              إضافة الفئة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <AlertDialogContent className="bg-slate-800 border-slate-700" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              تأكيد الحذف
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              هل أنت متأكد من حذف هذه الفئة؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 text-white hover:bg-slate-600">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90">
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LawCategoriesManagement;
