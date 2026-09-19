"use client";

import { CircleCheck, Mic, Sparkles } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

type Plan = {
  name: string;
  audience: string;
  price: string;
  period: string;
  icon: LucideIcon;
  features: string[];
  cta: string;
  popular?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    audience: "Ship your first voice agent",
    price: "$0",
    period: "/month",
    icon: Mic,
    features: [
      "One voice agent",
      "Resume-grounded answers",
      "Public talk link",
      "Tone tuner",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    audience: "For recruiters who want the full signal",
    price: "$19",
    period: "/month",
    icon: Sparkles,
    features: [
      "Everything in Free",
      "Unlimited voice minutes",
      "Custom domain",
      "Query analytics",
      "Multiple agents",
    ],
    cta: "Get Started",
    popular: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-center text-[36px] font-semibold tracking-tight text-ink sm:text-[52px]">
          Simple pricing. Serious talent.
        </h2>
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <article
                key={plan.name}
                className="relative flex flex-col rounded-2xl border border-border bg-surface p-7 shadow-[var(--shadow-lg)] transition-colors duration-200 hover:border-steel/40"
              >
                {plan.popular && (
                  <span className="absolute right-5 top-5 rounded-full border border-border bg-subtle px-2.5 py-1 font-mono text-[11px] font-medium text-navy">
                    Popular
                  </span>
                )}

                <span
                  className={`grid h-10 w-10 place-items-center rounded-lg border border-border ${
                    plan.popular ? "bg-subtle" : "bg-surface"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.8} className="text-ink" />
                </span>

                <h3 className="mt-5 text-[24px] font-semibold tracking-tight text-ink">
                  {plan.name}
                </h3>
                <p className="mt-2 text-[14px] text-muted">
                  {plan.audience}
                </p>

                <p className="mt-6 flex items-end gap-1">
                  <span className="text-[48px] font-semibold leading-none tracking-tight text-ink">
                    {plan.price}
                  </span>
                  <span className="mb-1.5 font-mono text-[13px] text-steel">
                    {plan.period}
                  </span>
                </p>

                <ul className="mt-6 mb-8 flex-1 space-y-3">
                  {plan.features.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[15px] text-ink"
                    >
                      <CircleCheck
                        size={18}
                        strokeWidth={1.8}
                        className="mt-0.5 shrink-0 text-cerulean"
                      />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={`mt-auto flex h-11 w-full items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 active:scale-[0.98] ${
                    plan.popular
                      ? "bg-btn text-btn-fg shadow-sm hover:bg-btn-hover"
                      : "border border-border bg-surface text-ink hover:border-steel/40"
                  }`}
                >
                  {plan.cta}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
