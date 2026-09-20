import { requireUser } from "@/lib/auth/require-user";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await requireUser();
  if (auth.error) return auth.error;

  const { data: profile } = await auth.supabase
    .from("profiles")
    .select("id")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ calls: [] });
  }

  const { data, error } = await auth.supabase
    .from("calls")
    .select(
      "id, visitor_name, visitor_purpose, visitor_email, started_at, ended_at, duration_seconds, insight_status, insight_intent, insight_query, insight_summary, insight_citation, insight_grounded, insight_tone, insight_fit, insight_tone_label, insight_fit_label, assembly_session_id, transcript_turns ( seq, speaker, text, created_at )",
    )
    .eq("profile_id", profile.id)
    .not("ended_at", "is", null)
    .order("started_at", { ascending: false })
    .limit(40);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const calls = (data ?? []).map((row) => {
    const turns = [...((row.transcript_turns as Array<{ seq: number }> | null) ?? [])].sort(
      (a, b) => a.seq - b.seq,
    );
    return { ...row, transcript_turns: turns };
  });

  return NextResponse.json({ calls });
}
