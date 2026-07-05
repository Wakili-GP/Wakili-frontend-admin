import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Shield, Eye, EyeOff, Loader } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { type AdminLoginInput } from "./services/auth-service";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const {
    register, handleSubmit, formState: { errors },
  } = useForm<AdminLoginInput>();

  const loginMutation = useMutation<void, Error, AdminLoginInput>({
    mutationFn: (credentials) => login(credentials),
    onSuccess: () => {
      toast.success("تم تسجيل الدخول بنجاح", { description: "مرحباً بك في لوحة التحكم" });
      navigate("/dashboard");
    },
    onError: () => {
      toast.error("خطأ في تسجيل الدخول", { description: "حاول تسجيل الدخول مرة اخري" });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md relative bg-white border-gray-200 shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-linear-to-br from-primary to-blue-800 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">لوحة تحكم المشرف</CardTitle>
            <CardDescription className="text-gray-500 mt-2">سجل دخولك للوصول إلى لوحة التحكم</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((onSubmit) => loginMutation.mutate(onSubmit))} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">البريد الإلكتروني</Label>
              <Input id="email" type="email"
                {...register("email", { required: "البريد الإلكتروني مطلوب" })}
                className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary/20" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">كلمة المرور</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"}
                  {...register("password", { required: "كلمة المرور مطلوبة" })}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-primary/20 pl-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>
            </div>
            <Button type="submit"
              className="cursor-pointer w-full bg-primary hover:bg-primary/90 text-white font-medium py-5 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loginMutation.isPending}>
              {loginMutation.isPending ? (
                <><Loader className="w-4 h-4 ml-2 animate-spin" /> جاري تسجيل الدخول...</>
              ) : "تسجيل الدخول"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
