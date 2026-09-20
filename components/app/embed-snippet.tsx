"use client";

import { MagneticButton } from "@/components/motion/magnetic-button";
import { embedIframeSnippet, embedScriptSnippet } from "@/lib/site";
import { useState } from "react";

export function EmbedSnippet({ slug }: { slug: string }) {
  const [tab, setTab] = useState<"iframe" | "script">("iframe");
  const [copied, setCopied] = useState(false);
  const code = tab === "iframe" ? embedIframeSnippet(slug) : embedScriptSnippet(slug);

  return (
    <div className="mt-10 max-w-xl rounded-2xl border border-border bg-surface p-5">
      <p className="label">Add to your site</p>
      <p className="mt-2 text-[14px] text-muted">
        Paste this into any page. Visitors talk to your agent without leaving your site.
      </p>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className={`rounded-lg border px-3 py-1.5 text-[13px] font-medium ${
            tab === "iframe" ? "border-steel/40 bg-subtle" : "border-border"
          }`}
          onClick={() => setTab("iframe")}
        >
          iframe
        </button>
        <button
          type="button"
          className={`rounded-lg border px-3 py-1.5 text-[13px] font-medium ${
            tab === "script" ? "border-steel/40 bg-subtle" : "border-border"
          }`}
          onClick={() => setTab("script")}
        >
          Script
        </button>
      </div>
      <pre className="mt-4 overflow-x-auto rounded-lg bg-subtle p-3 font-mono text-[12px] leading-relaxed">
        {code}
      </pre>
      <div className="mt-4">
        <MagneticButton
          variant="secondary"
          onClick={async () => {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          }}
        >
          {copied ? "Copied" : "Copy snippet"}
        </MagneticButton>
      </div>
    </div>
  );
}
