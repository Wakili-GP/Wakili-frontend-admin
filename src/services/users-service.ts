import httpClient from "@/services/api/HttpClient";
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  email: string;
  userType: "Lawyer" | "Client";
  createdAt: string;
  lastActionDate: string | null;
  status: "Active" | "Inactive";
}
const BASE = "/Users";
const UserService = {
  getUsers: async (): Promise<User[]> => {
    const response = await httpClient.get(`${BASE}`);
    return response.data.data;
  },
  deleteUser: async (id: string): Promise<void> => {
    const response = await httpClient.delete(`${BASE}/${id}`);
    return response.data.data;
  },
  toggleUserStatus: async (id: string): Promise<void> => {
    const response = await httpClient.put(`${BASE}/toggle-status/${id}`);
    return response.data.data;
  },
};
export default UserService;
