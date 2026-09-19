"use client";

import { AnimatedText } from "@/components/motion/animated-text";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { PageTransition } from "@/components/motion/reveal";
import { RangeControl, ToneSelector } from "@/components/ui/tone-selector";
import { ResumeUploader } from "@/components/ui/resume-uploader";
import { CheckMark, StepIndicator } from "@/components/ui/status";
import { VoiceCard } from "@/components/ui/voice-card";
import { VoiceOrb } from "@/components/ui/voice-orb";
import { demoUser, voices } from "@/lib/mock";
import { useSession } from "@/lib/session";
import type { Personality } from "@/lib/types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

const steps = ["Resume", "Voice", "Personality"];
const gen = [
  "Understanding your experience",
  "Building your personality",
  "Configuring your voice",
  "Preparing your AI",
];

export default function CreatePage() {
  const { user, update } = useSession();
  const router = useRouter();
  const reduce = useReducedMotion();
  const [step, setStep] = useState(user?.hasResume ? 1 : 0);
  const [voice, setVoice] = useState(user?.voice || "Alex");
  const [playing, setPlaying] = useState<string | null>(null);
  const [personality, setPersonality] = useState<Personality>(
    user?.personality || "professional",
  );
  const [formality, setFormality] = useState(user?.formality ?? 0.3);
  const [verbosity, setVerbosity] = useState(user?.verbosity ?? 0.5);
  const [phase, setPhase] = useState<"edit" | "generating" | "ready">("edit");
  const [genAt, setGenAt] = useState(0);

  if (!user) return null;

  function onResume(fileName: string) {
    update({
      hasResume: true,
      fileName,
      name: user?.name || demoUser.name,
      role: user?.role || demoUser.role,
      skills: user?.skills.length ? user.skills : demoUser.skills,
    });
    window.setTimeout(() => setStep(1), reduce ? 200 : 800);
  }

  function create() {
    setPhase("generating");
    setGenAt(0);
    let i = 0;
    const tick = () => {
      i += 1;
      setGenAt(i);
      if (i < gen.length) window.setTimeout(tick, reduce ? 80 : 700);
      else {
        update({
          voice,
          personality,
          formality,
          verbosity,
          hasAgent: true,
          hasResume: true,
          greeting:
            user?.greeting ||
            `Hi, I'm ${(user?.name || "this person").split(" ")[0]}'s AI. Ask me anything about their experience.`,
        });
        window.setTimeout(() => setPhase("ready"), reduce ? 100 : 500);
      }
    };
    window.setTimeout(tick, reduce ? 80 : 450);
  }

  if (phase === "generating" || phase === "ready") {
    const first = (user.name || "Your").split(" ")[0];
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: phase === "ready" ? 1.08 : 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
        >
          <VoiceOrb
            size={phase === "ready" ? 260 : 170}
            state={phase === "ready" ? "speaking" : "processing"}
          />
        </motion.div>
        <AnimatePresence mode="wait">
          {phase === "generating" ? (
            <motion.ul
              key="gen"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
              className="mt-10 space-y-3 text-left"
            >
              {gen.map((item, i) => (
                <li key={item} className="flex items-center gap-3 text-[16px]">
                  <CheckMark done={genAt > i} active={genAt === i} />
                  {item}
                </li>
              ))}
            </motion.ul>
          ) : (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10"
            >
              <AnimatedText as="h2" lines={["YOUR AI", "IS READY."]} className="!text-[48px] sm:!text-[72px]" />
              <p className="mt-6 text-[22px] font-medium tracking-tight">Meet {first}&apos;s AI.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <MagneticButton arrow onClick={() => router.push(`/talk/${user.handle}`)}>
                  Start talking
                </MagneticButton>
                <MagneticButton variant="ghost" onClick={() => router.push("/app")}>
                  Share your AI →
                </MagneticButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <PageTransition>
      <StepIndicator current={step} steps={steps} />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="resume"
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12 }}
            className="mt-10"
          >
            <h1 className="text-[40px] font-bold tracking-tight">Tell us about you.</h1>
            <p className="mt-3 text-[16px] text-muted">
              Your resume gives your AI the knowledge it needs.
            </p>
            <div className="mt-10">
              <ResumeUploader fileName={user.fileName} onComplete={onResume} />
            </div>
            <button
              type="button"
              className="mt-6 text-[14px] text-muted hover:text-foreground"
              onClick={() => onResume("Waseem-Javed.pdf")}
            >
              Skip with a sample resume
            </button>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div
            key="voice"
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12 }}
            className="mt-10"
          >
            <h1 className="text-[40px] font-bold tracking-tight">Choose your voice.</h1>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {voices.map((item) => (
                <VoiceCard
                  key={item.id}
                  voice={item}
                  selected={voice === item.name}
                  playing={playing === item.id}
                  onSelect={() => {
                    setVoice(item.name);
                    setPlaying(playing === item.id ? null : item.id);
                  }}
                />
              ))}
            </div>
            <div className="mt-10">
              <MagneticButton arrow onClick={() => setStep(2)}>
                Continue
              </MagneticButton>
            </div>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="tone"
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12 }}
            className="mt-10"
          >
            <h1 className="text-[40px] font-bold tracking-tight">How should you sound?</h1>
            <div className="mt-8">
              <ToneSelector value={personality} onChange={setPersonality} />
            </div>
            <div className="mt-10 max-w-md space-y-8">
              <RangeControl left="Formal" right="Casual" value={formality} onChange={setFormality} />
              <RangeControl
                left="Concise"
                right="Conversational"
                value={verbosity}
                onChange={setVerbosity}
              />
            </div>
            <div className="mt-12">
              <MagneticButton arrow onClick={create}>
                Create my AI
              </MagneticButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
