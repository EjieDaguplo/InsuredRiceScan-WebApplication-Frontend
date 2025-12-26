import { Farmer } from "./farmers";

export interface Schedule {
  id: string;
  farmer_id: string;
  admin_id: string;
  scheduled_date: string;
  notes?: string;
  status: "pending" | "in-progress" | "done";
  created_at: string;
  farmers?: Farmer;
}
export interface ScheduleStats {
  total: number;
  pending: number;
  inProgress: number;
  done: number;
}
