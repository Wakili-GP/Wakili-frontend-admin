import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Login from "./AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import LawyerVerification from "./admin/LawyerVerification";
import CredentialReview from "./admin/CredentialReview";
import UserManagement from "./admin/UserManagement";
import NotFound from "./NotFound";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReviewModeration from "./admin/ReviewModeration";
import "./App.css";
import LawCategoriesManagement from "./admin/LawCategoriesManagement";
function App() {
  return (
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="verification" element={<LawyerVerification />} />
            <Route path="credentials" element={<CredentialReview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="reviews" element={<ReviewModeration />} />
            <Route path="categories" element={<LawCategoriesManagement />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;
