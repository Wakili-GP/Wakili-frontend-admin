import httpClient from "@/lib/HttpClient";
export interface Specialization {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface SpeciliazationInput {
  name: string;
  description: string;
  isActive: boolean;
}

const BASE = "/Specializations";

const lawCategoriesService = {
  getAll: async (): Promise<Specialization[]> => {
    const response = await httpClient.get(BASE);
    return response.data.data;
  },
  addCategory: async (data: SpeciliazationInput): Promise<void> => {
    const response = await httpClient.post(BASE, data);
    return response.data.data;
  },
  deActivateCategory: async (
    id: number,
    data: SpeciliazationInput,
  ): Promise<void> => {
    const response = await httpClient.put(`${BASE}/${id}`, data);
    return response.data.data;
  },
};
export default lawCategoriesService;
