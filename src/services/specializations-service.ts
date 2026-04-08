import httpClient from "@/services/api/HttpClient";

export interface Specialization {
  id: number;
  name: string;
  description: string;
  numOfLawyers: number;
  isActive: boolean;
  createdOn: string;
  createdById: string | null;
  updatedOn: string;
  updatedById: string | null;
}

export interface SpecializationInput {
  name: string;
  description: string;
  isActive: boolean;
}

const BASE = "/Specializations";

const specializationsService = {
  getAll: async (): Promise<Specialization[]> => {
    const res = await httpClient.get(BASE);
    return res.data.data;
  },

  getAllActive: async (): Promise<Specialization[]> => {
    const res = await httpClient.get(`${BASE}/active`);
    return res.data.data;
  },

  addSpecialization: async (
    data: SpecializationInput,
  ): Promise<Specialization> => {
    const res = await httpClient.post(BASE, data);
    return res.data.data;
  },

  getById: async (id: number): Promise<Specialization> => {
    const res = await httpClient.get(`${BASE}/${id}`);
    return res.data.data;
  },

  update: async (
    id: number,
    data: SpecializationInput,
  ): Promise<Specialization> => {
    const res = await httpClient.put(`${BASE}/${id}`, data);
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await httpClient.delete(`${BASE}/${id}`);
  },
};

export default specializationsService;
