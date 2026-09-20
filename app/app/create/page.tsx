"use client";

import { AnimatedText } from "@/components/motion/animated-text";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { PageTransition } from "@/components/motion/reveal";
import { RangeControl, ToneSelector } from "@/components/ui/tone-selector";
import { CheckMark, StepIndicator } from "@/components/ui/status";
import { VoiceCard } from "@/components/ui/voice-card";
import { VoiceOrb } from "@/components/ui/voice-orb";
import { voices } from "@/lib/mock";
import type { OwnerProfileRow } from "@/lib/resume/schema";
import type { Personality } from "@/lib/types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const steps = ["Resume", "Voice", "Personality"];
const gen = [
  "Understanding your experience",
  "Building your personality",
  "Configuring your voice",
  "Preparing your AI",
];

export default function CreatePage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [profile, setProfile] = useState<OwnerProfileRow | null>(null);
  const [loadError, setLoadError] = useState("");
  const [step, setStep] = useState(1);
  const [voice, setVoice] = useState("Alex");
  const [playing, setPlaying] = useState<string | null>(null);
  const [personality, setPersonality] = useState<Personality>("professional");
  const [formality, setFormality] = useState(0.3);
  const [verbosity, setVerbosity] = useState(0.5);
  const [phase, setPhase] = useState<"edit" | "generating" | "ready">("edit");
  const [genAt, setGenAt] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/resume/profile");
      const payload = (await response.json()) as {
        profile: OwnerProfileRow | null;
        error?: string;
      };
      if (!response.ok || !payload.profile) {
        setLoadError(payload.error || "Review your resume first.");
        return;
      }
      setProfile(payload.profile);
      const json = payload.profile.profile_json;
      setVoice(json.voice || "Alex");
      setPersonality(json.personality || "professional");
      setFormality(json.formality ?? 0.3);
      setVerbosity(json.verbosity ?? 0.5);
    })();
  }, []);

  async function create() {
    if (!profile) return;
    setError("");
    setPhase("generating");
    setGenAt(0);
    let i = 0;
    const tick = () => {
      i += 1;
      setGenAt(i);
      if (i < gen.length) window.setTimeout(tick, reduce ? 80 : 500);
    };
    window.setTimeout(tick, reduce ? 80 : 350);

    const json = profile.profile_json;
    const response = await fetch("/api/resume/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: json.full_name || profile.full_name,
        greeting: profile.greeting,
        headline: json.headline,
        summary: json.summary,
        experience: json.experience,
        skills: json.skills,
        slug: profile.slug || "profile",
        reviewed: true,
        voice,
        personality,
        formality,
        verbosity,
      }),
    });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      setPhase("edit");
      setError(payload.error || "Could not publish.");
      return;
    }
    window.setTimeout(() => setPhase("ready"), reduce ? 200 : 900);
  }

  if (loadError) {
    return (
      <PageTransition>
        <h1 className="text-[40px] font-bold tracking-tight">Finish your profile first.</h1>
        <p className="mt-3 text-[16px] text-muted">{loadError}</p>
        <div className="mt-8">
          <MagneticButton href="/app/review" arrow>
            Review resume
          </MagneticButton>
        </div>
      </PageTransition>
    );
  }

  if (!profile) return <div className="min-h-[40vh]" />;

  if (phase === "generating" || phase === "ready") {
    const first = (profile.full_name || "Your").split(" ")[0];
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
                <MagneticButton arrow onClick={() => router.push("/app")}>
                  Share and embed
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
            {error && <p className="mt-6 text-[14px] text-danger">{error}</p>}
            <div className="mt-10 flex flex-wrap gap-3">
              <MagneticButton variant="ghost" onClick={() => router.push("/app/review")}>
                Back
              </MagneticButton>
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
            {error && <p className="mt-6 text-[14px] text-danger">{error}</p>}
            <div className="mt-12 flex flex-wrap gap-3">
              <MagneticButton variant="ghost" onClick={() => setStep(1)}>
                Back
              </MagneticButton>
              <MagneticButton arrow onClick={() => void create()}>
                Create my AI
              </MagneticButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
