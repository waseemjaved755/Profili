"use client";

import { VoiceWaveform } from "@/components/ui/voice-waveform";
import type { VoiceState } from "@/lib/motion";
import { useFinePointer } from "@/lib/use-fine-pointer";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useId, useState } from "react";

export function VoiceOrb({
  size = 280,
  state = "idle",
  className = "",
  interactive = true,
}: {
  size?: number;
  state?: VoiceState;
  className?: string;
  interactive?: boolean;
}) {
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const uid = useId().replace(/:/g, "");
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 90, damping: 18 });
  const y = useSpring(my, { stiffness: 90, damping: 18 });
  const [hover, setHover] = useState(false);
  const live = state !== "idle";
  const glow = hover || live ? 1 : 0.7;

  const scaleIdle = hover ? 1.05 : 1;

  return (
    <motion.div
      aria-hidden
      className={`relative ${className}`}
      style={{ width: size, height: size, x: interactive ? x : 0, y: interactive ? y : 0 }}
      onPointerMove={(e) => {
        if (!interactive || reduce || !fine) return;
        const rect = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 22);
        my.set(((e.clientY - rect.top) / rect.height - 0.5) * 22);
      }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => {
        setHover(false);
        mx.set(0);
        my.set(0);
      }}
      animate={
        reduce
          ? { scale: 1 }
          : state === "error"
            ? { x: [0, -6, 6, -4, 0], scale: 1 }
            : { scale: [scaleIdle, scaleIdle * 1.03, scaleIdle] }
      }
      transition={
        state === "error"
          ? { duration: 0.45 }
          : { duration: live ? 2.4 : 4.2, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <motion.span
        className="absolute inset-[-18%] rounded-full"
        style={{
          background: "radial-gradient(circle, var(--glow) 0%, transparent 70%)",
        }}
        animate={{ opacity: reduce ? 0.4 : [0.35 * glow, 0.85 * glow, 0.4 * glow] }}
        transition={{ duration: live ? 2 : 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {[0, 1, 2].map((ring) => (
        <motion.span
          key={ring}
          className="absolute rounded-full border"
          style={{
            inset: `${10 + ring * 8}%`,
            borderColor: ring === 0 ? "var(--ice)" : "var(--cerulean)",
            opacity: 0.28 - ring * 0.05,
          }}
          animate={
            reduce
              ? undefined
              : {
                  scale: live ? [1, 1.06, 1] : [1, 1.03, 1],
                  rotate: state === "processing" ? 360 : 0,
                }
          }
          transition={{
            scale: {
              duration: 3.2 + ring * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        />
      ))}

      {!reduce &&
        [0, 1, 2, 3, 4, 5].map((p) => (
          <motion.span
            key={p}
            className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-ice"
            animate={{
              x: [0, Math.cos((p / 6) * Math.PI * 2) * size * 0.38],
              y: [0, Math.sin((p / 6) * Math.PI * 2) * size * 0.38],
              opacity: [0.15, 0.8, 0.15],
              scale: [0.6, 1.1, 0.6],
            }}
            transition={{
              duration: 4.5 + p * 0.35,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p * 0.2,
            }}
          />
        ))}

      <svg viewBox="0 0 200 200" className="relative h-full w-full">
        <defs>
          <radialGradient id={`orb-${uid}`} cx="36%" cy="30%" r="72%">
            <stop offset="0%" stopColor="var(--ice)" />
            <stop offset="45%" stopColor="var(--steel)" />
            <stop offset="100%" stopColor="var(--deep-2)" />
          </radialGradient>
        </defs>
        <motion.circle
          cx="100"
          cy="100"
          r="54"
          fill={`url(#orb-${uid})`}
          animate={
            reduce
              ? undefined
              : { scale: live ? [1, 1.05, 0.98, 1] : [1, 1.025, 1] }
          }
          style={{ transformOrigin: "100px 100px" }}
          transition={{ duration: live ? 1.6 : 4.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <VoiceWaveform
          state={hover && state === "idle" ? "listening" : state}
          compact
          className="w-[46%] opacity-90"
        />
      </div>
    </motion.div>
  );
}
