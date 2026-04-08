import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-[#000000] overflow-hidden selection:bg-[#00F38D]/30 selection:text-white text-white">
        <AppSidebar />
        <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A] overflow-y-auto">
          <DashboardNav />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
