"use client";

import { useSetResumePick } from "@/components/landing/resume-pick";
import { GoLiveButton } from "@/components/ui/go-live-button";
import { resumes, visuals, type ResumeProfile } from "@/lib/visuals";
import { FileUp } from "lucide-react";
import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import { useEffect, useState } from "react";

const faces = [
  visuals.candidate,
  visuals.recruiter,
  visuals.handshake,
  visuals.meeting,
  visuals.laptop,
];

const spring = { type: "spring", stiffness: 320, damping: 28, mass: 0.7 } as const;

const slots = [
  "left-[0%] top-[16%] sm:left-[4%]",
  "left-[26%] top-[4%] sm:left-[28%]",
  "left-[50%] top-[18%] sm:left-[54%]",
];

const poses = [
  {
    rest: { x: 0, y: 0, rotate: -12, rotateY: 8, scale: 1, zIndex: 1 },
    fan: { x: -56, y: -8, rotate: -10, rotateY: 22, scale: 1.04, zIndex: 4 },
  },
  {
    rest: { x: 0, y: 0, rotate: 2, rotateY: 0, scale: 1, zIndex: 2 },
    fan: { x: 0, y: -28, rotate: 0, rotateY: 0, scale: 1.07, zIndex: 5 },
  },
  {
    rest: { x: 0, y: 0, rotate: 12, rotateY: -8, scale: 1, zIndex: 3 },
    fan: { x: 56, y: -8, rotate: 10, rotateY: -22, scale: 1.04, zIndex: 4 },
  },
];

export function ResumeCard({
  item,
  className = "",
}: {
  item: ResumeProfile;
  className?: string;
}) {
  return (
    <figure className={`overflow-hidden rounded-xl bg-surface ${className}`}>
      <img
        src={item.src}
        alt={`${item.name} resume`}
        className="aspect-3/4 w-full object-cover object-top"
      />
      <figcaption className="border-t border-border bg-surface px-2.5 py-2">
        <p className="truncate text-[12px] font-semibold leading-tight tracking-tight text-ink">
          {item.name}
        </p>
        <p className="truncate font-mono text-[10px] text-steel">{item.role}</p>
      </figcaption>
    </figure>
  );
}

function ResumeStack({
  flying,
  frontOpacity,
}: {
  flying: ResumeProfile;
  frontOpacity?: MotionValue<number>;
}) {
  const setPick = useSetResumePick();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [fineHover, setFineHover] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFineHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const fanned = reduce ? true : open;

  return (
    <div className="relative lg:col-span-7">
      <motion.div
        className="relative mx-auto h-[400px] w-full max-w-[620px] sm:h-[500px]"
        style={{ perspective: 1200 }}
        initial={false}
        animate={fanned ? "fan" : "rest"}
        onHoverStart={() => {
          if (fineHover && !reduce) setOpen(true);
        }}
        onHoverEnd={() => {
          if (fineHover) setOpen(false);
        }}
        onFocusCapture={() => {
          if (!reduce) setOpen(true);
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setOpen(false);
          }
        }}
      >
        {resumes.map((item, index) => {
          const selected = item.src === flying.src;
          return (
            <motion.button
              key={item.src}
              type="button"
              aria-pressed={selected}
              aria-label={`Hear ${item.name}`}
              className={`absolute w-[46%] max-w-[230px] origin-bottom cursor-pointer border-0 bg-transparent p-0 text-left [transform-style:preserve-3d] ${slots[index]}`}
              variants={poses[index]}
              transition={spring}
              style={selected ? { opacity: frontOpacity } : undefined}
              onClick={() => {
                if (!fineHover && !open) {
                  setOpen(true);
                  return;
                }
                setPick(item);
                if (!fineHover) setOpen(false);
              }}
            >
              <ResumeCard
                item={item}
                className={`brutal-lg transition-[box-shadow] duration-200 ${
                  selected ? "ring-2 ring-[#61A5C2] ring-offset-2 ring-offset-background" : ""
                }`}
              />
            </motion.button>
          );
        })}
        <span className="pointer-events-none absolute bottom-3 left-2 z-10 inline-flex items-center gap-2 rounded-full border border-border bg-subtle px-2.5 py-1 font-mono text-xs text-navy sm:bottom-8 sm:left-4">
          <span className="ping-live h-1.5 w-1.5 rounded-full bg-good" />
          Still silent
        </span>
      </motion.div>
      <p className="mt-3 text-center font-mono text-[11px] text-steel">
        Hover to spread · click a résumé to hear {flying.firstName}
      </p>
    </div>
  );
}

export function Hero({
  frontOpacity,
  flying,
}: {
  frontOpacity?: MotionValue<number>;
  flying: ResumeProfile;
}) {
  const [dropped, setDropped] = useState(false);

  return (
    <section className="flex min-h-[calc(100svh-4.5rem)] items-center px-4 pb-20 pt-12 sm:px-6 sm:pt-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h1 className="display">
            Your resume can{" "}
            <span className="grad-ocean">talk.</span>
            <span className="mt-1 block">Days, not weeks.</span>
          </h1>
          <p className="mt-6 max-w-md text-[16px] text-muted">
            Your CV answers in its own voice. Recruiters hear the architecture,
            the stack, and the impact in seconds.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <label
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-medium text-ink shadow-sm transition-all duration-150 hover:-translate-y-px hover:border-steel/40"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setDropped(true);
              }}
            >
              <FileUp size={16} />
              {dropped ? "Resume attached" : "Drop Resume PDF"}
              <input
                type="file"
                accept=".pdf,.docx,application/pdf"
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files?.[0]) setDropped(true);
                }}
              />
            </label>
            <GoLiveButton className="h-11" />
          </div>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {faces.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="h-10 w-10 rounded-full border border-border object-cover"
                />
              ))}
            </div>
            <p className="text-[13px] font-medium text-muted">
              120+ staff engineers already live
            </p>
          </div>
        </div>

        <ResumeStack flying={flying} frontOpacity={frontOpacity} />
      </div>
    </section>
  );
}
