import { Schedule, ScheduleStats } from "@/models/schedules";
import { apiRequest } from "./apiClient";

export const schedulesApi = {
  getAll: () => apiRequest<Schedule[]>("/api/schedules"),

  getStats: () => apiRequest<ScheduleStats>("/api/schedules/stats"),

  getById: (scheduleId: string) =>
    apiRequest<Schedule>(`/api/schedules/${scheduleId}`),

  getByFarmerId: (farmerId: string) =>
    apiRequest<Schedule[]>(`/api/schedules/farmer/${farmerId}`),

  getSingleByFarmerId: (farmerId: string) =>
    apiRequest<Schedule>(`/api/schedules/farmer/${farmerId}/single`),

  getByStatus: (status: "pending" | "in-progress" | "done") =>
    apiRequest<Schedule[]>(`/api/schedules/status/${status}`),

  getByAdminId: (adminId: string) =>
    apiRequest<Schedule[]>(`/api/schedules/admin/${adminId}`),

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

  delete: (scheduleId: string) =>
    apiRequest<void>(`/api/schedules/${scheduleId}`, {
      method: "DELETE",
    }),

  linkEvidence: (farmerId: string, scheduleId: string) =>
    apiRequest<void>("/api/schedules/link-evidence", {
      method: "POST",
      body: JSON.stringify({ farmerId, scheduleId }),
    }),
};
