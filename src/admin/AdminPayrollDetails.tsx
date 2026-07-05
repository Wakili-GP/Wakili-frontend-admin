import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, DollarSign } from "lucide-react";
import adminFinancialService from "@/services/financial.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminPayrollDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: details, isLoading, isError } = useQuery({
    queryKey: ["payrollDetails", id],
    queryFn: () => adminFinancialService.getPayrollDetails(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (isError || !details) return <div className="text-center py-20 text-red-500">خطأ في تحميل تفاصيل كشف الراتب</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/payrolls")}>
          <ArrowRight className="w-5 h-5 rtl:-scale-x-100" />
        </Button>
        <h2 className="text-xl font-bold">تفاصيل كشف الراتب #{details.id}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">المحامي</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{details.lawyerName}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">المبلغ الإجمالي</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">{details.totalAmount}ج.م</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">الحالة</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={details.status === "Paid" ? "default" : details.status === "Failed" ? "destructive" : "outline"} className={
              details.status === "Paid" ? "bg-emerald-500/10 text-emerald-700 border-emerald-200 text-sm py-1" :
                details.status === "Failed" ? "text-sm py-1" :
                  "bg-amber-500/10 text-amber-700 border-amber-200 text-sm py-1"
            }>
              {details.status === "Paid" ? "تم الدفع" : details.status === "Failed" ? "فشل الدفع" : "قيد الانتظار"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-secondary" />
            الأرباح المشمولة في هذا الكشف
          </CardTitle>
        </CardHeader>
        <CardContent>
          {details.earnings.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed rounded-xl">
              <p className="text-sm text-muted-foreground">لا توجد أرباح</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="text-xs text-muted-foreground bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 rounded-tr-lg">رقم الموعد</th>
                    <th className="px-4 py-3">التاريخ</th>
                    <th className="px-4 py-3">العميل</th>
                    <th className="px-4 py-3">المبلغ الإجمالي</th>
                    <th className="px-4 py-3">رسوم المنصة</th>
                    <th className="px-4 py-3 rounded-tl-lg">الصافي</th>
                  </tr>
                </thead>
                <tbody>
                  {details.earnings.map((earning) => (
                    <tr key={earning.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">{earning.appointmentId}</td>
                      <td className="px-4 py-3 font-medium">{new Date(earning.createdAt).toLocaleDateString("ar-EG")}</td>
                      <td className="px-4 py-3">{earning.clientName}</td>
                      <td className="px-4 py-3">{earning.grossAmount}ج.م</td>
                      <td className="px-4 py-3 text-emerald-500">+{earning.platformFee}ج.م</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">{earning.netAmount}ج.م</td>
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
