import { useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  Shield,
  Users,
  UserCheck,
  MessageSquare,
  BarChart3,
  LogOut,
  Menu,
  X,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    path: "/dashboard",
    label: "نظرة عامة",
    icon: BarChart3,
  },
  {
    path: "/verification",
    label: "توثيق المحامين",
    icon: UserCheck,
  },
  {
    path: "/credentials",
    label: "مراجعة المؤهلات",
    icon: GraduationCap,
  },
  {
    path: "/users",
    label: "إدارة المستخدمين",
    icon: Users,
  },
  {
    path: "/reviews",
    label: "المراجعات والتقييمات",
    icon: MessageSquare,
  },
  {
    path: "/articles",
    label: "إدارة المقالات",
    icon: BookOpen,
  },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth");
    if (!isAuth) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-900" dir="rtl">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-500" />
            <span className="font-bold text-white">لوحة التحكم</span>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-64 bg-slate-800 border-l border-slate-700 z-50 transition-transform duration-300",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-white">وكيلك</h1>
                <p className="text-xs text-slate-400">لوحة تحكم المشرف</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-700">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:mr-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
