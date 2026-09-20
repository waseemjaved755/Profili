"use client";

import { Hero, ResumeCard } from "@/components/landing/hero";
import { useResumePick } from "@/components/landing/resume-pick";
import { SineEqualizer } from "@/components/landing/sine-eq";
import { VoiceOrb } from "@/components/ui/voice-orb";
import type { ResumeProfile } from "@/lib/visuals";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, type RefObject } from "react";

export function HeroStory() {
  const convertRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const flying = useResumePick();
  const { scrollYProgress } = useScroll({
    target: convertRef,
    offset: ["start 0.55", "end 0.45"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  const frontOpacity = useTransform(progress, [0, 0.12], [1, 0]);
  const shown = useMotionValue(1);

  return (
    <div>
      <Hero flying={flying} frontOpacity={reduce ? shown : frontOpacity} />
      <ConvertStage
        flying={flying}
        progress={reduce ? shown : progress}
        reduce={!!reduce}
        stageRef={convertRef}
      />
    </div>
  );
}

function ConvertStage({
  flying,
  progress,
  reduce,
  stageRef,
}: {
  flying: ResumeProfile;
  progress: MotionValue<number>;
  reduce: boolean;
  stageRef: RefObject<HTMLElement | null>;
}) {
  const x = useTransform(progress, [0, 0.42], [reduce ? 0 : 280, 0]);
  const y = useTransform(progress, [0, 0.42], [reduce ? 0 : -180, 0]);
  const rotate = useTransform(progress, [0, 0.42], [reduce ? 0 : 12, 0]);
  const resumeOpacity = useTransform(progress, [0.14, 0.28, 0.48, 0.62], [0, 1, 1, 0]);
  const resumeScale = useTransform(progress, [0.12, 0.42, 0.62], [1, 1.06, 0.72]);
  const orbOpacity = useTransform(progress, [0.48, 0.66], [reduce ? 1 : 0, 1]);
  const orbScale = useTransform(progress, [0.48, 0.66], [reduce ? 1 : 0.78, 1]);
  const copyOpacity = useTransform(progress, [0.58, 0.78], [reduce ? 1 : 0, 1]);
  const copyY = useTransform(progress, [0.58, 0.78], [reduce ? 0 : 28, 0]);

  return (
    <section ref={stageRef} className="relative h-[220vh]">
      <div className="sticky top-14 flex min-h-[calc(100svh-3.5rem)] items-center overflow-hidden px-4 py-10 sm:top-16 sm:min-h-[calc(100svh-4rem)] sm:px-6">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div className="relative mx-auto flex h-[420px] w-full max-w-[420px] items-center justify-center sm:h-[480px]">
            <motion.div
              className="absolute z-20 w-[210px] sm:w-[230px]"
              style={{
                x,
                y,
                rotate,
                scale: resumeScale,
                opacity: reduce ? 0 : resumeOpacity,
              }}
            >
              <ResumeCard item={flying} className="brutal-lg" />
            </motion.div>

            <motion.div
              className="relative w-full px-2 py-6"
              style={{ opacity: orbOpacity, scale: orbScale }}
            >
              <span className="absolute right-2 top-2 z-10 inline-flex items-center gap-1.5 rounded-full border border-border bg-subtle px-2.5 py-1 font-mono text-[11px] text-navy">
                <span className="ping-live h-1.5 w-1.5 rounded-full bg-good" />
                {flying.firstName}
              </span>
              <div className="flex justify-center pt-6">
                <VoiceOrb size={240} state="speaking" name={flying.firstName} />
              </div>
              <SineEqualizer active className="mt-2" />
              <p className="mt-3 text-center text-[18px] font-semibold tracking-tight text-ink">
                {flying.name}
              </p>
              <p className="text-center text-[12px] font-bold text-muted">{flying.role}</p>
            </motion.div>
          </div>

          <motion.div style={{ opacity: copyOpacity, y: copyY }}>
            <p className="label">Now speaking</p>
            <h2 className="mt-3 text-[36px] font-semibold tracking-tight text-ink sm:text-[52px]">{flying.name}</h2>
            <p className="mt-4 max-w-xl text-[16px] text-muted">
              The résumé becomes a voice you can hear, grounded in the page,
              ready when a recruiter asks.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-border bg-subtle font-mono text-[12px] font-medium text-steel">
                  R
                </span>
                <div>
                  <p className="font-mono text-[11px] font-medium text-steel">Recruiter</p>
                  <p className="mt-1 text-[15px] text-ink">{flying.question}</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-border bg-deep p-4 text-white">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[#89C2D9] text-[13px] font-semibold text-deep">
                  {flying.initials}
                </span>
                <div>
                  <p className="font-mono text-[11px] font-medium text-[#89C2D9]">{flying.firstName}</p>
                  <p className="mt-1 text-[15px]">{flying.answer}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
