import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Login from "./AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import LawyerVerification from "./admin/LawyerVerification";
import CredentialReview from "./admin/CredentialReview";
import NotFound from "./NotFound";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./App.css";
function App() {
  return (
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="verification" element={<LawyerVerification />} />
            <Route path="credentials" element={<CredentialReview />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;
