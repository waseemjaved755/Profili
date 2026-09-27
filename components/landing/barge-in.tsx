"use client";

import { VoiceOrb } from "@/components/ui/voice-orb";
import { useResumePick } from "@/components/landing/resume-pick";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const AGENT_LINE =
  "I led the zero-downtime Postgres cutover for a twelve-node cluster, dual-write for two weeks, then—";
const CUT_LINE = "I led the zero-downtime Postgres cutover for a twelve-node cluster—";

export function BargeIn() {
  const person = useResumePick();
  const reduce = useReducedMotion();
  const [cut, setCut] = useState(false);

  useEffect(() => {
    setCut(false);
  }, [person.id]);

  useEffect(() => {
    if (reduce || cut) return;
    const id = window.setTimeout(() => setCut(true), 4200);
    return () => window.clearTimeout(id);
  }, [cut, reduce, person.id]);

  return (
    <section id="barge-in" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="label">Barge-in</p>
        <h2 className="mt-3 max-w-3xl text-[36px] font-semibold tracking-tight text-ink sm:text-[48px]">
          Watch what happens when I cut it off.
        </h2>
        <p className="mt-4 max-w-2xl text-[16px] text-muted">
          Most voice bots keep talking over you. AssemblyAI stops mid-sentence when you
          interrupt, then listens. Talk over {person.firstName} on a live page. This is the same
          <span className="font-mono text-[13px] text-ink"> reply.done</span> status: interrupted.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <div className="flex flex-col items-center rounded-2xl border border-border bg-surface p-8">
            <VoiceOrb
              size={180}
              state={cut ? "listening" : "speaking"}
              name={person.firstName}
            />
            <p className="mt-4 text-[15px] font-medium tracking-tight">{person.firstName}&apos;s AI</p>
            {cut ? (
              <p className="mt-2 rounded-full border border-border bg-subtle px-3 py-1 font-mono text-[12px] text-navy">
                Interrupted · reply.done
              </p>
            ) : (
              <p className="mt-2 text-[13px] text-muted">Speaking</p>
            )}
            <button
              type="button"
              onClick={() => setCut((value) => !value)}
              className="mt-6 min-h-11 rounded-lg bg-btn px-5 text-sm font-medium text-btn-fg hover:bg-btn-hover"
            >
              {cut ? "Let them finish" : "Cut them off"}
            </button>
          </div>

          <div className="space-y-3">
            <motion.div
              layout
              className="rounded-2xl border border-border bg-deep p-4 text-white"
            >
              <p className="font-mono text-[11px] font-medium text-[#89C2D9]">{person.firstName}</p>
              <p className="mt-1 text-[15px]">{cut ? CUT_LINE : AGENT_LINE}</p>
            </motion.div>
            {cut ? (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border bg-surface p-4"
              >
                <p className="font-mono text-[11px] font-medium text-steel">You</p>
                <p className="mt-1 text-[15px] text-ink">Wait — what happened in week two?</p>
              </motion.div>
            ) : null}
            <p className="text-[13px] text-muted">
              Naive agents ignore overlap. Here the audio buffer is flushed the instant you
              start talking, so you never hear leftover speech.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
