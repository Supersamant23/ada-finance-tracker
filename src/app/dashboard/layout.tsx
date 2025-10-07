// src/app/dashboard/layout.tsx
import { createClient } from "@/lib/supabase/server";
import DashboardContent from "@/components/DashboardContent";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <DashboardContent userEmail={user?.email}>{children}</DashboardContent>
  );
}
