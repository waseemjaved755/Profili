import Link from "next/link";

export function AccountData() {
  return (
    <section id="data" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="label">Your account</p>
        <h2 className="mt-3 text-[36px] font-semibold tracking-tight text-ink sm:text-[52px]">
          Why we ask Google for your name and email.
        </h2>
        <p className="mt-4 text-[16px] text-ink/80">
          Profili turns a résumé into a public voice agent. Sign in to upload a
          PDF, review the draft, and publish a shareable link or embed.
          Recruiters talk to that page. You see who called.
        </p>
        <p className="mt-4 text-[16px] text-ink/80">
          Continue with Google only so we can create or open your Profili
          account. We receive your name, email, and Google account id (and a
          profile photo if Google sends one). We use that to identify you in
          the workspace. We do not read Gmail, Drive, Calendar, or Contacts.
        </p>
        <p className="mt-6 text-[15px] text-muted">
          Full detail is in the{" "}
          <Link href="/privacy" className="font-medium text-ink underline underline-offset-4">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="font-medium text-ink underline underline-offset-4">
            Terms of Service
          </Link>
          . You can use the site and these pages without signing in.
        </p>
      </div>
    </section>
  );
}
