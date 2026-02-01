import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Login from "./AdminLogin";
import Dashboard from "./admin/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          {/* add other nested routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
