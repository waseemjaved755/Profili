import { requireUser } from "@/lib/auth/require-user";
import { NextResponse } from "next/server";

type Artifact = { type?: string; url?: string; content_type?: string };

export async function GET(request: Request) {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Voice is not configured yet." }, { status: 503 });
  }

  const auth = await requireUser();
  if (auth.error) return auth.error;

  const callId = new URL(request.url).searchParams.get("callId");
  if (!callId) {
    return NextResponse.json({ error: "Missing call." }, { status: 400 });
  }

  const { data: profile } = await auth.supabase
    .from("profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ error: "Call not found." }, { status: 404 });
  }

  const { data: call } = await auth.supabase
    .from("calls")
    .select("id, assembly_session_id")
    .eq("id", callId)
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (!call?.assembly_session_id) {
    return NextResponse.json({ error: "No recording for this call yet." }, { status: 404 });
  }

  const sessionResponse = await fetch(
    `https://agents.assemblyai.com/v1/sessions/${call.assembly_session_id}`,
                { headers: { Authorization: `Bearer ${apiKey}` } },
  );

  if (!sessionResponse.ok) {
    return NextResponse.json({ error: "Recording is not ready yet." }, { status: 404 });
  }

  const session = (await sessionResponse.json()) as { artifacts?: Artifact[] };
  const audio = session.artifacts?.find((item) => item.type === "audio" && item.url);

  if (!audio?.url) {
    return NextResponse.json({ error: "Recording is still processing." }, { status: 404 });
  }

  return NextResponse.json({ url: audio.url, contentType: audio.content_type || "audio/ogg" });
}
