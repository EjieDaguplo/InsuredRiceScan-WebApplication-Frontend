import { apiRequest } from "./apiClient";
import { Disease } from "@/models/disease";

export const diseasesApi = {
  getAll: () => apiRequest<Disease[]>("/api/diseases"),

  search: (searchTerm: string) =>
    apiRequest<Disease[]>(`/api/diseases?search=${searchTerm}`),

  getById: (id: string) => apiRequest<Disease>(`/api/diseases/${id}`),

  create: (disease: Omit<Disease, "id" | "created_at">) =>
    apiRequest<Disease>("/api/diseases", {
      method: "POST",
      body: JSON.stringify(disease),
    }),

  update: (diseaseId: string, updates: Partial<Disease>) =>
    apiRequest<Disease>(`/api/diseases/${diseaseId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  delete: (diseaseId: string) =>
    apiRequest<void>(`/api/diseases/${diseaseId}`, {
      method: "DELETE",
    }),
};
