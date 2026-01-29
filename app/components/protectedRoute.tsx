"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles = ["admin", "super_admin"],
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userType = localStorage.getItem("user_type");
      const userId = localStorage.getItem("user_id");

      console.log("Protected Route Check:", {
        userType,
        userId,
        allowedRoles,
      });

      // Not logged in
      if (!userType || !userId) {
        console.log("Not authenticated, redirecting to login");
        router.push("/login");
        return;
      }

      // Check role authorization
      if (!allowedRoles.includes(userType)) {
        console.log("Wrong role, redirecting");
        // Redirect to appropriate dashboard
        if (userType === "farmer") {
          router.push("/components/farmers/dashboard");
        } else {
          router.push("/admin/dashboard");
        }
        return;
      }

      console.log("Authorized");
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
