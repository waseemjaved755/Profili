"use client";

import { WAITLIST_KEY, readConsent } from "@/lib/consent";
import { useEffect, useState } from "react";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    setJoined(readConsent().functional && Boolean(window.localStorage.getItem(WAITLIST_KEY)));
  }, []);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = email.trim().toLowerCase();
    if (!next) return;
    if (readConsent().functional) {
      window.localStorage.setItem(WAITLIST_KEY, next);
    }
    setJoined(true);
  }

  return (
    <section id="waitlist" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="label">Private beta</p>
        <h2 className="mt-3 text-[36px] font-semibold tracking-tight text-ink sm:text-[52px]">
          Get in before the next recruiter does.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-[16px] text-ink/80">
          Free while we are in private beta. Pricing when we launch. One email.
          We only write when a seat opens.
        </p>

        <div className="console-beam mx-auto mt-10 text-left">
          <div className="console-beam-face p-5 sm:p-7">
            {joined ? (
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-[11px] font-medium tracking-wide text-[#2A6F97] uppercase">
                    You&apos;re on the list
                  </p>
                  <p className="mt-1 text-[16px] font-semibold tracking-tight text-ink">
                    We&apos;ll email you when Profili opens.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-subtle px-2.5 py-1 font-mono text-[11px] text-navy">
                  <span className="ping-live h-1.5 w-1.5 rounded-full bg-good" />
                  Early access
                </span>
              </div>
            ) : (
              <form
                className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
                onSubmit={submit}
              >
                <label className="sr-only" htmlFor="waitlist-email">
                  Email
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter Your Email"
                  className="min-h-12 w-full flex-1 rounded-lg border border-border bg-subtle px-4 py-3 text-base font-medium leading-normal text-ink outline-none transition-colors placeholder:text-steel focus:border-steel/40 sm:min-h-11 sm:py-0 sm:text-sm dark:bg-[#012A4A]/40"
                />
                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-lg bg-btn px-5 text-base font-medium text-btn-fg shadow-sm transition-all duration-150 hover:bg-btn-hover active:scale-[0.98] sm:min-h-11 sm:w-auto sm:text-sm"
                >
                  Join waitlist
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
