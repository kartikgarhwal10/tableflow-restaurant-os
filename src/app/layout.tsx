import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TableflowProvider } from "@/lib/store/tableflow-store";
import RoleSwitcher from "@/components/common/RoleSwitcher";
import React, { Suspense } from "react";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Copper Table | Restaurant & Management Platform",
  description:
    "Contemporary Indian dining in C-Scheme, Jaipur. Powered by TableFlow OS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-[#222222] font-sans antialiased text-sm">
        <TableflowProvider>
          <Suspense fallback={null}>
            <RoleSwitcher />
          </Suspense>
          <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading...</div>}>
            <div className="flex-1 flex flex-col">{children}</div>
          </Suspense>
        </TableflowProvider>
      </body>
    </html>
  );
}
