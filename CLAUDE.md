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
- Task statuses are **three-stage** (2026-07-19): `queued` ("To do"),
  `in_progress`, `complete`. "Blocked" is not a status — it's the
  `blocked_reason` TEXT column (`blockedReason` in the API): non-empty =
  flagged blocked, the text says why. "Review" was folded into
  `in_progress` (`normalizeTaskStatus()` in `lib/types.ts` maps legacy
  values found in old rows/snapshots).
- `lib/taskStore.ts` — seeding, migrations, and the `prepareTaskStorage()`
  cold-start path. Add a `migrate...()` function and call it from
  `prepareTaskStorage()` for any change that must rewrite existing rows, not
  just new seeds. **The real re-run trigger is the shape check, not the
  version string**: `storagePreparationAlreadyCompleted()` returns true (and
  silently re-stamps `currentStorageVersion`) whenever
  `seedWorkspaceShapeReady()` passes — so a migration only runs on an
  existing DB if it also changes the shape (e.g. adds its new column to
  `requiredTaskColumns`). Bump the version string too, but don't rely on it.
- Task IDs are **scoped** per client (`clientId__templateId`), but
  `dependencies` arrays must also store **scoped** IDs to resolve correctly
  in the UI — this bit us once (a migration wrote bare template IDs) and is
  worth double-checking on any future migration that touches `dependencies`.
- Portal API: `GET /api/portal/{token}/tasks` → `{ clientId, clientName, tasks }`.
- **BSS** (2026-10-15) is a third product (`bss`) for Bitcoin Success School /
  Fin Creighton — custom 41-task template in `lib/bssTasks.ts` (ids
  `bss-001…041`), drawn from the signed agreement, not from Scale. The
  customer-journey portal (`customerjourney-app`) uses the **same ids**, and
  the two apps sync task status both ways: see [docs/journey-sync.md](docs/journey-sync.md).
  Fin's 7 client tasks (`bssClientTaskIds`) are worked in the portal; the
  team's 34 are worked here. A BSS client syncs only once its
  `journey_client_id` is set (`PATCH /api/clients/<id>`). Fin never sees this
  dashboard — his window is the customer-journey portal.

## Known trip-wires

- `compatibility_date` in `vite.config.ts` must stay ≤ what the local
  `workerd` binary supports, or `npm run dev` fails with
  `ERR_RUNTIME_FAILURE` (remote deploys aren't affected by this).
- Don't declare `nodejs_compat` in `vite.config.ts` — `vinext` injects it
  automatically; declaring it twice fails the Cloudflare upload with error
  10021 ("Compatibility flag specified multiple times").
- A Worker can't `fetch()` another `*.workers.dev` Worker on the same
  Cloudflare account — it fails in production only (error **1042**; local
  dev has no such rule, so it passes locally). Worker-to-worker calls must go
  through a **service binding** (`services` in `vite.config.ts`). The BSS
  journey sync uses `JOURNEY_PORTAL` → `scale-onboarding-portal`.
- Any INSERT statement's column list and its bound-values array must match
  in count — a mismatch here (`seedClients`) once broke cold-start seeding
  on any fresh database while working fine on an already-seeded one.
- `.openai/hosting.json` and `build/sites-vite-plugin.ts` are dead code left
  over from the Codex Sites era. Harmless, unused, safe to ignore or remove.

## Design notes

- **Side rail (2026-10-15):** workspace is a dropdown (`WorkspaceMenu`), the
  two views are one tab row (`ViewTabs`), and the delivery-stage tree fills the
  rest of the rail. Mode (Live / Demo) lives in **Settings**; a "Demo" badge
  shows on the workspace control whenever Demo is on.
- **The dashboard opens on Live** (`app/page.tsx`, `startEnvironment`), with no
  preview tasks. `defaultEnvironment` in `lib/productWorkspaces.ts` deliberately
  stays `"demo"`: it decides where the seeded *preview* tasks are allowed
  (`resetWorkspace`), and flipping it would show template tasks as if they were
  a real Live client's.

- Font weights were compressed project-wide in 2026-07 (was mostly 760–900,
  now 400–700) — keep new weights in that range, don't reintroduce 800+.
- Status/count pills sitting on colored surfaces (stage headers, badges)
  need a real chip design (solid fg + light bg), not a translucent-black
  overlay — those read as muddy gray smears, worse in dark mode.
