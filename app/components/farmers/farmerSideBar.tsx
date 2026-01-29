//FARMER SIDEBAR COMPONENT
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  Home,
  Camera,
  Activity,
  FileText,
  Calendar,
  User,
  LogOut,
  X,
} from "lucide-react";
import { useState } from "react";
import { deleteAllCookies } from "@/app/utils/cookies";

export default function FarmerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get user info from localStorage (client-side only)
  const userName =
    typeof window !== "undefined" ? localStorage.getItem("user_name") : null;
  const pcicId =
    typeof window !== "undefined" ? localStorage.getItem("pcic_id") : null;

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/components/farmers/dashboard",
    },
    {
      id: "capture",
      label: "Take Evidence",
      icon: Camera,
      path: "/components/farmers/capture-evidence",
    },
    {
      id: "disease",
      label: "Disease & Cure",
      icon: Activity,
      path: "/components/farmers/disease-diagnosis",
    },
    {
      id: "evidence",
      label: "My Evidence",
      icon: FileText,
      path: "/components/farmers/evidence",
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: Calendar,
      path: "/components/farmers/schedule",
    },
  ];
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      //DEBUG COOKIES
      deleteAllCookies();

      //Clear cookies FIRST
      deleteCookie("user_type");
      deleteCookie("user_id");
      deleteCookie("user_name");

      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();

      // Optional API call
      try {
        await fetch("http://localhost:3000/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.warn("Logout API call failed:", error);
      }

      setSidebarOpen(false);

      // Force hard redirect
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);

      deleteCookie("user_type");
      deleteCookie("user_id");
      deleteCookie("user_name");
      localStorage.clear();
      sessionStorage.clear();

      window.location.href = "/login";
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
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
            <h1 className="text-2xl font-bold text-green-700">FARMER</h1>
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
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {userName || "Farmer"}
              </p>
              <p className="text-xs text-gray-500">{pcicId || "PCIC-XXX"}</p>
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
