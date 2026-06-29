import {
  Outlet,
  useNavigate,
  useLocation,
  Link,
  Navigate,
} from "react-router-dom";
import {
  Shield,
  Users,
  UserCheck,
  MessageSquare,
  BarChart3,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Scale,
  DollarSign,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

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
    path: "/specializations",
    label: "فئات القانون",
    icon: Scale,
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
    path: "/forums",
    label: "إدارة المنتدى",
    icon: MessageSquare,
  },
  {
    path: "/earnings",
    label: "الأرباح",
    icon: DollarSign,
  },
  {
    path: "/payrolls",
    label: "كشوفات الرواتب",
    icon: FileText,
  },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("تم تسجيل الخروج بنجاح");
    navigate("/login", { replace: true });
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50" dir="rtl" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Get active page title for the top bar
  const activeNavItem =
    navItems.find((item) => location.pathname.startsWith(item.path)) ||
    navItems[0];

  return (
    // FIX: Changed from "min-h-screen flex" to "h-screen flex overflow-hidden"
    // This prevents the body from ever having a scrollbar, so Radix's scroll-lock
    // has nothing to remove and the page never shifts.
    <div className="h-screen bg-gray-50 flex overflow-hidden" dir="rtl">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-700"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-secondary" />
            <span className="font-bold text-gray-900">وكيلك</span>
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-72 bg-primary z-50 transition-transform duration-300 shadow-xl flex flex-col",
          "lg:translate-x-0 lg:sticky lg:h-screen",
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo Section */}
        <div className="p-8 pb-6 border-b border-white/10">
          <div className="flex items-center justify-start gap-3 text-white">
            <Scale className="w-8 h-8 text-secondary" />
            <h1 className="text-2xl font-bold">وكيلك</h1>
          </div>
        </div>

        {/* Profile Section */}
        <div className="px-6 py-6 flex items-center justify-start gap-4 border-b border-white/10 mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden shadow-inner shrink-0 bg-white/10 flex items-center justify-center">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <Shield className="w-6 h-6 text-white/70" />
            )}
          </div>
          <div className="flex flex-col text-right overflow-hidden">
            <h2 className="text-white font-bold text-sm">
              {user?.firstName
                ? `${user.firstName} ${user.lastName}`
                : "المشرف العام"}
            </h2>
            <p className="text-gray-300 text-xs truncate mt-0.5">
              {user?.email || "admin@wakili.me"}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto dialog-scroll">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center justify-start gap-4 px-6 py-3.5 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-secondary text-gray-900 font-bold"
                    : "text-gray-300 hover:text-white font-medium",
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 shrink-0",
                    isActive
                      ? "text-gray-900"
                      : "text-gray-400 group-hover:text-white transition-colors",
                  )}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10 mt-auto">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full flex items-center justify-start gap-4 text-red-400 hover:bg-red-600 hover:text-white px-6 py-4 h-auto rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5 rtl:rotate-180 shrink-0" />
            <span className="font-medium text-base truncate">تسجيل الخروج</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      {/* FIX: Changed from "flex-1 flex flex-col min-w-0 min-h-screen" to
          "flex-1 flex flex-col min-w-0 overflow-y-auto"
          The content area now scrolls internally, so the body never gets a
          scrollbar that Radix can remove. */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="hidden lg:flex items-center justify-between bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
          <div className="flex items-center text-gray-500 text-sm font-medium">
            <span className="text-primary">لوحة التحكم</span>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-700">{activeNavItem.label}</span>
          </div>
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              {activeNavItem.label}
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 mt-16 lg:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;