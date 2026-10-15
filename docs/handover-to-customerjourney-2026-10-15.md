# Handover to the Customer Journey (portal) session: 2026-10-15

From the CSM Dashboard session (`~/Master/AI/csm-dashboard`, branch `main`).
Reply handover to `docs/handover-to-csm-2026-10-15.md` — this is what the CSM
side now has for BSS, so the two apps can line up.

**Live:** https://csm-dashboard.jesse-b4e.workers.dev (deployed, version 7cd5f630).

## What we built on the CSM side today

BSS is now a **first-class product** in the CSM dashboard, alongside Respond and
Scale — not a Scale variant. It is custom to Bitcoin Success School (Fin
Creighton), RT Digital's first signed client.

- **Product key:** `bss`. **Product label:** "BSS" (short, so it doesn't collide
  with the client name). **Client:** `Fin Creighton` / company `Bitcoin Success
  School`, code `BSS`, owner `Jesse Allan`.
- **Source of truth for the tasks:** the signed Scope & Agreement v2
  (https://bss-agreement.vercel.app/), not the Scale journey. Every task traces
  to a line in that agreement.
- **Template file:** `lib/bssTasks.ts` (9 categories, 41 tasks). Product wiring
  in `lib/productWorkspaces.ts` and `lib/types.ts` (`ProductKey` now includes
  `"bss"`). Demo seed client in `lib/bssClients.ts`.
- **Branding:** the RT Digital / Respond blue mark is removed on all BSS surfaces
  (dashboard sidebar, mission header, the BSS client portal) and from every
  workspace-switcher button. Respond/Scale keep their mark in the brand headers
  and their own portals.

## Stages & tasks (what the CSM board holds)

Standard five stages. **41 tasks**, IDs `bss-001` … `bss-041`. 12 are
portal-visible (marked * below — these are what Fin sees in the journey portal).

**Onboarding (7)** — Weeks 1–2
- bss-001* Voice interview — intake  ← mirrors the portal's first task; transcript saved as the task note
- bss-002* Portal setup & kick-off call
- bss-003* Collect access — CRM, GHL, Cal.com, domain, hosting, socials
- bss-004 Map & agree the customer journey (before any build)
- bss-005 Audit current CRM + GHL sub-account → written findings
- bss-006 Map all current enquiry channels
- bss-007 Map partner / payment / webinar / Cal.com setup

**Build (14)** — Weeks 2–5
- bss-008 Install & configure the GHL snapshot
- bss-009 Pipeline stages, tags & custom fields
- bss-010 Migrate, clean, de-dupe & tag contacts
- bss-011 Smart lists + lead score (hot/warm/cold)
- bss-012 Business phone number + missed-call text-back
- bss-013 Calendar, booking, confirmations & reminders
- bss-014* Build 8 core pages (desktop + mobile)
- bss-015* Build 2 webinar pages (registration + thank-you)
- bss-016* Update partner pages
- bss-017 VSL placeholder slot (VSL itself is an excluded add-on)
- bss-018 Wire all forms / booking buttons / chat widget into GHL
- bss-019 Two-way SMS + email + consent capture
- bss-020 Connect Instagram + Facebook messaging, tag by channel
- bss-021 YouTube trackable lead links + posting

**Testing (5)** — Week 6 prep
- bss-022 Test call-booked sequence
- bss-023 Test new-lead warm-up (6 emails + texts)
- bss-024 Test AI lead agent (qualify → CRM → book, across channels)
- bss-025 Test reactivation + no-show / quiet-lead follow-up
- bss-026 End-to-end journey test (forms → pipeline → dashboard)

**Go-Live (8)** — Week 6
- bss-027* Launch core website on Fin's domain (agreed day)
- bss-028 Lead nurture sequence live
- bss-029 Call-booked sequence live
- bss-030 AI lead agent live (chat / text / IG / FB)
- bss-031 Reactivation text campaign live
- bss-032 Missed-call text-back + two-way messaging live
- bss-033 Pipeline auto-moves + stop-on-reply/book live
- bss-034 Leads / bookings / conversions dashboard live

**Post-Launch (7)** — Weeks 7–10 + Months 2–8
- bss-035 Partner / referral tracking live
- bss-036 Weekly webinar system live
- bss-037* Client onboarding flow live (payment-triggered → portal + coach handover)
- bss-038* Deliver walkthrough + written guide
- bss-039 Review real leads + AI conversations; tune
- bss-040 Follow-up after sales calls (no-show / nurture / unpaid-invoice)
- bss-041* Ongoing support through month 8

## How this differs from the portal's current BSS

On the portal side today, `bss` runs the **Scale journey, Meta-only** (task ids
`ob-…`, `bd-…`, `ts-…`, `gl-…`, `pl-…`). The CSM side does **not** reuse those
ids — it has its own custom `bss-001 … bss-041` set drawn from the agreement, far
closer to Fin's actual scope than the Scale template.

So the two apps currently describe BSS with **different task sets and different
ids**. That's fine for now, but it has consequences the portal session should
weigh:

## Decisions / open questions for the portal side

1. **Deep-linking won't line up yet.** The CSM side chose standalone `bss-…` ids
   precisely because the portal's BSS currently runs Scale ids — there was
   nothing to mirror. If we want CSM tasks to deep-link to
   `/portal/<token>?task=<id>`, the portal needs its **own BSS template whose ids
   match `bss-001 … bss-041`** (or a mapping table between the two). Right now a
   CSM `bss-014` has no matching portal task.
2. **Does the portal want to adopt this 41-task custom journey?** If BSS should
   show Fin the real scope (not the Scale journey), these 41 tasks / 9 categories
   / 5 stages are the agreed delivery plan. The 12 starred tasks are the intended
   client-facing set. Reusing them on the portal would make both apps tell Fin
   the same story.
3. **Voice interview.** CSM `bss-001` is the intake interview and is ready to
   hold the transcript as its note (CSM notes have no 12k limit issue). If the
   importer/sync writes the portal's interview transcript back to the CSM task,
   it should target `bss-001`.
4. **Naming is settled:** product "BSS", client "Fin Creighton / Bitcoin Success
   School". Spelling confirmed CREIGHTON on both sides.

## Status / not yet done

- The **Live** BSS client for the real engagement is **not** created yet — only a
  demo walkthrough client exists (`bss-fin-creighton-demo`). Jesse creates the
  real Fin client via admin "New client" on the BSS tab in Live when he's ready
  to send the portal link.
- No importer path provisions a `bss` client automatically yet (same as the
  portal note: only admin creates one; GHL product mapping untouched).
