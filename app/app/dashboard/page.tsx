"use client";

import { InsightsDashboard } from "@/components/app/insights-dashboard";
import { PageTransition } from "@/components/motion/reveal";

export default function DashboardInsightsPage() {
  return (
    <PageTransition>
      <InsightsDashboard />
    </PageTransition>
  );
}
