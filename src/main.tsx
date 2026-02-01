import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AdminLogin from "./AdminLogin";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AdminLogin />
  </StrictMode>,
);
