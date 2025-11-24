"use client";

import { useState } from "react";
import {
  Users,
  FileText,
  Calendar,
  CheckCircle,
  UserPlus,
  Home,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/farmers", label: "Farmers", icon: Users },
    { href: "/add-farmer", label: "Add Farmer", icon: UserPlus },
    { href: "/claims", label: "Claims", icon: FileText },
    { href: "/visits", label: "Visits", icon: Calendar },
    { href: "/check", label: "Check", icon: CheckCircle },
  ];

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white shadow-lg transform transition-transform
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h1 className="text-2xl font-bold text-green-700">ADMIN</h1>
            <p className="text-xs text-gray-500">Municipality of Clarin</p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition 
                    ${
                      active
                        ? "bg-green-700 text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
