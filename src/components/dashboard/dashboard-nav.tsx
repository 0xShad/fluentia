"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, LogOut, User as UserIcon, Settings, Home, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/client";
import type { User } from "@supabase/supabase-js";

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const pathSegments = pathname.split('/').filter(p => p);
  const breadcrumbName = pathSegments.length > 1 ? pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1) : "Overview";

  const name = user?.user_metadata?.full_name || "Guest User";
  const initials = name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() || "US";
  const email = user?.email || "demo@fluentia.ai";
  const avatarUrl = user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#0A0A0A] border-b border-white/[0.05]">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-white transition-colors" />
        
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="flex items-center gap-2 hover:text-[#00F38D] transition-colors">
                <Home className="w-4 h-4" />
                <span className="sr-only">Dashboard</span>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[#00F38D] font-medium">{breadcrumbName === "Scenarios" ? "Scenarios" : breadcrumbName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group hidden sm:flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground group-focus-within:text-[#00F38D] transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            className="w-56 h-9 bg-[#111] border border-white/10 rounded-md pl-9 pr-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00F38D]/50 focus:ring-1 focus:ring-[#00F38D]/50 transition-all"
          />
        </div>
        
        <button className="p-2 text-muted-foreground hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00F38D] rounded-full"></span>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger render={<button className="w-8 h-8 rounded-full overflow-hidden border border-white/20 hover:border-[#00F38D] transition-colors outline-none focus:ring-2 focus:ring-[#00F38D]/50 flex items-center justify-center bg-[#111]" />}>
            <Avatar className="w-full h-full">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="bg-[#111] text-xs">{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#111] border-white/10 text-white">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">{name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{email}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="cursor-pointer focus:bg-white/5 focus:text-white transition-colors gap-2">
              <UserIcon className="w-4 h-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer focus:bg-white/5 focus:text-white transition-colors gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="cursor-pointer focus:bg-red-500/10 text-red-500 focus:text-red-500 transition-colors gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
