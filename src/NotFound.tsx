import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-linear-to-br from-muted via-background to-accent"
    >
      <div className="text-center p-8 max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-primary" />
          </div>
        </div>

        <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          الصفحة غير موجودة
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر.
        </p>

        <Button
          asChild
          variant="default"
          size="lg"
          className="text-white cursor-pointer"
        >
          <Link to="/dashboard" className="gap-2">
            <Home className="w-5 h-5" />
            العودة للرئيسية
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
