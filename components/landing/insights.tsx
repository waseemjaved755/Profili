"use client";

import { VoiceWaveform } from "@/components/ui/voice-waveform";
import { VISITORS, type Visitor } from "@/lib/visitors";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Check, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

function ScoreCard({
  label,
  value,
  note,
}: {
  label: string;
  value: number;
  note: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-[#01497C]/10 bg-[#FAFAFA] px-2.5 py-2 text-left dark:border-[#89C2D9]/25 dark:bg-[#012A4A]/30">
      <p className="font-mono text-[9px] leading-tight font-medium tracking-wider text-[#468FAF] uppercase">
        {label}
      </p>
      <p className="mt-1 text-[20px] font-semibold leading-none tracking-tight text-ink sm:text-[22px]">
        {value}%
      </p>
      <p className="mt-1 truncate text-[11px] text-ink/80">{note}</p>
    </div>
  );
}

function SpokenAnswer({
  text,
  cursor,
  playing,
}: {
  text: string;
  cursor: number;
  playing: boolean;
}) {
  const parts = useMemo(() => text.split(/(\s+)/), [text]);
  let word = 0;

  return (
    <p className="mt-2 min-h-0 overflow-y-auto text-[13px] leading-snug text-ink/90">
      {parts.map((part, i) => {
        if (!part.trim()) return <span key={i}>{part}</span>;
        const idx = word++;
        const spoken = !playing || idx <= cursor;
        return (
          <span
            key={i}
            className={
              playing
                ? spoken
                  ? "text-ink"
                  : "text-ink/30"
                : undefined
            }
          >
            {part}
          </span>
        );
      })}
    </p>
  );
}

function Inspector({
  active,
  playing,
  cursor,
  onToggle,
  reduce,
}: {
  active: Visitor;
  playing: boolean;
  cursor: number;
  onToggle: () => void;
  reduce: boolean;
}) {
  return (
    <motion.div
      key={active.id}
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <img
            src={active.src}
            alt=""
            className="h-9 w-9 rounded-full border border-border object-cover sm:h-10 sm:w-10"
          />
          <div className="min-w-0">
            <h3 className="flex items-center gap-1.5 truncate text-[15px] font-semibold text-ink sm:text-base">
              {active.title}
              <span className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-[#2A6F97] text-white">
                <Check size={8} strokeWidth={3} />
              </span>
            </h3>
            <p className="font-mono text-[10px] font-medium text-[#2A6F97] dark:text-ice">
              {active.intent}
            </p>
          </div>
        </div>
        <span className="rounded-full border border-[#01497C]/12 bg-[#F0F4F8] px-2 py-0.5 font-mono text-[10px] font-medium text-[#01497C] dark:border-[#89C2D9]/30 dark:bg-[#012A4A]/40 dark:text-ice">
          {active.minutes} min call
        </span>
      </div>

      <div className="mt-3 shrink-0 rounded-xl border border-[#01497C]/10 bg-[#F8FAFC] px-3 py-2.5 dark:border-[#89C2D9]/25 dark:bg-[#012A4A]/35">
        <p className="font-mono text-[9px] tracking-wider text-[#468FAF] uppercase">
          Exact query
        </p>
        <p className="mt-1 text-[13px] leading-snug font-medium text-ink sm:text-[14px]">
          “{active.query}”
        </p>
      </div>

      <div className="mt-3 flex min-h-0 flex-1 flex-col rounded-xl border border-[#01497C]/12 bg-white px-3 py-2.5 shadow-sm dark:border-[#89C2D9]/30 dark:bg-[#012A4A]/25">
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#012A4A] px-3 py-1.5 text-[11px] font-medium text-white transition-colors hover:bg-[#013A63] dark:bg-ice dark:text-[#071018] dark:hover:bg-[#c5e4f0]"
          >
            {playing ? <Pause size={12} /> : <Play size={12} />}
            {playing ? "Stop Preview" : "Preview Voice"}
          </button>
          <VoiceWaveform
            compact
            state={playing ? "speaking" : "idle"}
            className="w-[110px] justify-start sm:w-[150px]"
          />
        </div>
        <SpokenAnswer text={active.answer} cursor={cursor} playing={playing} />
        <button
          type="button"
          className="mt-2 inline-flex w-fit shrink-0 rounded-md border border-[#61A5C2]/30 bg-[#61A5C2]/10 px-2 py-0.5 font-mono text-[10px] text-[#01497C] transition-colors hover:border-[#2A6F97]/40 dark:text-ice"
        >
          [{active.citation}]
        </button>
      </div>

      <div className="mt-3 grid shrink-0 grid-cols-3 gap-2">
        <ScoreCard
          label="Factual Groundedness"
          value={active.grounded}
          note="Grounded in CV"
        />
        <ScoreCard
          label="Delivery & Tone"
          value={active.tone}
          note={active.toneLabel}
        />
        <ScoreCard
          label="Recruiter Fit Score"
          value={active.clarity}
          note={active.fitLabel}
        />
      </div>
    </motion.div>
  );
}

export function Insights() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Visitor>(VISITORS[0]);
  const [playing, setPlaying] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [pane, setPane] = useState<"feed" | "inspect">("feed");

  useEffect(() => {
    if (!playing) {
      setCursor(0);
      return;
    }

    const words = active.answer.trim().split(/\s+/).filter(Boolean);
    if (reduce || words.length === 0) {
      const hold = window.setTimeout(() => setPlaying(false), 1600);
      return () => window.clearTimeout(hold);
    }

    setCursor(0);
    let i = 0;
    const tick = window.setInterval(() => {
      i += 1;
      if (i >= words.length) {
        setCursor(words.length);
        setPlaying(false);
        window.clearInterval(tick);
        return;
      }
      setCursor(i);
    }, 210);

    return () => window.clearInterval(tick);
  }, [playing, active.id, active.answer, reduce]);

  function select(person: Visitor) {
    setPlaying(false);
    setCursor(0);
    setActive(person);
    setPane("inspect");
  }

  const intents = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const person of VISITORS) {
      counts[person.intent] = (counts[person.intent] || 0) + 1;
    }
    const total = VISITORS.length;
    const palette = ["#01497C", "#2A6F97", "#61A5C2", "#89C2D9"];
    return Object.entries(counts).map(([label, n], i) => ({
      label,
      pct: Math.round((n / total) * 100),
      color: palette[i % palette.length],
    }));
  }, []);

  return (
    <section
      id="insights"
      className="flex flex-col px-4 py-10 sm:px-6 md:py-12 lg:h-[calc(100svh-4.5rem)] lg:scroll-mt-[4.5rem] lg:py-5 xl:py-6"
    >
      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col">
        <div className="shrink-0">
          <p className="label">Quantitative insights</p>
          <h2 className="mt-1.5 max-w-3xl text-[28px] font-semibold tracking-tight text-ink sm:text-[34px] lg:text-[36px]">
            Who talked. What they asked. How it scored.
          </h2>
        </div>

        <div className="console-beam mt-5 flex min-h-0 flex-1 flex-col md:min-h-[420px] lg:mt-4 lg:min-h-0">
          <div className="console-beam-face flex min-h-0 flex-1 flex-col">
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#01497C]/12 px-3 py-2 sm:px-4 dark:border-[#89C2D9]/30">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-1.5" aria-hidden>
                  <span className="h-2 w-2 rounded-full bg-red-400/80" />
                  <span className="h-2 w-2 rounded-full bg-amber-400/80" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                </span>
                <span className="font-mono text-[12px] font-medium text-ink">Insights</span>
              </div>
              <span className="font-mono text-[11px] text-[#2A6F97] dark:text-ice">
                {VISITORS.length} queries answered today
              </span>
            </div>

            <div className="flex shrink-0 gap-1 border-b border-[#01497C]/12 p-1.5 md:hidden dark:border-[#89C2D9]/30">
              {(
                [
                  ["feed", "Visitors"],
                  ["inspect", "Telemetry Detail"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPane(id)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-[12px] font-medium ${
                    pane === id ? "bg-[#F0F4F8] text-ink dark:bg-[#01497C]/20" : "text-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <LayoutGroup>
              <div className="grid min-h-0 flex-1 md:grid-cols-[34fr_66fr] lg:grid-cols-[36fr_64fr]">
                <div
                  className={`min-h-[360px] flex-col border-[#01497C]/12 md:min-h-0 md:border-r dark:border-[#89C2D9]/30 ${
                    pane === "feed" ? "flex" : "hidden"
                  } md:flex`}
                >
                  <div className="flex shrink-0 items-center justify-between px-3 pt-2.5 pb-1.5">
                    <p className="font-mono text-[10px] font-medium tracking-wide text-steel">
                      Recent Activity
                    </p>
                    <span className="rounded-full border border-[#01497C]/12 px-1.5 py-px font-mono text-[10px] text-[#2A6F97] dark:border-[#89C2D9]/30">
                      {VISITORS.length}
                    </span>
                  </div>
                  <ul className="min-h-0 flex-1 space-y-px overflow-y-auto px-1.5 pb-2">
                    {VISITORS.map((person) => {
                      const selected = person.id === active.id;
                      return (
                        <li key={person.id}>
                          <button
                            type="button"
                            aria-pressed={selected}
                            onClick={() => select(person)}
                            className="relative flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-transform duration-150 hover:-translate-y-px"
                          >
                            {selected && (
                              <>
                                <motion.span
                                  layoutId="activeSessionIndicator"
                                  className="absolute inset-0 rounded-lg border border-[#2A6F97]/25 bg-[#F4F8FA] dark:bg-[#01497C]/15"
                                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                                />
                                <span className="absolute top-1.5 bottom-1.5 left-0 z-10 w-0.5 rounded-full bg-[#2A6F97]" />
                              </>
                            )}
                            <img
                              src={person.src}
                              alt=""
                              className="relative z-10 h-8 w-8 shrink-0 rounded-full border border-border object-cover"
                            />
                            <span className="relative z-10 min-w-0 flex-1">
                              <span className="block truncate text-[13px] font-semibold text-ink">
                                {person.title}
                              </span>
                              <span className="mt-0.5 flex items-center gap-1.5">
                                <span className="rounded-full border border-[#01497C]/12 px-1.5 py-px font-mono text-[9px] text-steel dark:border-[#89C2D9]/30">
                                  {person.intent}
                                </span>
                                <span className="truncate font-mono text-[10px] text-[#61A5C2]">
                                  {person.ago}
                                </span>
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div
                  className={`min-h-[420px] flex-col p-3 sm:p-4 md:min-h-0 ${
                    pane === "inspect" ? "flex" : "hidden"
                  } md:flex`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <Inspector
                      key={active.id}
                      active={active}
                      playing={playing}
                      cursor={cursor}
                      reduce={!!reduce}
                      onToggle={() => setPlaying((v) => !v)}
                    />
                  </AnimatePresence>

                  <div className="mt-3 shrink-0 border-t border-[#01497C]/12 pt-2.5 dark:border-[#89C2D9]/30">
                    <p className="font-mono text-[9px] font-medium tracking-wider text-[#468FAF] uppercase">
                      Overall intent distribution
                    </p>
                    <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full">
                      {intents.map((row) => (
                        <span
                          key={row.label}
                          className="h-full"
                          style={{ width: `${row.pct}%`, background: row.color }}
                        />
                      ))}
                    </div>
                    <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                      {intents.map((row) => (
                        <li
                          key={row.label}
                          className="flex items-center gap-1.5 font-mono text-[10px] text-ink"
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: row.color }}
                          />
                          {row.label} {row.pct}%
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </LayoutGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
