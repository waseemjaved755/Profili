"use client";

import { Wordmark } from "@/components/ui/wordmark";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { safeNextPath } from "@/lib/auth/safe-next";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { VISITORS } from "@/lib/visitors";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function GoogleMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.4-1.1 2.6-2.4 3.4v2.8h3.8c2.3-2.1 3.6-5.2 3.6-8.3z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.8c-1.1.7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.4v3c2 4 6.1 6.5 10.6 6.5z"
      />
      <path
        fill="#FBBC05"
        d="M5.3 14.5c-.2-.7-.4-1.4-.4-2.1s.1-1.5.4-2.1V7.3H1.4C.5 8.9 0 10.4 0 12.4c0 1.9.5 3.5 1.4 5.1l3.9-3z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.3 2.6 1.4 6.6l3.9 3c.9-2.8 3.6-4.8 6.7-4.8z"
      />
    </svg>
  );
}

function messageForError(code?: string | null) {
  if (code === "auth_failed") {
    return "Google sign-in did not complete. Try again.";
  }
  if (code === "config") {
    return "Auth is not configured. Add your Supabase keys to .env.local.";
  }
  return null;
}

export function AuthCard({
  mode,
  error: errorParam,
  next: nextParam,
}: {
  mode: "login" | "signup";
  error?: string;
  next?: string;
}) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<"google" | "form" | null>(null);
  const [error, setError] = useState(messageForError(errorParam));
  const [notice, setNotice] = useState<string | null>(null);
  const faces = VISITORS.slice(0, 3);
  const nextPath = safeNextPath(nextParam);

  async function onGoogle() {
    setError(null);
    setNotice(null);
    if (!isSupabaseConfigured()) {
      setError(messageForError("config"));
      return;
    }
    setBusy("google");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (oauthError) setError(oauthError.message);
    } catch {
      setError(messageForError("config"));
    } finally {
      setBusy(null);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!isSupabaseConfigured()) {
      setError(messageForError("config"));
      return;
    }
    setBusy("form");
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (signUpError) {
          setError(signUpError.message);
          return;
        }
        if (!data.session) {
          setNotice("Check your email to confirm your account, then sign in.");
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          setError(signInError.message);
          return;
        }
      }
      router.replace(nextPath);
      router.refresh();
    } catch {
      setError(messageForError("config"));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="relative flex min-h-[280px] flex-col justify-between overflow-hidden bg-deep px-8 py-8 text-white sm:px-10 lg:min-h-full lg:px-12 lg:py-10">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(165deg, #012A4A 0%, #013A63 28%, #01497C 55%, #2C7DA0 82%, #61A5C2 100%)",
          }}
        />
        <Wordmark tone="onDark" className="relative z-10" />
        <div className="relative z-10 mt-16 max-w-md lg:mt-0">
          <h2 className="text-[36px] font-semibold leading-[1.1] tracking-tight text-white sm:text-[44px]">
            Your experience, spoken in real time.
          </h2>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-3">
              {faces.map((face) => (
                <img
                  key={face.id}
                  src={face.src}
                  alt=""
                  className="h-9 w-9 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <p className="text-[13px] font-medium text-white/80">
              Join 120+ conversations on Profili
            </p>
          </div>
        </div>
      </aside>

      <div className="relative flex items-center justify-center bg-surface px-5 py-12 sm:px-8">
        <div className="absolute right-5 top-5 sm:right-8 sm:top-8">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-[400px]">
          <h1 className="text-[32px] font-semibold tracking-tight text-ink">
            {isSignup ? "Create your AI" : "Welcome back"}
          </h1>
          <p className="mt-2 text-[15px] text-muted">
            {isSignup
              ? "Upload your experience. Choose your voice. Start talking."
              : "Sign in to your Profili workspace."}
          </p>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200"
            >
              {error}
            </p>
          )}
          {notice && (
            <p
              role="status"
              className="mt-5 rounded-lg border border-[#01497C]/20 bg-[#F7FAFC] px-3 py-2 text-[13px] text-ink dark:border-[#89C2D9]/30 dark:bg-[#012A4A]/30"
            >
              {notice}
            </p>
          )}

          <button
            type="button"
            onClick={onGoogle}
            disabled={busy !== null}
            className="mt-8 flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-border bg-surface text-[15px] font-medium text-ink transition-colors duration-150 hover:border-steel/40 hover:bg-subtle disabled:opacity-60"
          >
            <GoogleMark />
            {busy === "google" ? "Redirecting..." : "Continue with Google"}
          </button>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-ink/15" />
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              Or
            </span>
            <span className="h-px flex-1 bg-ink/15" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {isSignup && (
              <label className="block">
                <span className="mb-1.5 block text-[13px] font-semibold text-ink">
                  Name
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Waseem Javed"
                  required
                  autoComplete="name"
                  className="h-12 w-full rounded-xl border border-ink/20 bg-surface px-3 text-[15px] text-ink outline-none placeholder:text-muted/50 focus:border-cerulean"
                />
              </label>
            )}
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold text-ink">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="h-12 w-full rounded-xl border border-ink/20 bg-surface px-3 text-[15px] text-ink outline-none placeholder:text-muted/50 focus:border-cerulean"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 flex items-center justify-between text-[13px] font-semibold text-ink">
                Password
                {!isSignup && (
                  <span className="font-medium text-muted">Forgot?</span>
                )}
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                autoComplete={isSignup ? "new-password" : "current-password"}
                className="h-12 w-full rounded-xl border border-ink/20 bg-surface px-3 text-[15px] text-ink outline-none placeholder:text-muted/50 focus:border-cerulean"
              />
            </label>
            <button
              type="submit"
              disabled={busy !== null}
              className="mt-2 flex h-11 w-full items-center justify-center rounded-lg bg-btn text-[15px] font-medium text-btn-fg transition-all duration-150 hover:bg-btn-hover active:scale-[0.98] disabled:opacity-60"
            >
              {busy === "form"
                ? "Please wait..."
                : isSignup
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          <p className="mt-4 text-[12px] leading-relaxed text-muted">
            By continuing you agree to the{" "}
            <Link href="/terms" className="font-medium text-ink underline underline-offset-4">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-ink underline underline-offset-4">
              Privacy Policy
            </Link>
            . Cookies are explained in the{" "}
            <Link href="/cookies" className="font-medium text-ink underline underline-offset-4">
              Cookie Policy
            </Link>
            .
          </p>

          <p className="mt-8 text-center text-[14px] text-muted">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-ink">
                  Log in
                </Link>
              </>
            ) : (
              <>
                No account?{" "}
                <Link href="/signup" className="font-bold text-ink">
                  Create your AI
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
