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
  isActive: true;
}

const BASE = "/Specializations";

const SpecializationService = {
  getAll: async (): Promise<Specialization[]> => {
    const response = await httpClient.get(BASE);
    return response.data.data;
  },
};
export default SpecializationService;
