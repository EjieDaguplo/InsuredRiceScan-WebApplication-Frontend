import { Farmer } from "./farmers";
import { Schedule } from "./schedules";

export interface Evidence {
  id: string;
  farmer_id: string;
  image_url: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  claim_schedule_id?: string;
  captured_at: string;
  farmer?: Farmer;
  claim_schedules?: Schedule | null;
}
