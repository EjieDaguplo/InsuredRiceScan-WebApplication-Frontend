"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import FarmerSidebar from "./farmers/farmerSideBar";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const [userType, setUserType] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Fix hydration mismatch - only access localStorage after mount
  useEffect(() => {
    setIsClient(true);
    const type = localStorage.getItem("user_type");
    setUserType(type);
  }, []); // Only run once on mount, not on pathname change

  // Pages where we should hide sidebar and topnav (auth pages)
  const hideNavigation =
    pathname === "/welcome" ||
    pathname === "/login" ||
    pathname === "/" ||
    pathname === "/welcome/" ||
    pathname === "/login/";

  // If on welcome/login page, render only children
  if (hideNavigation) {
    return <div className="min-h-screen">{children}</div>;
  }

  // Show loading state until client-side hydration completes
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Determine layout based on BOTH pathname AND userType
  // Priority: Check pathname first, then fallback to userType
  const isFarmerPath =
    pathname === "/farmer-dashboard" || pathname?.startsWith("/farmer/");
  const isAdminPath =
    pathname === "/admin-dashboard" ||
    pathname?.startsWith("/admin/farmers") ||
    pathname?.startsWith("/admin/add-farmer") ||
    pathname?.startsWith("/admin/claims") ||
    pathname?.startsWith("/admin/visits") ||
    pathname?.startsWith("/admin/check");

  // Decide which layout to show
  let showFarmerLayout = false;

  if (isFarmerPath) {
    // If on farmer path, show farmer layout
    showFarmerLayout = true;
  } else if (isAdminPath) {
    // If on admin path, show admin layout
    showFarmerLayout = false;
  } else {
    // Fallback to userType for unknown paths
    showFarmerLayout = userType === "farmer";
  }

  // Farmer Layout
  if (showFarmerLayout) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <FarmerSidebar />
        <div className="flex-1 lg:ml-64">
          <TopNav />
          <main className="p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    );
  }

  // Admin/Super Admin Layout (default)
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <TopNav />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
