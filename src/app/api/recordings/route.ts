import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function DELETE(_req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all sessions with a stored recording path
    const { data: sessions, error: fetchErr } = await supabase
      .from("session_feedback")
      .select("id, recording_url")
      .eq("user_id", user.id)
      .not("recording_url", "is", null);

    if (fetchErr) {
      return NextResponse.json({ error: "Failed to fetch recordings" }, { status: 500 });
    }

    const paths = (sessions ?? []).map((s) => s.recording_url as string).filter(Boolean);

    // Delete files from storage
    if (paths.length > 0) {
      const { error: storageErr } = await supabase.storage.from("recordings").remove(paths);
      if (storageErr) console.error("Storage bulk delete error:", storageErr.message);
    }

    // Clear recording_url references in DB
    await supabase
      .from("session_feedback")
      .update({ recording_url: null })
      .eq("user_id", user.id)
      .not("recording_url", "is", null);

    return NextResponse.json({ success: true, deleted: paths.length });
  } catch (err: any) {
    console.error("Delete all recordings error:", err);
    return NextResponse.json({ error: "Failed to delete recordings" }, { status: 500 });
  }
}
