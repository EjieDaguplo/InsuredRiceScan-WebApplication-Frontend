import { apiRequest } from "./apiClient";
import { Evidence } from "@/models/claimEvidence";

export const claimsevidenceApi = {
  getAll: () => apiRequest<Evidence[]>("/api/evidence"),

  getById: (id: string) => apiRequest<Evidence>(`/api/evidence/${id}`),

  getByFarmerId: (farmerId: string) =>
    apiRequest<Evidence[]>(`/api/evidence/farmer/${farmerId}`),

  getByScheduleId: (scheduleId: string) =>
    apiRequest<Evidence[]>(`/api/evidence/schedule/${scheduleId}`),

  getUnlinked: (farmerId?: string) =>
    apiRequest<Evidence[]>(
      farmerId
        ? `/api/evidence/unlinked/all?farmerId=${farmerId}`
        : "/api/evidence/unlinked/all"
    ),

  create: (evidence: {
    farmerId: string;
    imageUrl: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    scheduleId?: string;
  }) =>
    apiRequest<Evidence>("/api/evidence", {
      method: "POST",
      body: JSON.stringify(evidence),
    }),

  update: (evidenceId: string, updates: Partial<Evidence>) =>
    apiRequest<Evidence>(`/api/evidence/${evidenceId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  delete: (evidenceId: string) =>
    apiRequest<void>(`/api/evidence/${evidenceId}`, {
      method: "DELETE",
    }),
};
