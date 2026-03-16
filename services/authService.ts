import api from "./api";
import type { LoginRequest, LoginResponse } from "@/types/user";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/users/login", credentials);
    return response.data;
  },
};

export default authService;
