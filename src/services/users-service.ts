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

type UsersPayload =
  | User[]
  | {
      items?: User[];
      users?: User[];
      results?: User[];
      data?: User[];
    };

const extractUsers = (payload: UsersPayload | null | undefined): User[] => {
  if (Array.isArray(payload)) return payload;
  if (!payload) return [];

  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.users)) return payload.users;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.data)) return payload.data;

  return [];
};

const BASE = "/Users";
const UserService = {
  getUsers: async ({
    Page,
    PageSize,
    Name,
    userType,
    Status,
  }: {
    Page: number;
    PageSize: number;
    Name?: string;
    userType?: "Lawyer" | "Client";
    Status?: 0 | 1;
  }): Promise<User[]> => {
    const response = await httpClient.get(`${BASE}`, {
      params: {
        Page,
        PageSize,
        Name,
        userType,
        Status,
      },
    });

    return extractUsers(response.data?.data as UsersPayload | undefined);
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
