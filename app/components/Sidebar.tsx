// ADMIN SIDEBAR COMPONENT
"use client";

import { useRouter } from "next/navigation";
import { useSidebar } from "./context/SidebarContext";
import {
  Users,
  FileText,
  Calendar,
  CheckCircle,
  UserPlus,
  Home,
  X,
  LogOut,
  User,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get pathname safely (client-side only)
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";

  // Get user info from localStorage (client-side only)
  const userName =
    typeof window !== "undefined" ? localStorage.getItem("user_name") : null;
  const userType =
    typeof window !== "undefined" ? localStorage.getItem("user_type") : null;

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "farmers", label: "Farmers", icon: Users, path: "/farmers" },
    {
      id: "addFarmer",
      label: "Add Farmer",
      icon: UserPlus,
      path: "/add-farmer",
    },
    { id: "claims", label: "Claims", icon: FileText, path: "/claims" },
    { id: "visits", label: "Visits", icon: Calendar, path: "/visits" },
    { id: "check", label: "Check", icon: CheckCircle, path: "/check" },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Optional: Call logout API endpoint
      try {
        await fetch("http://localhost:3000/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.warn(
          "Logout API call failed, continuing with local cleanup:",
          error,
        );
      }

      // Clear all localStorage data
      localStorage.clear();

      // Alternative: Clear specific items only
      // localStorage.removeItem("user_id");
      // localStorage.removeItem("user_type");
      // localStorage.removeItem("user_name");
      // localStorage.removeItem("token");

      // Close sidebar if open
      setSidebarOpen(false);

      // Redirect to login
      router.push("/login");

      // Optional: Force page reload to clear any cached state
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, still clear session and redirect
      localStorage.clear();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-white shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        {/* Logo/Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-green-700">ADMIN</h1>
            <p className="text-xs text-gray-500 mt-1">Rice Insurance Portal</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav
          className="p-4 space-y-2 overflow-y-auto"
          style={{ height: "calc(100vh - 240px)" }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => {
                  router.push(item.path);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-green-700 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Info & Logout - Fixed at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white space-y-3">
          {/* User Profile Card */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
            <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold flex-shrink-0">
              {userName ? userName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {userName || "Admin User"}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {userType?.replace("_", " ") || "admin"}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <>
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <LogOut size={18} />
                <span>Logout</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
