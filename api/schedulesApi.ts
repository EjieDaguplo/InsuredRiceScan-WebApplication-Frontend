import { Schedule } from "@/models/schedules";
import { apiRequest } from "./apiClient";

export const schedulesApi = {
  getAll: () => apiRequest<Schedule[]>("/api/schedules"),

  getByFarmerId: (farmerId: string) =>
    apiRequest<Schedule[]>(`/api/schedules/farmer/${farmerId}`),

  getSingleByFarmerId: (farmerId: string) =>
    apiRequest<Schedule>(`/api/schedules/farmer/${farmerId}/single`),

  create: (schedule: {
    farmerId: string;
    adminId: string;
    scheduledDate: string;
    notes?: string;
  }) =>
    apiRequest<Schedule>("/api/schedules", {
      method: "POST",
      body: JSON.stringify(schedule),
    }),

  update: (
    scheduleId: string,
    updates: { scheduledDate: string; notes?: string; status?: string }
  ) =>
    apiRequest<void>(`/api/schedules/${scheduleId}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  markAsDone: (scheduleId: string) =>
    apiRequest<void>(`/api/schedules/${scheduleId}/done`, {
      method: "PATCH",
    }),

  linkEvidence: (farmerId: string, scheduleId: string) =>
    apiRequest<void>("/api/schedules/link-evidence", {
      method: "POST",
      body: JSON.stringify({ farmerId, scheduleId }),
    }),
};
