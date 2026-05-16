import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function DELETE(req: NextRequest) {
  try {
    let body: { sessionId?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { sessionId } = body;
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = authData.user;

    // Confirm ownership and get storage path
    const { data: session, error: fetchErr } = await supabase
      .from("session_feedback")
      .select("id, recording_url")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchErr) {
      console.error("Fetch session error:", fetchErr);
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Delete recording from storage (non-fatal if it fails)
    if (session.recording_url) {
      try {
        const { error: storageErr } = await supabase.storage
          .from("recordings")
          .remove([session.recording_url]);
        if (storageErr) console.error("Storage delete error:", storageErr.message);
      } catch (e) {
        console.error("Storage delete threw:", e);
      }
    }

    // Delete DB row
    const { error: deleteErr } = await supabase
      .from("session_feedback")
      .delete()
      .eq("id", sessionId)
      .eq("user_id", user.id);

    if (deleteErr) {
      console.error("DB delete error:", deleteErr);
      return NextResponse.json({ error: deleteErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Session delete unhandled error:", err);
    return NextResponse.json({ error: err?.message ?? "Delete failed" }, { status: 500 });
  }
}