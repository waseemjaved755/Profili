import { AuthGate } from "@/components/app/auth-gate";
import { AppNav } from "@/components/app/top-bar";
import { noIndex } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: noIndex,
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full">
      <AuthGate>
        <AppNav />
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:py-14">{children}</div>
      </AuthGate>
    </div>
  );
}
