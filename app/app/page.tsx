"use client";

import { EmbedSnippet } from "@/components/app/embed-snippet";
import { ResumeParseUploader } from "@/components/app/resume-parse-uploader";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { PageTransition } from "@/components/motion/reveal";
import type { OwnerProfileRow } from "@/lib/resume/schema";
import { publicProfilePath, publicProfileUrl } from "@/lib/site";
import { Check, Copy } from "lucide-react";
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
  const headline = profile.profile_json.headline?.trim();
  const name = profile.full_name || profile.profile_json.full_name;

  return (
    <PageTransition>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
        <div>
          <p className="label">My Agent</p>
          <h1 className="mt-2 text-[36px] font-bold tracking-tight sm:text-[44px]">Your AI is live.</h1>
          {name ? <p className="mt-3 text-[18px] font-medium tracking-tight text-ink">{name}</p> : null}
          {headline ? <p className="mt-1 text-[15px] text-muted">{headline}</p> : null}
          <p className="mt-3 max-w-xl text-[15px] text-muted">{profile.greeting}</p>
          <div className="mt-6 flex flex-wrap gap-2">
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
        </div>
        <PublicLinkCard url={url} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <EmbedSnippet slug={profile.slug} />
        <section className="rounded-2xl border border-border bg-surface p-5">
          <p className="label">Replace resume</p>
          <p className="mt-2 text-[14px] text-muted">
            Uploading a new PDF sends you back to review as a draft.
          </p>
          <div className="mt-4">
            <ResumeParseUploader compact onParsed={() => window.location.assign("/app/review")} />
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

function PublicLinkCard({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="rounded-2xl border border-border bg-surface p-5">
      <p className="label">Public link</p>
      <p className="mt-2 text-[14px] text-muted">Share this with anyone who should talk to your agent.</p>
      <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-subtle px-3 py-2">
        <p className="min-w-0 flex-1 truncate font-mono text-[13px] text-ink">{url}</p>
        <button
          type="button"
          aria-label={copied ? "Copied link" : "Copy link"}
          onClick={() => void copy()}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-surface text-ink transition-colors hover:border-steel/40 hover:bg-surface"
        >
          {copied ? <Check size={15} strokeWidth={2.4} /> : <Copy size={15} strokeWidth={2.4} />}
        </button>
      </div>
    </section>
  );
}
