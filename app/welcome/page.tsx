"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Users, LogIn } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if already logged in
    const userType = localStorage.getItem("user_type");
    if (userType) {
      router.push("/dashboard");
      return;
    }

    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-800 flex items-center justify-center p-8">
      <div
        className={`max-w-md w-full space-y-8 text-center transition-all duration-1000 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Logo Card */}
        <div className="mx-auto w-60 h-60 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
          <div className="w-52 h-52 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
            <Users size={120} className="text-white" />
          </div>
        </div>

        {/* App Title */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-white tracking-wide font-serif">
            InsuredRiceScan
          </h1>
          <p className="text-lg text-white/95 font-medium tracking-wide">
            Protect Your Harvest, Secure Your Future
          </p>
        </div>

        {/* Get Started Button */}
        <button
          onClick={() => router.push("/login")}
          className="w-4/5 mx-auto bg-white text-green-800 py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
        >
          <LogIn size={24} />
          Get Started
        </button>

        {/* Footer Text */}
        <p className="text-sm text-white/80 font-light">
          Rice Crop Insurance Management System
        </p>
      </div>
    </div>
  );
}
