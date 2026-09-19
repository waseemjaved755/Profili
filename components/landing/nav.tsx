"use client";

import { Wordmark } from "@/components/ui/wordmark";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "#how", label: "How it Works" },
  { href: "#sandbox", label: "Live Sandbox", badge: "Live" },
  { href: "#insights", label: "Insights" },
  { href: "#waitlist", label: "Waitlist" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/75 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Wordmark size="sm" />
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm font-medium text-muted transition-colors duration-150 hover:text-ink"
            >
              {link.label}
              {link.badge && (
                <span className="ml-1.5 inline-flex items-center gap-1 rounded-full border border-border bg-subtle px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase text-navy">
                  <span className="ping-live h-1.5 w-1.5 rounded-full bg-good" />
                  {link.badge}
                </span>
              )}
            </a>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden h-9 items-center rounded-lg border border-border bg-surface px-3.5 text-sm font-medium text-ink transition-all duration-150 hover:border-steel/40 hover:bg-subtle sm:inline-flex"
          >
            Login
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface text-ink md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-surface/75 px-4 py-3 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-ink"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              className="text-sm font-medium text-ink sm:hidden"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
