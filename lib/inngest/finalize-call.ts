import { getDb } from "@/lib/db/client";
import { calls, transcriptTurns } from "@/lib/db/schema";
import { EVENT_CALL_ENDED, inngest } from "@/lib/inngest/client";
import { failedEventData } from "@/lib/inngest/emit";
import { fetchSessionTimeline } from "@/lib/voice/assembly-session";
import { generateCallInsights } from "@/lib/voice/insights";
import { and, eq, isNull, lt } from "drizzle-orm";
import { NonRetriableError } from "inngest";

async function failInsights(callId: string, error: unknown) {
  const db = getDb();
  await db.update(calls).set({ insightStatus: "failed" }).where(eq(calls.id, callId));
  console.error(JSON.stringify({ msg: "call.insights_failed", callId, error: String(error) }));
}

export const finalizeCallJob = inngest.createFunction(
  {
    id: "finalize-call",
    triggers: [{ event: EVENT_CALL_ENDED }],
    retries: 5,
    concurrency: 2,
    onFailure: async ({ event, error }) => {
      const { callId } = failedEventData<{ callId: string }>(event);
      if (callId) await failInsights(callId, error);
    },
  },
  async ({ event, step }) => {
    const { callId } = event.data as { callId: string };

    const started = await step.run("claim-call", async () => {
      const db = getDb();
      const [call] = await db
        .select({
          id: calls.id,
          insightStatus: calls.insightStatus,
          insightAttempts: calls.insightAttempts,
        })
        .from(calls)
        .where(eq(calls.id, callId))
        .limit(1);
      if (!call) throw new NonRetriableError("Call is gone.");
      if (call.insightStatus === "ready") return { skip: true as const };
      await db
        .update(calls)
        .set({
          insightStatus: "processing",
          insightAttempts: (call.insightAttempts ?? 0) + 1,
        })
        .where(eq(calls.id, callId));
      return { skip: false as const };
    });

    if (started.skip) return;

    let sessionId: string | null = null;
    for (let i = 0; i < 8; i += 1) {
      sessionId = await step.run(`read-session-id-${i}`, async () => {
        const db = getDb();
        const [call] = await db
          .select({ assemblySessionId: calls.assemblySessionId })
          .from(calls)
          .where(eq(calls.id, callId))
          .limit(1);
        return call?.assemblySessionId ?? null;
      });
      if (sessionId) break;
      await step.sleep(`wait-session-${i}`, "2s");
    }

    if (sessionId) {
      await step.run("upsert-assembly-timeline", async () => {
        const apiKey = process.env.ASSEMBLYAI_API_KEY;
        if (!apiKey) return;
        let lastError = "Timeline not ready.";
        for (let i = 0; i < 6; i += 1) {
          try {
            const result = await fetchSessionTimeline(sessionId, apiKey);
            if (!result.ready) {
              lastError = `Session ${result.status || "pending"}`;
              await new Promise((resolve) => setTimeout(resolve, 2000));
              continue;
            }
            if (result.turns.length === 0) return;
            const db = getDb();
            for (let seq = 0; seq < result.turns.length; seq += 1) {
              const turn = result.turns[seq]!;
              await db
                .insert(transcriptTurns)
                .values({
                  callId,
                  seq,
                  speaker: turn.speaker,
                  text: turn.text,
                })
                .onConflictDoUpdate({
                  target: [transcriptTurns.callId, transcriptTurns.seq],
                  set: { speaker: turn.speaker, text: turn.text },
                });
            }
            return;
          } catch (error) {
            lastError = error instanceof Error ? error.message : "Timeline fetch failed.";
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
        console.error(JSON.stringify({ msg: "call.timeline_unavailable", callId, lastError }));
      });
    }

    await step.run("gemini-insights", async () => {
      await generateCallInsights(callId);
    });
  },
);

export const sweepStaleCallsJob = inngest.createFunction(
  {
    id: "sweep-stale-calls",
    triggers: [{ cron: "* * * * *" }],
  },
  async ({ step }) => {
    const stale = await step.run("find-stale-calls", async () => {
      const db = getDb();
      const cutoff = new Date(Date.now() - 90_000);
      return db
        .select({ id: calls.id, startedAt: calls.startedAt })
        .from(calls)
        .where(and(isNull(calls.endedAt), lt(calls.startedAt, cutoff)))
        .limit(25);
    });

    for (const call of stale) {
      await step.run(`close-${call.id}`, async () => {
        const db = getDb();
        const startedAt = new Date(call.startedAt);
        const endedAt = new Date(startedAt.getTime() + 30_000);
        const updated = await db
          .update(calls)
          .set({
            endedAt,
            durationSeconds: 30,
            insightStatus: "pending",
          })
          .where(and(eq(calls.id, call.id), isNull(calls.endedAt)))
          .returning({ id: calls.id });
        if (updated[0]) {
          await inngest.send({ name: EVENT_CALL_ENDED, data: { callId: call.id } });
        }
      });
    }
  },
);
