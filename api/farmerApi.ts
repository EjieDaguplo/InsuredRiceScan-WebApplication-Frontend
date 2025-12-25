import { Farmer } from "@/models/farmers";
import { apiRequest } from "./apiClient";

export const farmersApi = {
  getAll: () => apiRequest<Farmer[]>("/api/farmers"),

  getById: (id: string) => apiRequest<Farmer>(`/api/farmers/${id}`),

  getByAdminId: (adminId: string) =>
    apiRequest<Farmer[]>(`/api/farmers/admin/${adminId}`),

  create: (farmer: Omit<Farmer, "id" | "created_at">) =>
    apiRequest<Farmer>("/api/farmers", {
      method: "POST",
      body: JSON.stringify(farmer),
    }),

  update: (pcicid: string, farmer: Partial<Farmer>) =>
    apiRequest<void>(`/api/farmers/${pcicid}`, {
      method: "PUT",
      body: JSON.stringify(farmer),
    }),

  updateFields: (pcicid: string, fields: Partial<Farmer>) =>
    apiRequest<void>(`/api/farmers/${pcicid}/fields`, {
      method: "PATCH",
      body: JSON.stringify(fields),
    }),

  delete: (pcicid: string) =>
    apiRequest<void>(`/api/farmers/${pcicid}`, {
      method: "DELETE",
    }),
};
