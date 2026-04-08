"use client";

import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserName(user?.user_metadata?.first_name || user?.email || "User");
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/authentication/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] text-white p-8">
      <h1 className="text-3xl font-bold mb-4 text-[#00F38D]">Welcome back, {userName}!</h1>
      <p className="text-white/60 mb-8 text-center max-w-md">
        This is your secure dashboard. Since you're logged in, you automatically got redirected here away from the public landing and login pages!
      </p>
      
      <Button variant="outline" onClick={handleSignOut} className="border-white/10 text-white hover:text-white hover:bg-white/[0.02]">
        Sign out
      </Button>
    </div>
  );
}
