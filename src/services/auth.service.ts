import httpClient from "@/lib/HttpClient";

export interface AdminLoginInput {
  email: string;
  password: string;
}
export interface Token {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  phoneNumber: string;
  profileImage: string;
  createdAt: string;
}

export interface AuthAdmin extends Token {
  user: Admin;
}
const AuthServices = {
  login: async ({ email, password }: AdminLoginInput): Promise<AuthAdmin> => {
    const res = await httpClient.post<AuthAdmin>("/Auth/admin-login", {
      email,
      password,
    });
    return res.data;
  },
};

export default AuthServices;
