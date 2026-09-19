import { AuthGate } from "@/components/app/auth-gate";
import { AppNav } from "@/components/app/top-bar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full">
      <AuthGate>
        <AppNav />
        <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:py-16">{children}</div>
      </AuthGate>
    </div>
  );
}
