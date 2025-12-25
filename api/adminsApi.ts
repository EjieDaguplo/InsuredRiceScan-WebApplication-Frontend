import { apiRequest } from "./apiClient";
import { Admin } from "@/models/admins";

export const adminsApi = {
  getAll: () => apiRequest<Admin[]>("/api/admins"),

  getById: (id: string) => apiRequest<Admin>(`/api/admins/${id}`),

  login: (email: string, password: string) =>
    apiRequest<Admin>("/api/admins/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  create: (admin: { name: string; email: string; password: string }) =>
    apiRequest<Admin>("/api/admins", {
      method: "POST",
      body: JSON.stringify(admin),
    }),

  update: (adminId: string, updates: Partial<Admin>) =>
    apiRequest<Admin>(`/api/admins/${adminId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  delete: (adminId: string) =>
    apiRequest<void>(`/api/admins/${adminId}`, {
      method: "DELETE",
    }),
};
