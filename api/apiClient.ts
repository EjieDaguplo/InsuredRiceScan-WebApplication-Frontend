// API Base URL - Change this if your backend runs on a different port
export const API_BASE_URL =
  // process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  process.env.NEXT_PUBLIC_API_URL ||
  "https://insuredricescanwebapp-backend.onrender.com";

// Generic API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

// Helper function to handle API requests
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}
