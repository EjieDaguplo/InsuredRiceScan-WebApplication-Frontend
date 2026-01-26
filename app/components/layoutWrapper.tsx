"use client";

import { usePathname } from "next/navigation";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";
import { ReactNode } from "react";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Pages where we should hide sidebar and topnav
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

  // Otherwise, render with sidebar and topnav
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
