# BSS journey sync — CSM dashboard ⇄ customer-journey portal

Two-way sync of BSS task status between the CSM dashboard (`csm-dashboard`,
this repo) and the customer-journey portal (`customerjourney-app`, worker
`scale-onboarding-portal`). Approved by Jesse 2026-10-15.

Both apps use the same 41 task ids, `bss-001` … `bss-041` (CSM
`lib/bssTasks.ts` = portal `lib/bssJourney.ts`), so a task id means the same
task on both sides.

## Who owns what

| Who acts | Tasks | Worked in | Flows to |
|---|---|---|---|
| The team | the other 34 | CSM dashboard | → portal (Fin sees "With us" → done) |
| Fin | `bss-001, 003, 004, 014, 015, 016, 027` | portal | → CSM (incl. the `bss-001` interview transcript as the note) |

The client set is `bssClientTaskIds` in CSM `lib/bssTasks.ts` (the tasks with
`portalActionRequired: true`) and must match the portal's non-team tasks.
Either side's change flows across (the team can still tick a client task in CSM,
e.g. when Fin emails his access) — ownership is about where work normally
happens, not a lock.

**No echo:** a write that arrived *from* the other app is never pushed back.
CSM tags portal-originated writes `actor = "portal"` and skips the push; the
portal's `/api/csm-sync/milestone` must likewise never call CSM.

## Transport — service bindings, not public URLs

In production the two Workers call each other over **service bindings**: a
plain `fetch()` from one `*.workers.dev` Worker to another on the same account
fails with Cloudflare **error 1042** (only in production — local dev has no
such rule). CSM binds `JOURNEY_PORTAL` → `scale-onboarding-portal`; the portal
binds `CSM_DASHBOARD` → `csm-dashboard`. The URLs below are still used for the
request path (the host is ignored over a binding). Setting
`JOURNEY_SYNC_URL` / `CSM_SYNC_URL` explicitly (local dev) switches back to a
plain `fetch()` to that URL.

## Auth

Shared secret `JOURNEY_SYNC_TOKEN`, set on **both** workers
(`wrangler secret put JOURNEY_SYNC_TOKEN`). Sent as header
`x-journey-sync-token: <token>` (or `Authorization: Bearer <token>`). No token
configured ⇒ the receiving endpoint rejects, and the sender skips.

## Clients — created in the portal, mirrored by CSM

BSS clients are created **once, in the portal admin**. Whenever CSM lists the
**Live** BSS workspace it calls the portal for its BSS clients and mirrors them
(`reconcileJourneyClients` in `lib/taskStore.ts`):

- A portal client CSM doesn't have yet → a new Live CSM client (41 tasks
  seeded), linked by `journey_client_id`, with the portal's completed
  milestones imported **once** at link time (notes included). From then on the
  per-milestone sync below keeps them in step.
- The **portal id is the identity**, never the name — two portal clients can
  share a name or company. Mirrored clients get a CSM id derived from the
  portal id (`live-bss-<name-slug>-<first 8 of portal id>`), so a race between
  two page loads fails on the primary key instead of duplicating.
- Already-linked clients take the portal's name and company.
- **Live BSS shows exactly the portal's clients.** A client deleted in the
  portal, or one made by hand in CSM (never linked), is **hidden, not deleted**
  — its data survives a mistaken portal delete. If the portal can't be
  reached, linked clients stay visible. CSM offers no "New client" / GHL
  import in Live BSS; it points to the portal admin instead.
- Portal-linked clients are **never merged by name/company**
  (`reconcileDuplicateClients` and `createClient`'s identity match skip them):
  merging deleted the mirror, which the sync re-created empty — losing progress.
- Portal unreachable / no token → CSM shows what it already has.

```
GET {PORTAL}/api/csm-sync/clients        (portal implements)
x-journey-sync-token: <token>
→ { "ok": true, "clients": [ { "id", "name", "companyName", "createdAt",
      "completed": [ { "milestoneId": "bss-003", "note": "…" } ] } ] }
```
Only `client_type = "bss"`; read-only; never calls CSM.

## Linking clients

A CSM BSS client stores its portal client's `portal_clients.id` in
`clients.journey_client_id`. Unlinked clients (e.g. the CSM demo walkthrough
client) don't sync. Set it with:

```
PATCH {CSM}/api/clients/<csmClientId>   { "journeyClientId": "<portal_clients.id>" }
```

## Endpoint 1 — CSM → portal (portal implements)

```
POST {PORTAL}/api/csm-sync/milestone
x-journey-sync-token: <token>
{ "journeyClientId": "<portal_clients.id>",
  "milestoneId": "bss-014",
  "status": "queued" | "in_progress" | "complete",
  "done": true | false }
```

Sent by CSM whenever a linked BSS task's status changes (except changes that
came from the portal). Portal should: check the token; check `milestoneId` is a
BSS journey id; `setMilestoneDone(journeyClientId, milestoneId, done)`; reply
`2xx {"ok": true}`; **not** call CSM back. `status` is included so the portal can
show "in progress" on Fin's Kanban/timeline later; today only `done` is stored.
CSM waits at most 5 s and never fails its own update if the portal is down; the
last result is kept in CSM `app_meta` key `journey_sync_last:<csmClientId>`.

