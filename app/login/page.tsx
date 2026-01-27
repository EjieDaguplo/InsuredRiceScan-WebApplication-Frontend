"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  RefreshCw,
  Users,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [insuranceId, setInsuranceId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    setError("");

    if (!insuranceId.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: insuranceId.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user session data
        localStorage.setItem("user_type", data.userType);
        localStorage.setItem("user_id", data.userId);

        // Store user-specific information
        if (data.userType === "farmer") {
          const farmerName = data.user.fname || "Farmer";
          localStorage.setItem("user_name", farmerName);
          localStorage.setItem("pcic_id", data.user.pcicid);
          router.push("/farmer-dashboard");
        } else if (data.userType === "admin") {
          localStorage.setItem("user_name", data.user.name);
          localStorage.setItem("user_email", data.user.email);
          router.push("/dashboard");
        } else if (data.userType === "super_admin") {
          localStorage.setItem("user_name", data.user.name);
          localStorage.setItem("user_email", data.user.email);
          router.push("/dashboard");
        }
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Connection error. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-800 flex items-center justify-center p-8">
      {/* Back Button */}
      <button
        onClick={() => router.push("/welcome")}
        className="absolute top-4 left-4 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <ArrowLeft className="text-white" size={24} />
      </button>

      <div
        className={`max-w-md w-full space-y-6 transition-all duration-1000 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Logo */}
        <div className="mx-auto w-48 h-48 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
          <div className="w-40 h-40 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
            <Users size={80} className="text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-wide font-serif">
            InsuredRiceScan
          </h1>
          <p className="text-white/90 font-medium">Sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-300 rounded-xl p-3 text-white text-sm">
            {error}
          </div>
        )}

        {/* Insurance ID Field */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700">
            <User size={20} />
          </div>
          <input
            type="text"
            value={insuranceId}
            onChange={(e) => setInsuranceId(e.target.value)}
            placeholder="Enter email or insurance ID"
            className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border-2 border-white/50 focus:border-white focus:outline-none text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* Password Field */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700">
            <Lock size={20} />
          </div>
          <input
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Enter your password"
            className="w-full pl-12 pr-12 py-4 bg-white rounded-xl border-2 border-white/50 focus:border-white focus:outline-none text-gray-800 placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-green-700"
          >
            {passwordVisible ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        {/* Login Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-white text-green-800 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <RefreshCw size={20} className="animate-spin" />
          ) : (
            "Sign In"
          )}
        </button>
      </div>
    </div>
  );
}
