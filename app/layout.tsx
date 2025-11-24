import "./globals.css";
import type { Metadata } from "next";
import TopNav from "./components/TopNav";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Rice Insurance Admin Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <TopNav />
          <main className="p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