`{PORTAL}` defaults to `https://scale-onboarding-portal.jesse-b4e.workers.dev`
(override with CSM env `JOURNEY_SYNC_URL`, e.g. a local dev server).

## Endpoint 2 — portal → CSM (CSM implements, done)

```
POST {CSM}/api/journey-sync
x-journey-sync-token: <token>
{ "journeyClientId": "<portal_clients.id>",
  "milestoneId": "bss-001",
  "done": true,
  "note": "Interviewer: …\nClient: …" }      // optional, ≤ 12,000 chars
```

The portal calls this when a BSS milestone is completed or un-completed on its
side (Fin's `/api/portal/[token]/complete`, and the admin checklist). CSM marks
the task `complete` (or back to `queued` when `done: false`; an in-progress CSM
task is left alone unless done-ness actually changes) and saves `note` as the
task's notes. Responses: `200 {ok, updated:[{id,status}]}`, `401` bad token,
`400` unknown milestone / no linked client. The portal should call it
fire-and-forget with a short timeout so Fin's completion never fails if CSM is
down.

`{CSM}` = `https://csm-dashboard.jesse-b4e.workers.dev`.

`GET {CSM}/api/journey-sync` with the token lists the linked BSS clients and the
last sync in each direction — the quick "is it synced?" check.

## Status

**PAUSED, 2026-10-16** (Jesse, relayed by the portal session): the BSS journey
felt clunky next to Scale, so Fin goes on **Scale — Meta ads only** in the
portal instead. Nothing is deleted on either side: the template, the ids, the
two-way sync and the client pickup all stay live but idle, ready if BSS comes
back. No real Fin client is to be created or linked under BSS. Scale clients
don't sync between the apps (different task ids: portal `ob-`/`bd-`… vs CSM
`scl-`…), so Fin on Scale would be added to the CSM board by hand.


**Live and verified in production, 2026-10-15** (CSM version `7c7fdd91`, portal
`8867f9f3`). Test link: CSM demo client `bss-fin-creighton-demo` ↔ portal
"Fin Test" `90a39b38-0312-4143-b6bf-b58b1b27b579`. Confirmed both ways on the
live databases: CSM → portal (`bss-008`, `bss-010` done; `bss-011` un-ticked;
in-progress `bss-009` stays not-done) and Fin's real completion path → CSM
(`bss-003` complete with its note).

Client mirror live too (CSM version `d25b73ab`): prod "Fin Test" was
mirrored into Live BSS as `live-bss-fin-test-90a39b38` with its portal
progress (`bss-001, 003, 004, 008, 010`, notes included), and a CSM tick/untick
on it reached the portal. The CSM demo client is **unlinked** — only the Live
mirror syncs.

Fin's real record: create it in the portal admin; it appears in Live BSS on
the next load, already linked.

Known gap: a push that fails (portal down, bad deploy) is not retried — that
task only catches up on its next change. A per-client "resync" that pushes all
41 statuses would close it.

## Changelog — ids, ownership, client-facing wording

Any change here goes to the other session the same day **and** gets a line
below. Both sessions may append.

| Date | Change | Where |
|---|---|---|
| 2026-10-15 | Portal adopts CSM's 41 ids `bss-001…041` and five stages | both |
| 2026-10-15 | Client-owned set fixed: `bss-001, 003, 004, 014, 015, 016, 027` | both |
| 2026-10-15 | "RT Digital" removed from BSS | both |
| 2026-10-16 | Cal.com → **Calendly** (`bss-003, 007, 013, 022`) | both |
| 2026-10-16 | `bss-003` is **invite-based access**: Fin invites `admin@allconvos.ai` on CRM, GHL, Calendly, domain, hosting, Meta Business Suite, YouTube; no passwords | both |
| 2026-10-16 | Cross-check: both apps show only `jessetest` (f11ea83a), `bss-001` done with transcript; in sync | both |
| 2026-10-16 | Portal strips the voice's bracketed delivery cues (e.g. `[warmly]`, ≤30 chars) from interview transcripts before saving, so `bss-001` notes arrive clean; jessetest's earlier note still has them (test data) | portal |
| 2026-10-16 | `bss-002` "Portal setup & kick-off call" **retired** (Jesse: "we don't need this task"): hidden on both sides, not deleted; id still accepted by the sync. BSS is now **40 tasks** (Onboarding 6). CSM also dropped `bss-003`'s dependency on it | both |
| 2026-10-16 | `bss-003` invite list trimmed to **five**: CRM, GHL sub-account, Calendly, domain provider, website hosting (Meta Business Suite and YouTube removed). `bss-020` / `bss-021` stay as team tasks | both |
| 2026-10-16 | **BSS paused** (Jesse): Fin moves to Scale — Meta ads only. Nothing deleted; BSS template, ids, sync and pickup stay as they are | both |
| 2026-10-16 | New product name aligned (Jesse): portal "BSS Meta ads only" (`bss-meta`) ↔ CSM Scale variant **"BSS Meta ads only"** (`bss_meta`), same Meta-only task set on each side. **No sync** for it (portal `ob-`/`bd-`… vs CSM `scl-`… ids) | both |
