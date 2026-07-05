import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Loader2 } from "lucide-react";
import adminFinancialService from "@/services/financial.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminEarnings() {
  const { data: earnings, isLoading, isError } = useQuery({
    queryKey: ["allEarnings"],
    queryFn: adminFinancialService.getAllEarnings,
  });

  if (isLoading) {
    return <div className="flex justify-center items-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (isError || !earnings) {
    return <div className="text-center py-20 text-red-500">خطأ في تحميل بيانات الأرباح</div>;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-secondary" />
            جميع الأرباح
          </CardTitle>
        </CardHeader>
        <CardContent>
          {earnings.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed rounded-xl">
              <p className="text-sm text-muted-foreground">لا توجد أرباح حتى الآن</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="text-xs text-muted-foreground bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 rounded-tr-lg">التاريخ</th>
                    <th className="px-4 py-3">المحامي</th>
                    <th className="px-4 py-3">العميل</th>
                    <th className="px-4 py-3">المبلغ الإجمالي</th>
                    <th className="px-4 py-3">رسوم المنصة</th>
                    <th className="px-4 py-3">الصافي</th>
                    <th className="px-4 py-3 rounded-tl-lg">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.map((earning) => (
                    <tr key={earning.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{new Date(earning.createdAt).toLocaleDateString("ar-EG")}</td>
                      <td className="px-4 py-3">{earning.lawyerName}</td>
                      <td className="px-4 py-3">{earning.clientName}</td>
                      <td className="px-4 py-3">{earning.grossAmount}ج.م</td>
                      <td className="px-4 py-3 text-emerald-500">+{earning.platformFee}ج.م</td>
                      <td className="px-4 py-3 font-bold">{earning.netAmount}ج.م</td>
                      <td className="px-4 py-3">
                        <Badge variant={earning.status === "Paid" ? "default" : "outline"} className={
                          earning.status === "Paid" ? "bg-emerald-500/10 text-emerald-700 border-emerald-200" : "bg-amber-500/10 text-amber-700 border-amber-200"
                        }>
                          {earning.status === "Paid" ? "تم الدفع" : "قيد الانتظار"}
                        </Badge>
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
