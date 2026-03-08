import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import {
  Scale,
  Plus,
  Trash2,
  Search,
  FolderOpen,
  AlertTriangle,
  Loader2,
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

type LawCategory = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  isActive: boolean;
};

const initialCategories: LawCategory[] = [
  {
    id: "1",
    name: "القانون المدني",
    description: "يشمل العقود والمعاملات المدنية",
    createdAt: "2024-01-01",
    isActive: true,
  },
  {
    id: "2",
    name: "القانون الجنائي",
    description: "يتعامل مع الجرائم والعقوبات",
    createdAt: "2024-01-01",
    isActive: true,
  },
  {
    id: "3",
    name: "قانون الأسرة",
    description: "يشمل الزواج والطلاق والحضانة",
    createdAt: "2024-01-01",
    isActive: true,
  },
  {
    id: "4",
    name: "القانون التجاري",
    description: "يتعامل مع الشركات والأعمال التجارية",
    createdAt: "2024-01-01",
    isActive: true,
  },
  {
    id: "5",
    name: "قانون العمل",
    description: "ينظم علاقات العمل بين الموظفين وأصحاب العمل",
    createdAt: "2024-01-01",
    isActive: true,
  },
];

const LawCategoriesManagement = () => {
  const [categories, setCategories] =
    useState<LawCategory[]>(initialCategories);
  const [filteredCategories, setFilteredCategories] =
    useState<LawCategory[]>(initialCategories);

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formErrors, setFormErrors] = useState<{ name?: string }>({});

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    const filtered = categories.filter(
      (cat) =>
        cat.name.includes(searchQuery) || cat.description.includes(searchQuery),
    );

    setFilteredCategories(filtered);
  }, [searchQuery, categories]);

  const handleToggleActive = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, isActive: !cat.isActive } : cat,
      ),
    );

    toast.success("تم تحديث حالة الفئة");
  };

  const handleAddCategory = () => {
    setFormErrors({});

    if (!newCategory.name.trim()) {
      setFormErrors({ name: "اسم الفئة مطلوب" });
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      const category: LawCategory = {
        id: Date.now().toString(),
        name: newCategory.name,
        description: newCategory.description,
        createdAt: new Date().toISOString(),
        isActive: newCategory.isActive,
      };

      setCategories((prev) => [...prev, category]);

      toast.success("تم إضافة الفئة بنجاح");

      setNewCategory({
        name: "",
        description: "",
        isActive: true,
      });

      setShowAddCategoryModal(false);
      setIsSaving(false);
    }, 600);
  };

  const handleDeleteCategory = (id: string) => {
    setIsSaving(true);

    setTimeout(() => {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      setDeleteConfirmId(null);

      toast.success("تم حذف الفئة");
      setIsSaving(false);
    }, 500);
  };

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
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90"
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
                {categories.length}
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

      {/* Table */}

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-500" />
            فئات القانون ({filteredCategories.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400 mr-2" />
              <p className="text-slate-400">جاري تحميل البيانات...</p>
            </div>
          ) : filteredCategories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-center text-slate-400">
                    اسم الفئة
                  </TableHead>

                  <TableHead className="text-center text-slate-400">
                    الوصف
                  </TableHead>

                  <TableHead className="text-center text-slate-400">
                    الحالة
                  </TableHead>

                  <TableHead className="text-center text-slate-400">
                    تاريخ الإنشاء
                  </TableHead>

                  <TableHead className="text-center text-slate-400">
                    الإجراءات
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow
                    key={category.id}
                    className="border-slate-700 text-center"
                  >
                    <TableCell className="text-white font-medium">
                      {category.name}
                    </TableCell>

                    <TableCell className="text-slate-300 max-w-xs truncate">
                      {category.description}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          checked={category.isActive}
                          onCheckedChange={() =>
                            handleToggleActive(category.id)
                          }
                        />

                        <span
                          className={`text-sm ${
                            category.isActive
                              ? "text-green-400"
                              : "text-slate-500"
                          }`}
                        >
                          {category.isActive ? "مفعّل" : "معطّل"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-slate-400">
                      {new Date(category.createdAt).toLocaleDateString("ar-SA")}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmId(category.id)}
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

      {/* Add Modal */}

      <Dialog
        open={showAddCategoryModal}
        onOpenChange={setShowAddCategoryModal}
      >
        <DialogContent className="bg-slate-800 border-slate-700" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-white text-center">
              إضافة فئة قانون جديدة
            </DialogTitle>
            <DialogDescription className="text-center text-slate-400">
              أدخل بيانات الفئة الجديدة
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">اسم الفئة *</Label>

              <Input
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="bg-slate-900 border-slate-600 text-white"
              />

              {formErrors.name && (
                <p className="text-red-400 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <Label className="text-slate-300">الوصف</Label>

              <Textarea
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                className="bg-slate-900 border-slate-600 text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => setShowAddCategoryModal(false)}
            >
              إلغاء
            </Button>

            <Button onClick={handleAddCategory}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة الفئة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}

      <AlertDialog
        open={!!deleteConfirmId}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <AlertDialogContent className="bg-slate-800 border-slate-700" dir="rtl">
          <AlertDialogHeader className="text-center">
            <AlertDialogTitle className="text-white flex items-center justify-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              تأكيد الحذف
            </AlertDialogTitle>

            <AlertDialogDescription className="text-slate-400">
              هل أنت متأكد من حذف هذه الفئة؟
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>

            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() =>
                deleteConfirmId && handleDeleteCategory(deleteConfirmId)
              }
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LawCategoriesManagement;
