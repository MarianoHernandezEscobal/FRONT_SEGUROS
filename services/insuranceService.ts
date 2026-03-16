import api from "./api";
import type {
  Insurance,
  CreateInsuranceRequest,
  UpdateInsuranceRequest,
} from "@/types/insurance";

export const insuranceService = {
  async getAll(): Promise<Insurance[]> {
    const response = await api.get<Insurance[]>("/seguros");
    return response.data;
  },

  async getById(id: string): Promise<Insurance> {
    const response = await api.get<Insurance>(`/seguros/${id}`);
    return response.data;
  },

  async create(data: CreateInsuranceRequest): Promise<Insurance> {
    const response = await api.post<Insurance>("/seguros", data);
    return response.data;
  },

  async update(id: string, data: UpdateInsuranceRequest): Promise<Insurance> {
    const response = await api.put<Insurance>(`/seguros/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/seguros/${id}`);
  },

  async sendReminders(): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>("/seguros/reminder");
    return response.data;
  },
  async renew(id: string, newExpirationDate: string): Promise<Insurance> {
    const response = await api.put<Insurance>(`/seguros/${id}`, {
      expirationDate: newExpirationDate,
    });
    return response.data;
  },
};

export default insuranceService;
