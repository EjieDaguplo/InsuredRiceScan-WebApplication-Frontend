import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import { SidebarProvider } from "./components/context/SidebarContext";
import LayoutWrapper from "./components/layoutWrapper";

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
          <LayoutWrapper>{children}</LayoutWrapper>
        </SidebarProvider>
      </body>
    </html>
  );
}
