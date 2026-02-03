import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Login from "./AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import LawyerVerification from "./admin/LawyerVerification";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="verification" element={<LawyerVerification />} />{" "}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
