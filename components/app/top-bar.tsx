"use client";

import { ShareButton } from "@/components/ui/share-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Wordmark } from "@/components/ui/wordmark";
import { useSession } from "@/lib/session";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app", label: "My Agent" },
  { href: "/app/profile", label: "Profile" },
  { href: "/app/settings", label: "Settings" },
];

function linkActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useSession();
  const [open, setOpen] = useState(false);
  const initial = (user?.name || "P").charAt(0).toUpperCase();

  async function signOut() {
    await logout();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Wordmark href="/app" size="sm" />
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                linkActive(pathname, link.href) ? "bg-subtle text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user?.hasAgent && (
            <div className="hidden sm:block">
              <ShareButton handle={user.handle} />
            </div>
          )}
          <ThemeToggle />
          <span className="grid h-8 w-8 place-items-center rounded-full bg-btn text-[12px] font-semibold text-btn-fg">
            {initial}
          </span>
          <button
            type="button"
            className="hidden text-[13px] font-medium text-muted transition-colors hover:text-ink sm:inline"
            onClick={() => void signOut()}
          >
            Log out
          </button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface text-ink md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="flex flex-col gap-3 border-t border-border bg-surface px-5 py-4 md:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="font-bold text-ink">
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            className="text-left font-bold text-ink"
            onClick={() => void signOut()}
          >
            Log out
          </button>
        </div>
      )}
    </header>
  );
}
