"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, User as UserIcon, Settings, Home, ChevronRight } from "lucide-react";
import { GlobalSearch } from "@/components/dashboard/global-search";
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
  const [profileAvatarUrl, setProfileAvatarUrl] = useState("");
  const [profileName, setProfileName] = useState("");

  const fetchProfile = async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("full_name, first_name, last_name, avatar_url")
      .eq("id", userId)
      .single();
    const derivedName =
      data?.full_name ||
      [data?.first_name, data?.last_name].filter(Boolean).join(" ") ||
      "";
    setProfileName(derivedName);
    setProfileAvatarUrl(data?.avatar_url || "");
  };

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) fetchProfile(user.id);
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) fetchProfile(session.user.id);
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

  const metaName = [user?.user_metadata?.first_name, user?.user_metadata?.last_name].filter(Boolean).join(" ");
  const name = profileName || user?.user_metadata?.full_name || metaName || "Guest User";
  const initials = name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() || "US";
  const email = user?.email || "";
  const avatarUrl = profileAvatarUrl || user?.user_metadata?.avatar_url || "";

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5">
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
              <BreadcrumbPage className="text-[#00F38D] font-medium">{breadcrumbName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4">
        <GlobalSearch />
        
        <button className="p-2 text-muted-foreground hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00F38D] rounded-full"></span>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="w-8 h-8 rounded-full overflow-hidden border border-white/20 hover:border-[#00F38D] transition-colors outline-none focus:ring-2 focus:ring-[#00F38D]/50 flex items-center justify-center bg-[#111]">
            <Avatar className="w-full h-full">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={name} referrerPolicy="no-referrer" />}
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
            <DropdownMenuItem 
              onClick={() => router.push("/dashboard/profile")}
              className="cursor-pointer focus:bg-white/5 focus:text-white transition-colors gap-2"
            >
              <UserIcon className="w-4 h-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
             onClick={() => router.push("/dashboard/preferences")} 
             className="cursor-pointer focus:bg-white/5 focus:text-white transition-colors gap-2">
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
