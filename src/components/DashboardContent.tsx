"use client";

import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function DashboardContent({
  userEmail,
  children,
}: {
  userEmail?: string;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar userEmail={userEmail} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </ThemeProvider>
  );
}
