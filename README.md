# Profili

Your résumé, as a voice you can share.

Upload a PDF. Profili turns it into a public page where someone can talk to your experience and get answers grounded in that document—not a generic chatbot.

**Live:** [profili.fyi](https://profili.fyi) · **Company:** [LinkedIn](https://www.linkedin.com/company/profili-fyi/)

## What we built

Professionals still send PDFs. Interviewers still skim them. Profili makes the résumé answer for itself.

1. Sign in (email or Google).
2. Upload a résumé. Parsing runs in the background.
3. Review the profile, pick a voice, publish a link.
4. Share `/participant/{slug}` or embed the same agent on a site.
5. After a call, the owner sees a transcript and a short insight report.

The live voice uses the **published** profile as context. Slow work (PDF parse, post-call insights) runs in background jobs so the product stays fast.

## Stack

| | |
| --- | --- |
| App | Next.js 16, React 19, Tailwind |
| Auth & files | Supabase (cookie sessions, private Storage) |
| Data | Postgres, Drizzle |
| Jobs | Inngest |
| Parse & insights | Gemini |
| Voice | AssemblyAI Voice Agent |

## Run locally

You need Next (`:3000`) and the Inngest Dev Server (`:8288`).

```bash
pnpm install
cp .env.example .env.local
pnpm db:migrate
pnpm dev
pnpm inngest:dev
```

Fill `.env.example` into `.env.local` (Supabase, `DATABASE_URL`, Gemini, AssemblyAI, `NEXT_PUBLIC_SITE_URL`). Keep `SUPABASE_SERVICE_ROLE_KEY` on the server only.

## Routes

| Path | |
| --- | --- |
| `/` | Landing |
| `/signup` `/login` | Auth |
| `/app` | Workspace: upload, review, publish |
| `/app/dashboard` | Calls and insights |
| `/participant/{slug}` | Public voice page |

## License

Private. Built for hackathon demo and [profili.fyi](https://profili.fyi).
