"use client";

import { BrandMark, Wordmark } from "@/components/ui/wordmark";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AudioLines } from "lucide-react";
import Link from "next/link";

const product = [
  { href: "#how", label: "How it Works" },
  { href: "#embed", label: "Embed" },
  { href: "#insights", label: "Insights" },
  { href: "#waitlist", label: "Waitlist" },
];

const solutions = [
  { href: "/talk/waseem", label: "Example voice" },
  { href: "/signup", label: "For candidates" },
  { href: "#insights", label: "For recruiters" },
];

const socials = [
  {
    label: "Profili on X",
    href: "https://x.com/profili",
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
        <path d="M18.9 2H22l-6.8 7.8L23.3 22h-6.6l-5.2-6.8L5.8 22H2.7l7.3-8.3L.8 2h6.7l4.7 6.2L18.9 2Zm-1.2 18h1.8L6.4 3.9H4.5L17.7 20Z" />
      </svg>
    ),
  },
  {
    label: "Profili on Instagram",
    href: "https://instagram.com/profili",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Profili on LinkedIn",
    href: "https://linkedin.com/company/profili",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S.02 4.88.02 3.5 1.14 1 2.5 1s2.48 1.12 2.48 2.5zM.2 8.25h4.6V23H.2V8.25zM8.34 8.25h4.4v2.01h.06c.61-1.16 2.11-2.38 4.35-2.38 4.65 0 5.51 3.06 5.51 7.04V23h-4.6v-6.62c0-1.58-.03-3.61-2.2-3.61-2.2 0-2.54 1.72-2.54 3.5V23h-4.58V8.25z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-[#070d14] px-4 pb-6 pt-16 text-white sm:px-6 sm:pt-20 sm:pb-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Wordmark tone="onDark" />
            <p className="mt-4 max-w-xs text-[14px] font-medium text-white/70">
              Your experience, articulated in high-definition voice.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white/5 text-white transition-all duration-150 hover:-translate-y-px hover:border-white/35 hover:bg-white/10"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
          <Col title="Product" items={product} />
          <Col title="Solutions" items={solutions} />
          <Col
            title="Legal"
            items={[
              { href: "#", label: "Privacy Policy" },
              { href: "#", label: "Terms of Service" },
            ]}
          />
        </div>

        <div className="mt-16 sm:mt-20">
          <div className="footer-beam" aria-hidden />
          <p className="mt-8 text-center font-heading text-[18vw] leading-none font-semibold tracking-[0.14em] sm:mt-10 sm:text-[16vw] lg:text-[14.5vw]">
            Profili
          </p>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-5 text-[13px] font-medium text-white/50 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <BrandMark className="h-[19px] w-4" color="#ffffff" />
            <span>Copyright © {new Date().getFullYear()} all rights reserved.</span>
          </div>
          <p className="inline-flex items-center gap-1.5">
            <ThemeToggle plain />
            <AudioLines size={14} strokeWidth={2.6} aria-hidden />
            Made to be heard
          </p>
        </div>
      </div>
    </footer>
  );
}

function Col({
  title,
  items,
}: {
  title: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="font-mono text-[12px] font-medium tracking-wide text-white/40 uppercase">
        {title}
      </p>
      <ul className="mt-4 space-y-2 text-[14px] font-medium text-white/70">
        {items.map((item) => (
          <li key={item.label}>
            <Link href={item.href} className="transition-colors hover:text-white">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
