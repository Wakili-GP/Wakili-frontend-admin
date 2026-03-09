import httpClient from "@/lib/HttpClient";
export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "Admin" | "moderator";
  status: "Active";
  createdAt: string;
}
export interface CreateAdminInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "Admin" | "Moderator";
}

const AdminServices = {
  getAllAdmins: async (): Promise<Admin[]> => {
    const res = await httpClient.get<Admin[]>("/Admins");
    return res.data;
  },

  createAdmin: async (input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
  }): Promise<Admin> => {
    const res = await httpClient.post<Admin>("/Admins", input);
    return res.data;
  },

  deleteAdmin: async (id: string): Promise<void> => {
    await httpClient.delete(`/Admins/${id}`);
  },
};

export default AdminServices;
