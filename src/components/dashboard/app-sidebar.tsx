"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TrendingUp, Mic2, Clock, Settings, FileText, User, LogOut } from "lucide-react";
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
        <Link href="/dashboard" className="flex items-center mb-2 px-2 hover:opacity-80 transition-opacity">
          <span className="text-xl font-bold tracking-tight text-white uppercase group-data-[collapsible=icon]:hidden">fluentia</span>
          <span className="text-xl font-bold tracking-tight text-white uppercase hidden group-data-[collapsible=icon]:block">F</span>
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
                      isActive ? "bg-white/5 text-white" : "text-white/60 hover:text-white hover:bg-white/2"
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
                      isActive ? "bg-white/5 text-white" : "text-white/60 hover:text-white hover:bg-white/2"
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
              className="text-red-500/70 hover:text-red-400 hover:bg-red-500/6 transition-all duration-200"
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
