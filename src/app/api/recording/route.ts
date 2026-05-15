import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: session, error: sessionErr } = await supabase
      .from("session_feedback")
      .select("id, vapi_call_id, recording_url")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (sessionErr || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Already in Supabase Storage — return a fresh signed URL
    if (session.recording_url) {
      const { data: signed } = await supabase.storage
        .from("recordings")
        .createSignedUrl(session.recording_url, 3600);
      return NextResponse.json({ status: "ready", signedUrl: signed?.signedUrl ?? null });
    }

    if (!session.vapi_call_id) {
      return NextResponse.json({ error: "No call ID for this session" }, { status: 400 });
    }

    const privateKey = process.env.VAPI_PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json({ error: "VAPI_PRIVATE_KEY not configured" }, { status: 500 });
    }

    // Fetch call details from Vapi
    const vapiRes = await fetch(`https://api.vapi.ai/call/${session.vapi_call_id}`, {
      headers: { Authorization: `Bearer ${privateKey}` },
    });

    if (!vapiRes.ok) {
      return NextResponse.json({ error: "Failed to fetch call from Vapi" }, { status: 502 });
    }

    const call = await vapiRes.json();
    const vapiAudioUrl: string | undefined =
      call?.artifact?.stereoRecordingUrl ?? call?.artifact?.recordingUrl;

    if (!vapiAudioUrl) {
      // Vapi hasn't finished processing yet
      return NextResponse.json({ status: "processing" });
    }

    // Download the audio from Vapi's CDN
    const audioRes = await fetch(vapiAudioUrl);
    if (!audioRes.ok) {
      return NextResponse.json({ error: "Failed to download recording from Vapi" }, { status: 502 });
    }

    const audioBuffer = await audioRes.arrayBuffer();
    const contentType = audioRes.headers.get("content-type") ?? "audio/mpeg";
    const ext = contentType.includes("wav") ? "wav" : "mp3";
    const storagePath = `${user.id}/${sessionId}.${ext}`;

    // Upload permanently to Supabase Storage
    const { error: uploadErr } = await supabase.storage
      .from("recordings")
      .upload(storagePath, audioBuffer, { contentType, upsert: true });

    if (uploadErr) {
      console.error("Storage upload error:", uploadErr);
      return NextResponse.json({ error: "Failed to upload recording" }, { status: 500 });
    }

    // Persist the storage path so future opens are instant
    await supabase
      .from("session_feedback")
      .update({ recording_url: storagePath })
      .eq("id", sessionId);

    // Return a signed URL for immediate playback
    const { data: signed } = await supabase.storage
      .from("recordings")
      .createSignedUrl(storagePath, 3600);

    return NextResponse.json({ status: "ready", signedUrl: signed?.signedUrl ?? null });
  } catch (err: any) {
    console.error("Recording API error:", err);
    return NextResponse.json({ error: err.message ?? "Recording failed" }, { status: 500 });
  }
}
