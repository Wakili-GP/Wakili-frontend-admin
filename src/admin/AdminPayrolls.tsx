import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, PlayCircle, CheckCircle, XCircle, Eye } from "lucide-react";
import adminFinancialService from "@/services/financial.service";
import httpClient from "@/services/api/HttpClient";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export default function AdminPayrolls() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [lawyerId, setLawyerId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: payrolls, isLoading, isError } = useQuery({
    queryKey: ["allPayrolls"],
    queryFn: adminFinancialService.getPayrolls,
  });

  const { data: lawyersResponse } = useQuery({
    queryKey: ["approvedLawyers"],
    queryFn: async () => {
      const response = await httpClient.get("/Lawyers/approved", {
        params: { page: 1, pageSize: 1000, sortBy: 0, sortOrder: "desc" }
      });
      return response.data;
    },
  });

  const lawyers = Array.isArray(lawyersResponse?.data) ? lawyersResponse.data :
    Array.isArray(lawyersResponse?.data?.items) ? lawyersResponse.data.items :
      Array.isArray(lawyersResponse?.items) ? lawyersResponse.items : [];

  const filteredLawyers = lawyers.filter((l: any) =>
    `${l.firstName} ${l.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateMutation = useMutation({
    mutationFn: () => adminFinancialService.generatePayroll({
      lawyerId,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined
    }),
    onSuccess: () => {
      toast.success("تم إنشاء كشف الراتب بنجاح");
      queryClient.invalidateQueries({ queryKey: ["allPayrolls"] });
      setLawyerId("");
      setFromDate("");
      setToDate("");
      setDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "لا يوجد أرباح لإنشاء كشف الراتب");
    },
  });

  const markPaidMutation = useMutation({
    mutationFn: adminFinancialService.markPayrollPaid,
    onSuccess: () => {
      toast.success("تم تأكيد الدفع بنجاح");
      queryClient.invalidateQueries({ queryKey: ["allPayrolls"] });
    },
    onError: () => toast.error("خطأ في تحديث الحالة"),
  });

  const markFailedMutation = useMutation({
    mutationFn: adminFinancialService.markPayrollFailed,
    onSuccess: () => {
      toast.success("تم تحديد كشف الراتب كفاشل");
      queryClient.invalidateQueries({ queryKey: ["allPayrolls"] });
    },
    onError: () => toast.error("خطأ في تحديث الحالة"),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (isError) return <div className="text-center py-20 text-red-500">خطأ في تحميل كشوفات الرواتب</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">كشوفات الرواتب</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlayCircle className="w-4 h-4 ml-2" />
              إنشاء كشف راتب جديد
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إنشاء كشف راتب لمحامي</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">المحامي</label>
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span>
                      {lawyerId ? lawyers.find((l: any) => l.id === lawyerId)?.firstName + ' ' + lawyers.find((l: any) => l.id === lawyerId)?.lastName : "اختر المحامي"}
                    </span>
                    <Search className="h-4 w-4 opacity-50" />
                  </div>

                  {dropdownOpen && (
                    <div className="absolute top-11 left-0 right-0 z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-none bg-white">
                      <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                          className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="ابحث عن محامي..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="max-h-[200px] overflow-y-auto p-1">
                        {filteredLawyers.length === 0 ? (
                          <div className="py-6 text-center text-sm text-gray-500">لا يوجد نتائج.</div>
                        ) : (
                          filteredLawyers.map((lawyer: any) => (
                            <div
                              key={lawyer.id}
                              className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-gray-100 ${lawyerId === lawyer.id ? "bg-gray-100 font-bold" : ""}`}
                              onClick={() => {
                                setLawyerId(lawyer.id);
                                setDropdownOpen(false);
                                setSearchQuery("");
                              }}
                            >
                              <CheckCircle className={`ml-2 h-4 w-4 text-primary ${lawyerId === lawyer.id ? "opacity-100" : "opacity-0"}`} />
                              {lawyer.firstName} {lawyer.lastName}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">من تاريخ (اختياري)</label>
                <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">إلى تاريخ (اختياري)</label>
                <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>
              <Button
                className="w-full mt-4"
                disabled={!lawyerId || generateMutation.isPending}
                onClick={() => generateMutation.mutate()}
              >
                {generateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin ml-2" />}
                تأكيد الإنشاء
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-secondary" />
            سجل كشوفات الرواتب
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!payrolls || payrolls.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed rounded-xl">
              <p className="text-sm text-muted-foreground">لا توجد كشوفات حتى الآن</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="text-xs text-muted-foreground bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 rounded-tr-lg">التاريخ</th>
                    <th className="px-4 py-3">رقم الكشف</th>
                    <th className="px-4 py-3">المحامي</th>
                    <th className="px-4 py-3">المبلغ المستحق</th>
                    <th className="px-4 py-3">الحالة</th>
                    <th className="px-4 py-3 rounded-tl-lg text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {payrolls.map((payroll) => (
                    <tr key={payroll.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{new Date(payroll.createdAt).toLocaleDateString("ar-EG")}</td>
                      <td className="px-4 py-3 font-mono">#{payroll.id}</td>
                      <td className="px-4 py-3">{payroll.lawyerName}</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">{payroll.totalAmount}ج.م</td>
                      <td className="px-4 py-3">
                        <Badge variant={payroll.status === "Paid" ? "default" : payroll.status === "Failed" ? "destructive" : "outline"} className={
                          payroll.status === "Paid" ? "bg-emerald-500/10 text-emerald-700 border-emerald-200" :
                            payroll.status === "Failed" ? "" :
                              "bg-amber-500/10 text-amber-700 border-amber-200"
                        }>
                          {payroll.status === "Paid" ? "تم الدفع" : payroll.status === "Failed" ? "فشل الدفع" : "قيد الانتظار"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => navigate(`/payrolls/${payroll.id}`)}
                            title="التفاصيل"
                          >
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </Button>
                          {payroll.status === "Pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                onClick={() => markPaidMutation.mutate(payroll.id)}
                                disabled={markPaidMutation.isPending || markFailedMutation.isPending}
                                title="تأكيد الدفع"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-red-200 text-red-600 hover:bg-red-50"
                                onClick={() => markFailedMutation.mutate(payroll.id)}
                                disabled={markPaidMutation.isPending || markFailedMutation.isPending}
                                title="فشل الدفع"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
