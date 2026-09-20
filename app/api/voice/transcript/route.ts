import { getDb } from "@/lib/db/client";
import { calls, transcriptTurns } from "@/lib/db/schema";
import { voiceTranscriptBodySchema } from "@/lib/resume/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Voice is not configured yet." }, { status: 503 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = voiceTranscriptBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid transcript." }, { status: 400 });
  }

  const db = getDb();
  const [call] = await db
    .select({ id: calls.id })
    .from(calls)
    .where(and(eq(calls.id, parsed.data.callId), eq(calls.transcriptToken, parsed.data.transcriptToken)))
    .limit(1);

  if (!call) {
    return NextResponse.json({ error: "Call not found." }, { status: 404 });
  }

  await db
    .insert(transcriptTurns)
    .values({
      callId: call.id,
      seq: parsed.data.seq,
      speaker: parsed.data.speaker,
      text: parsed.data.text,
    })
    .onConflictDoUpdate({
      target: [transcriptTurns.callId, transcriptTurns.seq],
      set: {
        speaker: parsed.data.speaker,
        text: parsed.data.text,
      },
    });

  return NextResponse.json({ ok: true });
}
