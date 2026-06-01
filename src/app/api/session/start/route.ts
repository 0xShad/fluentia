import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!rateLimit(`session:${user.id}`, 3, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many sessions. Please wait a few minutes before starting another." },
      { status: 429 }
    );
  }

  return NextResponse.json({ allowed: true });
}
