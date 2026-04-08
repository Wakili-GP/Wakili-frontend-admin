import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import AuthServices, {
  type Admin,
  type AdminLoginInput,
} from "@/services/auth-service";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: Admin | null;
  isLoading: boolean;
  login: (credentials: AdminLoginInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const getStoredUser = () => {
  const userData = localStorage.getItem("adminUser");
  if (!userData) {
    return null;
  }

  try {
    return JSON.parse(userData) as Admin;
  } catch {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminAuth");
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initialUser = getStoredUser();
  const hasToken = Boolean(localStorage.getItem("adminToken"));

  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(initialUser && hasToken),
  );
  const [user, setUser] = useState<Admin | null>(initialUser);
  const [isLoading] = useState(false);

  const login = async ({ email, password }: AdminLoginInput) => {
    const response = await AuthServices.login({ email, password });

    if (!response.accessToken) {
      throw new Error("بيانات الاعتماد غير صحيحة");
    }

    localStorage.setItem("adminToken", response.accessToken);
    localStorage.setItem("adminAuth", "true");
    localStorage.setItem("adminUser", JSON.stringify(response.user));

    setUser(response.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminUser");
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = useMemo(
    () => ({ isAuthenticated, user, isLoading, login, logout }),
    [isAuthenticated, user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
