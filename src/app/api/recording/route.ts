import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SIGNED_URL_TTL = 900; // 15 minutes
const MAX_RECORDING_BYTES = 50 * 1024 * 1024; // 50 MB — ~60 min MP3 at 128 kbps

const AUDIO_MIME: Record<string, string> = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  webm: "audio/webm",
};

function detectAudio(buf: ArrayBuffer): { ext: string; mime: string } | null {
  const h = new Uint8Array(buf.slice(0, 12));

  // ID3-tagged MP3
  if (h[0] === 0x49 && h[1] === 0x44 && h[2] === 0x33) return { ext: "mp3", mime: AUDIO_MIME.mp3 };
  // Raw MP3 frame sync
  if (h[0] === 0xff && (h[1] & 0xe0) === 0xe0) return { ext: "mp3", mime: AUDIO_MIME.mp3 };
  // WAV — RIFF....WAVE
  if (h[0] === 0x52 && h[1] === 0x49 && h[2] === 0x46 && h[3] === 0x46 &&
      h[8] === 0x57 && h[9] === 0x41 && h[10] === 0x56 && h[11] === 0x45)
    return { ext: "wav", mime: AUDIO_MIME.wav };
  // OGG — OggS
  if (h[0] === 0x4f && h[1] === 0x67 && h[2] === 0x67 && h[3] === 0x53)
    return { ext: "ogg", mime: AUDIO_MIME.ogg };
  // WebM/MKV — EBML
  if (h[0] === 0x1a && h[1] === 0x45 && h[2] === 0xdf && h[3] === 0xa3)
    return { ext: "webm", mime: AUDIO_MIME.webm };

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await req.json();
    if (!sessionId || !UUID_RE.test(sessionId)) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
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

    // Already stored — issue a fresh short-lived signed URL
    if (session.recording_url) {
      const { data: signed } = await supabase.storage
        .from("recordings")
        .createSignedUrl(session.recording_url, SIGNED_URL_TTL);
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
      return NextResponse.json({ status: "processing" });
    }

    // Only fetch from Vapi-owned domains to prevent SSRF
    try {
      const audioHost = new URL(vapiAudioUrl).hostname;
      if (!audioHost.endsWith(".vapi.ai") && audioHost !== "vapi.ai") {
        console.error("Recording rejected: audio URL not on vapi.ai domain", audioHost);
        return NextResponse.json({ error: "Invalid recording source" }, { status: 422 });
      }
    } catch {
      return NextResponse.json({ error: "Invalid recording URL" }, { status: 422 });
    }

    // Download audio from Vapi CDN
    const audioRes = await fetch(vapiAudioUrl);
    if (!audioRes.ok) {
      return NextResponse.json({ error: "Failed to download recording from Vapi" }, { status: 502 });
    }

    const audioBuffer = await audioRes.arrayBuffer();

    // Size guard
    if (audioBuffer.byteLength > MAX_RECORDING_BYTES) {
      return NextResponse.json({ error: "Recording exceeds maximum allowed size" }, { status: 422 });
    }

    // Magic-byte validation — never trust the Content-Type header
    const detected = detectAudio(audioBuffer);
    if (!detected) {
      console.error("Recording rejected: unrecognised audio magic bytes");
      return NextResponse.json({ error: "Invalid audio format" }, { status: 422 });
    }

    const storagePath = `${user.id}/${sessionId}.${detected.ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("recordings")
      .upload(storagePath, audioBuffer, { contentType: detected.mime, upsert: true });

    if (uploadErr) {
      console.error("Storage upload error:", uploadErr);
      return NextResponse.json({ error: "Failed to upload recording" }, { status: 500 });
    }

    // Persist path for future requests
    await supabase
      .from("session_feedback")
      .update({ recording_url: storagePath })
      .eq("id", sessionId);

    // Return short-lived signed URL
    const { data: signed } = await supabase.storage
      .from("recordings")
      .createSignedUrl(storagePath, SIGNED_URL_TTL);

    return NextResponse.json({ status: "ready", signedUrl: signed?.signedUrl ?? null });
  } catch (err: any) {
    console.error("Recording API error:", err);
    return NextResponse.json({ error: "Failed to process recording. Please try again." }, { status: 500 });
  }
}
