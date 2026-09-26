"use client";

import { ButtonLink } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { PageTransition } from "@/components/ui/page-transition";
import { openConsentBanner } from "@/lib/consent";
import { useSession } from "@/lib/session";
import { FormEvent, useEffect, useState } from "react";

export default function SettingsPage() {
  const { user } = useSession();
  const [bookingUrl, setBookingUrl] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/resume/profile");
      const payload = (await response.json()) as { profile?: { booking_url?: string | null } };
      setBookingUrl(payload.profile?.booking_url || "");
    })();
  }, []);

  async function saveBooking(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/resume/booking", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_url: bookingUrl }),
      });
      const payload = (await response.json()) as { error?: string; booking_url?: string | null };
      if (!response.ok) throw new Error(payload.error || "Could not save.");
      setBookingUrl(payload.booking_url || "");
      setStatus("Saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <PageTransition>
      <h1 className="text-[40px] font-bold tracking-tight">Settings</h1>
      <ul className="mt-10 max-w-md space-y-6 text-[16px]">
        <li className="flex items-center justify-between border-b border-border py-4">
          <span>Voice</span>
          <span className="text-muted">{user.voice}</span>
        </li>
        <li className="flex items-center justify-between border-b border-border py-4">
          <span>Personality</span>
          <span className="text-muted capitalize">{user.personality}</span>
        </li>
        <li className="flex items-center justify-between border-b border-border py-4">
          <span>Language</span>
          <span className="text-muted">{user.language === "fr" ? "French" : "English"}</span>
        </li>
        <li className="flex items-center justify-between border-b border-border py-4">
          <span>Cookies</span>
          <button
            type="button"
            onClick={() => openConsentBanner()}
            className="text-[14px] font-medium text-ink underline underline-offset-4"
          >
            Manage
          </button>
        </li>
      </ul>
      <form className="mt-10 max-w-md" onSubmit={(event) => void saveBooking(event)}>
        <Field
          label="Booking link"
          name="booking_url"
          type="url"
          inputMode="url"
          placeholder="https://"
          value={bookingUrl}
          onChange={(event) => setBookingUrl(event.target.value)}
        />
        <p className="mt-2 text-[13px] text-muted">Cal.com, Calendly, or any scheduling page</p>
        <button
          type="submit"
          disabled={saving}
          className="mt-4 inline-flex min-h-10 items-center rounded-lg bg-btn px-4 text-[14px] font-medium text-btn-fg disabled:opacity-60"
        >
          {saving ? "Saving" : "Save booking link"}
        </button>
        {status ? <p className="mt-2 text-[13px] text-muted">{status}</p> : null}
      </form>
      <div className="mt-10">
        <ButtonLink href="/app/create" variant="ghost">
          Update agent →
        </ButtonLink>
      </div>
    </PageTransition>
  );
}
