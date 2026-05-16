"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TrendingUp, Mic2, Clock, Settings, FileText, Hexagon, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/client";

const mainLinks = [
  { title: "Progress",  href: "/dashboard",          icon: TrendingUp },
  { title: "Practice",  href: "/dashboard/practice",  icon: Mic2 },
  { title: "Sessions",  href: "/dashboard/sessions",  icon: Clock },
];

const systemLinks = [
  { title: "Profile",            href: "/dashboard/profile",     icon: User },
  { title: "Preferences",        href: "/dashboard/preferences", icon: Settings },
  { title: "Terms & Conditions", href: "/dashboard/terms",       icon: FileText },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Sidebar variant="inset" collapsible="icon" className="bg-[#050505] border-r border-white/10 hidden md:flex" suppressHydrationWarning>
      <SidebarHeader className="p-4 pt-6">
        <Link href="/dashboard" className="flex items-center gap-2 mb-2 transition-transform hover:scale-105 px-2">
          <Hexagon className="w-6 h-6 text-[#00F38D]" />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-xl font-bold tracking-tight text-white leading-none">Fluentia</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">AI Communication</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-white/40 font-bold uppercase tracking-wider mb-2">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainLinks.map((item) => {
                const isActive = pathname === item.href || pathname === `${item.href}/`;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton render={<Link href={item.href} />} isActive={isActive} tooltip={item.title} className={cn(
                      "transition-all duration-200",
                      isActive ? "bg-white/[0.05] text-white" : "text-white/60 hover:text-white hover:bg-white/[0.02]"
                    )}>
                      <item.icon className={cn("w-4 h-4", isActive && "text-[#00F38D]")} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto pb-2">
          <SidebarGroupLabel className="text-xs text-white/40 font-bold uppercase tracking-wider mb-2">System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton render={<Link href={item.href} />} isActive={isActive} tooltip={item.title} className={cn(
                      "transition-all duration-200",
                      isActive ? "bg-white/[0.05] text-white" : "text-white/60 hover:text-white hover:bg-white/[0.02]"
                    )}>
                      <item.icon className={cn("w-4 h-4", isActive && "text-[#00F38D]")} />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Log out"
              className="text-red-500/70 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
