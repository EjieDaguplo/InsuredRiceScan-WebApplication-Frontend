"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userType = localStorage.getItem("user_type");

    if (userType) {
      router.push("/dashboard");
    } else {
      router.push("/welcome");
    }
  }, [router]);

  // Loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-800 flex items-center justify-center">
      <div className="text-white text-2xl font-bold">Loading...</div>
    </div>
  );
}
