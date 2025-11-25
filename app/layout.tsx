import "./globals.css";
import type { Metadata } from "next";
import TopNav from "./components/TopNav";
import Sidebar from "./components/Sidebar";
import React from "react";
import { SidebarProvider } from "./components/context/SidebarContext";

export const metadata: Metadata = {
  icons: "/insured_rice_logo.jpg",
  title: "Rice Insurance Admin Portal",
  description: "Rice Insurance Admin Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <div className="min-h-screen bg-gray-50 flex">
            <Sidebar />
            <div className="flex-1 lg:ml-64">
              <TopNav />
              <main className="p-4 md:p-6 lg:p-8">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
