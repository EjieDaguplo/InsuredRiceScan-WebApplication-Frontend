"use client";

import { Menu, Mail, Search } from "lucide-react";
import { useState } from "react";

export default function TopNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="shadow-sm sticky top-0 z-30 p-1">
      <div className="px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden text-gray-600"
        >
          <Menu size={24} />
        </button>

        <div className="relative max-w-md w-full hidden md:block">
          {/* <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search farmers, claims..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-green-500"
          /> */}
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
