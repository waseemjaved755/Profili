"use client";

import { EmbedSnippet } from "@/components/app/embed-snippet";
import { ResumeParseUploader } from "@/components/app/resume-parse-uploader";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { PageTransition } from "@/components/motion/reveal";
import { publicProfilePath, publicProfileUrl } from "@/lib/site";
import type { OwnerProfileRow } from "@/lib/resume/schema";
import { useCallback, useEffect, useState } from "react";

export default function DashboardPage() {
  const [profile, setProfile] = useState<OwnerProfileRow | null | undefined>(undefined);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/resume/profile");
    const payload = (await response.json()) as {
      profile: OwnerProfileRow | null;
      error?: string;
    };
    if (!response.ok) {
      setError(payload.error || "Could not load your profile.");
      setProfile(null);
      return;
    }
    setProfile(payload.profile);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (profile === undefined) {
    return <div className="min-h-[40vh]" />;
  }

  if (!profile) {
    return (
      <PageTransition>
        <h1 className="text-[40px] font-bold tracking-tight">Upload your resume.</h1>
        <p className="mt-3 text-[16px] text-muted">
          PDF only, 5 MB max. We read the text and turn it into a reviewable profile.
        </p>
        {error && <p className="mt-4 text-[14px] text-danger">{error}</p>}
        <div className="mt-10">
          <ResumeParseUploader onParsed={() => window.location.assign("/app/review")} />
        </div>
      </PageTransition>
    );
  }

  if (profile.status !== "published" || !profile.slug) {
    return (
      <PageTransition>
        <h1 className="text-[40px] font-bold tracking-tight">Review your profile.</h1>
        <p className="mt-3 text-[16px] text-muted">
          We extracted your experience. Check it, then pick a voice.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <MagneticButton href="/app/review" arrow>
            Continue to review
          </MagneticButton>
          <MagneticButton href="/app/create" variant="ghost">
            Choose voice
          </MagneticButton>
        </div>
        <div className="mt-12">
          <p className="label">Replace resume</p>
          <div className="mt-4">
            <ResumeParseUploader onParsed={() => window.location.assign("/app/review")} />
          </div>
        </div>
      </PageTransition>
    );
  }

  const url = publicProfileUrl(profile.slug);

  return (
    <PageTransition>
      <h1 className="text-[40px] font-bold tracking-tight sm:text-[52px]">Your AI is live.</h1>
      <p className="mt-3 max-w-xl text-[16px] text-muted">{profile.greeting}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <MagneticButton href={publicProfilePath(profile.slug)} arrow>
          Open public page
        </MagneticButton>
        <MagneticButton href="/app/review" variant="ghost">
          Edit profile
        </MagneticButton>
        <MagneticButton href="/app/create" variant="ghost">
          Voice and tone
        </MagneticButton>
      </div>
      <CopyLink url={url} />
      <EmbedSnippet slug={profile.slug} />
      <div className="mt-16">
        <p className="label">Replace resume</p>
        <p className="mt-2 text-[14px] text-muted">Uploading a new PDF sends you back to review as a draft.</p>
        <div className="mt-4">
          <ResumeParseUploader onParsed={() => window.location.assign("/app/review")} />
        </div>
      </div>
    </PageTransition>
  );
}

function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-10 max-w-xl rounded-2xl border border-border bg-surface p-5">
      <p className="label">Public link</p>
      <p className="mt-2 break-all font-mono text-[14px]">{url}</p>
      <button
        type="button"
        className="mt-4 text-[14px] font-medium underline underline-offset-4"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }}
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
