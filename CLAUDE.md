# CLAUDE.md — CSM Dashboard

*Project-level context, inherited by every Claude Code session rooted here.
See `~/Master/CLAUDE.md` for the layer above this, and
`~/Master/AI/JesseOS/30_Master_Architecture/Standards/Session_Root_Protocol.md`
for why this file — not chat history — is where load-bearing decisions live.*

## What this is

Internal CSM/delivery dashboard for RT Digital's two products:

- **Respond** — Voice AI onboarding, delivery, and support workflows
- **Scale** — Paid media, funnel, AI bot, and go-live operations (variants:
  `meta`, `google`, `meta_google`)

Also hosts a **client-facing portal** (`/portal/[token]`) as a feature of this
same app — not a separate project, not a separate database. It reads the same
`tasks` table, filtered to `portal_visible = 1`.

## Stack

Next.js 16 (App Router) + React 19 + Drizzle ORM, running as a **Cloudflare
Worker** with **D1** (SQLite) as the database. Built with `vinext` (not plain
Next.js tooling) and `@cloudflare/vite-plugin`.

## Canonical root & deploy

- **Root:** `~/Master/AI/csm-dashboard` — GitHub: `JessesOS/csm-dashboard`, branch `main`
- **Live:** https://csm-dashboard.jesse-b4e.workers.dev — Cloudflare Worker
  `csm-dashboard` on `jesse@allconvos.ai`, D1 `csm-dashboard-db` (binding `DB`)
- **Deploy:** `npx vinext deploy` from the repo root. No `wrangler.toml` — worker
  config lives inline in `vite.config.ts`. Full steps, smoke tests, and a
  troubleshooting table: [docs/deploying.md](docs/deploying.md)
- **The old Google Drive path (`Codex Sites/respond-csm-dashboard`) and the
  Codex Sites deploy pipeline are retired.** Never push to a `sites` git
  remote. GitHub is the only backup; Cloudflare is the only deploy target.
- Local dev: `npm run dev` (fixed to port 3000). First run against a fresh
  `.wrangler/` state self-seeds the database — no manual schema/seed step.

## Data model essentials

- `lib/scaleTasks.ts` / `lib/respondTasks.ts` — the task templates (source of
  truth for what gets seeded). Scale: 86 tasks, 22 portal-visible milestones
  (21 + 1 injected for google/meta_google variants). Respond: 53 tasks, 12
  portal-visible milestones.
- Both were consolidated from far larger raw SOP lists (Scale 311→86, Respond
  83→53) by merging click-by-click micro-steps into real milestones; the
  granular steps are preserved in each task's `notes` field as "Merged SOP
  steps:" so nothing is lost for staff training — visible on drill-in.
- `lib/taskStore.ts` — seeding, migrations, and the `prepareTaskStorage()`
  cold-start path. Data migrations are triggered by bumping
  `currentStorageVersion`; add a `migrate...()` function and call it from
  `prepareTaskStorage()` for any change that must rewrite existing rows, not
  just new seeds.
- Task IDs are **scoped** per client (`clientId__templateId`), but
  `dependencies` arrays must also store **scoped** IDs to resolve correctly
  in the UI — this bit us once (a migration wrote bare template IDs) and is
  worth double-checking on any future migration that touches `dependencies`.
- Portal API: `GET /api/portal/{token}/tasks` → `{ clientId, clientName, tasks }`.

## Known trip-wires

- `compatibility_date` in `vite.config.ts` must stay ≤ what the local
  `workerd` binary supports, or `npm run dev` fails with
  `ERR_RUNTIME_FAILURE` (remote deploys aren't affected by this).
- Don't declare `nodejs_compat` in `vite.config.ts` — `vinext` injects it
  automatically; declaring it twice fails the Cloudflare upload with error
  10021 ("Compatibility flag specified multiple times").
- Any INSERT statement's column list and its bound-values array must match
  in count — a mismatch here (`seedClients`) once broke cold-start seeding
  on any fresh database while working fine on an already-seeded one.
- `.openai/hosting.json` and `build/sites-vite-plugin.ts` are dead code left
  over from the Codex Sites era. Harmless, unused, safe to ignore or remove.

## Design notes

- Font weights were compressed project-wide in 2026-07 (was mostly 760–900,
  now 400–700) — keep new weights in that range, don't reintroduce 800+.
- Status/count pills sitting on colored surfaces (stage headers, badges)
  need a real chip design (solid fg + light bg), not a translucent-black
  overlay — those read as muddy gray smears, worse in dark mode.
