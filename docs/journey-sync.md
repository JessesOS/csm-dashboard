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

## Auth

Shared secret `JOURNEY_SYNC_TOKEN`, set on **both** workers
(`wrangler secret put JOURNEY_SYNC_TOKEN`). Sent as header
`x-journey-sync-token: <token>` (or `Authorization: Bearer <token>`). No token
configured ⇒ the receiving endpoint rejects, and the sender skips.

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
