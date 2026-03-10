import httpClient from "@/lib/HttpClient";
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
};
export default UserService;
