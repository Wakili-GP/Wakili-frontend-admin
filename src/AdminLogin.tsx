import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Eye, EyeOff, Loader, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { authApi } from "@/services/auth.service";
import type { LoginInput } from "@/lib/api-types";

// Mock credentials for development/fallback
const MOCK_ADMIN = {
  email: "admin@wakili.me",
  password: "admin123",
  token: "mock-admin-token-12345",
};

const MOCK_LOGIN_RESPONSE = {
  token: MOCK_ADMIN.token,
  admin: {
    id: "1",
    name: "المشرف الرئيسي",
    email: MOCK_ADMIN.email,
    role: "super_admin" as const,
  },
};

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        // Try to verify token with backend
        const verified = await authApi.verify();
        if (verified) {
          navigate("/dashboard");
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const loginInput: LoginInput = { email, password };

      // Try API call first
      let result = await authApi.login(loginInput);

      // Fallback to mock for development
      if (!result) {
        if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
          result = MOCK_LOGIN_RESPONSE;
        } else {
          setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
          toast.error("خطأ في تسجيل الدخول", {
            description: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          });
          setIsLoading(false);
          return;
        }
      }

      // Store token
      if (result) {
        localStorage.setItem("adminToken", result.token);
        localStorage.setItem("adminAuth", "true");
        localStorage.setItem("adminUser", JSON.stringify(result.admin));

        toast.success("تم تسجيل الدخول بنجاح", {
          description: "مرحباً بك في لوحة التحكم",
        });
        navigate("/dashboard");
      } else {
        setError("فشل تسجيل الدخول");
        toast.error("خطأ في تسجيل الدخول");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("حدث خطأ أثناء محاولة تسجيل الدخول");
      toast.error("خطأ في الاتصال");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNNDAgMzBoNHY0aC00ek00NCAzNGg0djRoLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>

      <Card className="w-full max-w-md relative bg-slate-800/80 border-slate-700 backdrop-blur-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-linear-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">
              لوحة تحكم المشرف
            </CardTitle>
            <CardDescription className="text-slate-400 mt-2">
              سجل دخولك للوصول إلى لوحة التحكم
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="p-4 mb-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-medium">{error}</p>
              </div>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@wakili.me"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                كلمة المرور
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/20 pl-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="cursor-pointer w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-5 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 ml-2 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 text-center">
              بيانات الدخول التجريبية:
              <br />
              <span className="text-amber-400 font-mono">
                admin@wakili.me / admin123
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
