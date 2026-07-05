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
import specializationsService, {
  type SpecializationInput,
} from "@/services/specializations-service";
import {
  SpecializationSchema,
  type SpecializationSchemaInput,
} from "@/schema/specializations-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDateTime, timeAgo } from "@/lib/utils";

const SpecializationsManagement = () => {
  // Modals state
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Active Tabs
  const [activeTab, setActiveTab] = useState<"all" | "active">("all");

  // Search Query
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SpecializationSchemaInput>({
    resolver: zodResolver(SpecializationSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Fetch Specializations
  const { data: specializations } = useQuery({
    queryKey: ["specializations"],
    queryFn: specializationsService.getAll,
  });

  // Filtered Specializations based on search and active tab
  const filteredSpecializations = specializations?.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === "all" ? true : c.isActive;

    return matchesSearch && matchesTab;
  });

  const queryClient = useQueryClient();
  const addMutation = useMutation({
    mutationFn: (data: SpecializationSchemaInput) =>
      specializationsService.addSpecialization({
        ...data,
        isActive: true,
      }),
    onSuccess: () => {
      toast.success("تم إضافة الفئة بنجاح");
      queryClient.invalidateQueries({ queryKey: ["specializations"] });
      setShowAddCategoryModal(false);
      reset();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SpecializationInput }) =>
      specializationsService.update(id, data),

    onSuccess: () => {
      toast.success("تم تحديث الحالة");
      queryClient.invalidateQueries({ queryKey: ["specializations"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => specializationsService.delete(id),

    onSuccess: () => {
      toast.success("تم الحذف بنجاح");
      queryClient.invalidateQueries({ queryKey: ["specializations"] });
    },
  });
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة فئات القانون</h1>
          <p className="text-gray-500 mt-1">إنشاء وإدارة فئات القانون</p>
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

      <div className="flex gap-4">
        <Card className="bg-white border-gray-200 shadow-sm flex-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Scale className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <p className="text-sm text-gray-500">فئات القانون</p>
                <p className="text-3xl font-bold text-gray-900">
                  {specializations?.length ?? 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-gray-200 shadow-sm flex-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Scale className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <p className="text-sm text-gray-500">الفئات النشطة</p>
                <p className="text-3xl font-bold text-gray-900">
                  {filteredSpecializations?.filter((c) => c.isActive).length ??
                    0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Search */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <Tabs
              dir="rtl"
              className="w-full md:w-auto"
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as "all" | "active")}
            >
              <TabsList className="bg-gray-50">
                <TabsTrigger className="cursor-pointer" value="all">
                  جميع الفئات
                </TabsTrigger>
                <TabsTrigger className="cursor-pointer" value="active">
                  الفئات النشطة
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full md:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="ابحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-500" />
            فئات القانون ({filteredSpecializations?.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSpecializations ? (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 hover:bg-gray-50">
                  <TableHead className="text-gray-500 text-center">
                    اسم الفئة
                  </TableHead>
                  <TableHead className="text-gray-500 text-center">
                    الوصف
                  </TableHead>
                  <TableHead className="text-gray-500 text-center">
                    تاريخ الإنشاء
                  </TableHead>
                  <TableHead className="text-gray-500 text-center">
                    الحالة
                  </TableHead>
                  <TableHead className="text-gray-500 text-center">
                    عدد المحامين
                  </TableHead>
                  <TableHead className="text-gray-500 text-center">
                    آخر تحديث
                  </TableHead>
                  <TableHead className="text-gray-500 text-center">
                    الإجراءات
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSpecializations?.map((category) => (
                  <TableRow
                    key={category.id}
                    className="border-gray-200 hover:bg-gray-50"
                  >
                    <TableCell className="text-gray-900 font-medium text-center">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-gray-600 max-w-xs truncate text-center">
                      {category.description}
                    </TableCell>
                    <TableCell className="text-gray-500 text-center">
                      <div className="space-y-1">
                        <p> {formatDateTime(category.createdOn)}</p>
                        <p className="text-xs text-gray-400">
                          {timeAgo(category.createdOn)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          dir="rtl"
                          checked={category.isActive}
                          onCheckedChange={() =>
                            toggleMutation.mutate({
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
                          className={`text-sm ${category.isActive ? "text-green-400" : "text-gray-700"}`}
                        >
                          {category.isActive ? "مفعّل" : "معطّل"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900 text-center font-medium">
                      {category.numOfLawyers ?? 0}
                    </TableCell>
                    <TableCell className="text-gray-500 text-center">
                      <div className="space-y-1">
                        <p>{formatDateTime(category.updatedOn)}</p>
                        <p className="text-xs text-gray-400">
                          {timeAgo(category.updatedOn)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => setDeleteConfirmId(category.id)}
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
              <FolderOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">لا توجد فئات مطابقة للبحث</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Category Modal */}
      <Dialog
        modal={false}
        open={showAddCategoryModal}
        onOpenChange={setShowAddCategoryModal}
      >
        <DialogContent className="bg-white border-gray-200" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-gray-900 flex justify-center gap-2">
              <Scale className="w-5 h-5 text-gray-900" />
              إضافة فئة قانون جديدة
            </DialogTitle>
            <DialogDescription className="text-gray-500 text-center">
              أدخل بيانات الفئة الجديدة
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-gray-600">اسم الفئة *</Label>
              <Input
                {...register("name")}
                placeholder="مثال: القانون المدني"
                className={`bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && (
                <p className="text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-600">الوصف</Label>
              <Textarea
                {...register("description")}
                placeholder="وصف موجز للفئة..."
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 min-h-25"
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
              onClick={handleSubmit((data) => addMutation.mutate(data))}
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
        <AlertDialogContent className="bg-white border-gray-200" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              تأكيد الحذف
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-900">
              هل أنت متأكد من حذف هذه الفئة؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 text-gray-900 hover:bg-gray-200">
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmId) {
                  deleteMutation.mutate(deleteConfirmId);
                  setDeleteConfirmId(null);
                }
              }}
              className="cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SpecializationsManagement;
