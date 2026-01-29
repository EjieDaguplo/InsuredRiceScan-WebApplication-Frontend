"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check cookies first (server-side safe)
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };

    const userType = getCookie("user_type");

    if (userType) {
      // User is logged in
      if (userType === "farmer") {
        router.push("/farmer-dashboard");
      } else {
        router.push("/admin/dashboard");
      }
    } else {
      // Not logged in
      router.push("/welcome");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-800 flex items-center justify-center">
      <div className="text-white text-2xl font-bold animate-pulse">
        Loading...
      </div>
    </div>
  );
}
