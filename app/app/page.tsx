"use client";

import { MagneticButton } from "@/components/motion/magnetic-button";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/motion/reveal";
import { AgentCard } from "@/components/ui/agent-card";
import { useSession } from "@/lib/session";

export default function DashboardPage() {
  const { user } = useSession();
  if (!user) return null;

  if (!user.hasAgent) {
    return (
      <PageTransition>
      <h1 className="text-[40px] font-bold tracking-tight">Finish creating your AI.</h1>
        <p className="mt-3 text-[16px] text-muted">Upload a resume, pick a voice, choose a tone.</p>
        <div className="mt-8">
          <MagneticButton href="/app/create" arrow>
            Continue
          </MagneticButton>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <h1 className="text-[40px] font-bold tracking-tight sm:text-[52px]">Your AI is ready.</h1>
      <div className="mt-12">
        <AgentCard user={user} />
      </div>
      <StaggerContainer className="mt-16 grid gap-8 sm:grid-cols-4">
        <StaggerItem>
          <p className="label">Profile</p>
          <p className="mt-2 text-[15px]">Resume uploaded ✓</p>
        </StaggerItem>
        <StaggerItem>
          <p className="label">Voice</p>
          <p className="mt-2 text-[15px]">{user.voice}</p>
        </StaggerItem>
        <StaggerItem>
          <p className="label">Tone</p>
          <p className="mt-2 text-[15px] capitalize">{user.personality}</p>
        </StaggerItem>
        <StaggerItem>
          <p className="label">Language</p>
          <p className="mt-2 text-[15px]">{user.language === "fr" ? "French" : "English"}</p>
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
}
