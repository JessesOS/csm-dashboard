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

**Live and verified in production, 2026-10-15** (CSM version `7c7fdd91`, portal
`8867f9f3`). Test link: CSM demo client `bss-fin-creighton-demo` ↔ portal
"Fin Test" `90a39b38-0312-4143-b6bf-b58b1b27b579`. Confirmed both ways on the
live databases: CSM → portal (`bss-008`, `bss-010` done; `bss-011` un-ticked;
in-progress `bss-009` stays not-done) and Fin's real completion path → CSM
(`bss-003` complete with its note).

Not yet linked: Fin's real record (created in the portal admin when Jesse is
ready, then linked to the Live CSM BSS client).

Known gap: a push that fails (portal down, bad deploy) is not retried — that
task only catches up on its next change. A per-client "resync" that pushes all
41 statuses would close it.

