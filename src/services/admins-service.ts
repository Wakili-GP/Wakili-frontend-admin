import httpClient from "@/services/api/HttpClient";
import type { ApiResponse } from "@/services/auth-service";

export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Admin" | "SuperAdmin";
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface CreateAdminInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "Admin";
}

const BASE = "/Admins";

const AdminServices = {
  getAllAdmins: async (): Promise<Admin[]> => {
    const res = await httpClient.get<ApiResponse<Admin[]>>(BASE);
    return res.data.data;
  },

  createAdmin: async (input: CreateAdminInput): Promise<Admin> => {
    const res = await httpClient.post<ApiResponse<Admin>>(BASE, input);
    return res.data.data;
  },

  deleteAdmin: async (id: string): Promise<void> => {
    await httpClient.delete(`${BASE}/${id}`);
  },
};

export default AdminServices;
