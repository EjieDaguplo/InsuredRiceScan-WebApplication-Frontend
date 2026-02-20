"use client";

import { Menu, Mail, Search } from "lucide-react";
import { useSidebar } from "./context/SidebarContext";

export default function TopNav() {
  const { setSidebarOpen } = useSidebar();

  return (
    <nav className="shadow-sm bg-white sticky top-0 z-30 p-1">
      <div className="px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-600"
        >
          <Menu size={24} />
        </button>
        <div className="relative max-w-md w-full text-center md:hidden">
          <p className="text-green-700 font-bold text-2xl">RICE INSURED SCAN</p>
        </div>
        <div className="relative max-w-md w-full hidden md:block">
          <p className="text-green-700 font-bold text-4xl">RICE INSURED SCAN</p>
        </div>

        <button className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
          <Mail size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </nav>
  );
}
