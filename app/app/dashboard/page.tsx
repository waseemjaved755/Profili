"use client";

import { InsightsDashboard } from "@/components/app/insights-dashboard";
import { MessagesDashboard } from "@/components/app/messages-dashboard";
import { PageTransition } from "@/components/motion/reveal";
import { useEffect, useState } from "react";

export default function DashboardInsightsPage() {
  const [tab, setTab] = useState<"insights" | "messages">("insights");
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/voice/messages");
      const payload = (await response.json()) as { messages?: Array<{ read_at: string | null }> };
      setUnread((payload.messages ?? []).filter((row) => !row.read_at).length);
    })();
  }, [tab]);

  return (
    <PageTransition>
      <div className="mb-6 flex gap-1 rounded-lg border border-border bg-surface p-1">
        <button
          type="button"
          onClick={() => setTab("insights")}
          className={`rounded-md px-3 py-1.5 text-[13px] font-medium ${
            tab === "insights" ? "bg-subtle text-ink" : "text-muted hover:text-ink"
          }`}
        >
          Insights
        </button>
        <button
          type="button"
          onClick={() => setTab("messages")}
          className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-medium ${
            tab === "messages" ? "bg-subtle text-ink" : "text-muted hover:text-ink"
          }`}
        >
          Messages
          {unread > 0 ? (
            <span className="rounded-full bg-ink px-1.5 py-px font-mono text-[10px] text-btn-fg">
              {unread}
            </span>
          ) : null}
        </button>
      </div>
      {tab === "insights" ? <InsightsDashboard /> : <MessagesDashboard />}
    </PageTransition>
  );
}
