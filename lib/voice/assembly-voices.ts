import { voices } from "@/lib/mock";

const ASSEMBLY_VOICE: Record<string, string> = {
  Alex: "alba",
  Emma: "alba",
  Daniel: "alba",
  Maya: "alba",
  Noah: "alba",
  Sofia: "alba",
};

export function assemblyVoiceId(uiName: string) {
  return ASSEMBLY_VOICE[uiName] || ASSEMBLY_VOICE[voices[0]?.name ?? "Alex"] || "alba";
}
