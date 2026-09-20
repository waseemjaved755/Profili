import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { finalizeCallJob, sweepStaleCallsJob } from "@/lib/inngest/finalize-call";
import { parseResumeJob } from "@/lib/inngest/parse-resume";

export const maxDuration = 60;

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [parseResumeJob, finalizeCallJob, sweepStaleCallsJob],
});
