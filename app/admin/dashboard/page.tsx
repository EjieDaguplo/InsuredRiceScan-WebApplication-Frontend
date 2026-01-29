"use client";

import ProtectedRoute from "@/app/components/protectedRoute";
import DashboardPage from "../DashboardPage";

export default function Dashboard() {
  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <DashboardPage />
    </ProtectedRoute>
  );
}
