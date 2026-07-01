# Client Portal Task Condensation Report
**Scope:** Scale product, **Meta-only variant** (this is Chris McBreen's configuration — Google Ads categories are deliberately excluded throughout this report).
**Source:** `scale-northlane-health` demo client task set, `.wrangler` local D1 database, `tasks` table.
**Purpose:** Identify which of the raw internal task-checklist items should surface to the client, and collapse repetitive micro-steps into the real, human-sized milestones a client portal should show.

---

## How to read this report

For each of the 5 client-facing stages (Support is intentionally excluded — see note at the end):

- **Raw tasks** = everything in the CSM system for that phase, meta-variant only.
- **Client milestone** = the condensed, plain-English action or status card we recommend showing in the portal.
- Under each milestone, the **raw task titles it replaces** are listed, so you can trace exactly which checklist items collapse into it.
- 🚩 flags a task that is currently `portal_visible = true` in the database but reads like an internal staff instruction, not a client-facing message. These are the main source of the "Instruct the client to..." phrasing leaking onto the portal. Recommend either turning `portal_visible` off, or rewriting `portal_title` before shipping.

---

## Stage 1 — Onboarding (Days 1–2)

**42 raw tasks → 8 client milestones + 1 informational notice**

### Client milestones

**1. Complete your onboarding form**
_(Business info, proof of address, phone/appointment options, domain & website access, ICP, branding/logos)_
- Check that the client has submitted the onboarding form in LaunchBay
- Check that the client has submitted the onboarding form in CSM platform
- Review the submitted onboard form with the client: Business Info, Proof of Address, Phone Options, Appointment Options, Domain Access, Website Access, ICP, and Branding/Logos

**2. Attend your Welcome Call & portal walkthrough**
- Start the Welcome Onboard call and present the Scale Onboarding Slide Deck
- Have the client log into LaunchBay live while sharing their screen on the call
- Walk the client through LaunchBay project milestones, tasks, and the messaging center
- 🚩 Copy the "Magic Link" from the Users tab in LaunchBay and provide it to the client
- 🚩 Instruct the client to bookmark their LaunchBay Magic Link → rewrite as: *"Bookmark your portal link"*
- 🚩 Ask the client to send a test message on the onboarding form task in LaunchBay → rewrite as: *"Send a test message in your portal"*

**3. Review & approve your AI receptionist's qualification questions**
- Ask the client: "If your agent was a human, how would you train her to talk with leads?"
- Determine their exact pre-qualification questions
- Get verbal approval from the client on the AI questions
- 🚩 Document these exact questions in the Client Artifact document *(internal — should not be visible)*
- 🚩 Change the approved AI question text to GREEN BOLD *(internal formatting — should not be visible)*
- 🚩 Add a comment "approved by Client" *(internal — should not be visible)*

**4. Download the mobile app**
- Instruct the client to download the LeadConnector Mobile App

**5. Review your SMS/Email message copy**
- Client Review of SMS/Email Copy

**6. Connect your calendar, social accounts & payment method**
- Have client connect their Calendar, Social Media DMs, and set up a Payment Mechanism in their CRM settings

**7. Upload your past leads (CSV)**
- Instruct the client to prepare and upload a CSV database of their past leads and lost quotes

**8. Grant access to your accounts**
⚠️ **Variant flag:** this raw task bundles Google-specific asks (Google Ads Manager, Google Analytics) with Meta-relevant ones (Google My Business, domain, website). It lives in a general "Admin" category, so it wasn't filtered out by the Meta/Google category split. **For Chris McBreen (Meta-only), drop the Google Ads Manager / Analytics asks** — keep Google My Business (used for local presence regardless of ad platform), domain, and website builder access.
- Chase the client to provide admin access to Google Ads Manager, Google Analytics, and Google My Business Profile *(trim to GMB only for Meta clients)*
- Chase the client to provide Domain Provider Access and Website Builder Access

### Informational notice (not an action item)
- "Your project timeline: Days 2–13 Build, Day 14 AI Test, Day 30 Go-Live"
- "Heads up — your subscription fees begin 14–30 days from purchase" (currently `portal_visible = true`; recommend a passive banner, not a checklist item)

### Purely internal — correctly stays hidden (9 tasks)
Gmail/Slack/GHL login routine, GHL note-formatting conventions, GHL task-naming conventions, backend "Accounts" monitoring, recap-message posting to the dev team.

---

## Stage 2 — Build (Days 2–13)

**106 raw tasks (Meta-only) → 4 real actions + 2 status cards**

This is your densest phase — ~100 of the 106 tasks are RT Digital executing internal build work (writing eBook copy, designing pages in Gamma, configuring the AI bot in CloseBot). The client should see almost none of the mechanics — just the approval checkpoints and one big "we're building" status card.

**1. Review & approve your eBook lead magnet content** (Days 2–8)
- Send the Google Doc link to the client via LaunchBay for their review and approval
- Wait for client approval on the text
- (Everything else in this cluster — ChatGPT drafting, testimonial pulling, Gamma page design, Switchy shortlinking — is internal execution. ~30 raw tasks, zero further client involvement needed.)

**2. Approve your Meta ad campaigns & creative assets** (Days 5–12)
- Send the completed strategy doc and creatives to the client for final approval
- (Strategy doc drafting, audience targeting, ad copy, lead-form design, creative production are internal — ~8 raw tasks)

**3. Grant RT Digital partner access to your Meta Business Suite** (Days 5–12)
- 🚩 Instruct the client to add RT Digital as a "Partner" in their Meta Business Suite → rewrite as: *"Add RT Digital as a Partner in Meta Business Suite"*
- 🚩 Send the client the Scribe guide: "How to Add RT Digital as a Partner" *(keep as a supporting link inside milestone #3, not a separate task)*
- 🚩 Provide the client with the RT Digital Business ID to enter
- (Asset assignment — Facebook Page, Ad Account, Instagram permissions — is internal, done once access is granted. ~12 raw tasks)

**4. Watch your ad campaign walkthrough video** (Days 5–12)
- 🚩 Record a Loom video walking the client through their new live ad campaigns *(the recording itself is internal — the client action is watching it)*
- Post the Loom video link in the LaunchBay messaging center for the client

**5. Status card — "Your AI receptionist is being configured"** (Days 8–13, no client action)
- ~20 raw tasks: CloseBot cloning, persona/tone setup, knowledgebase upload, calendar routing logic. All internal. Show as a progress indicator only.

**6. Status card — "Your CRM access is being set up"**
- 🚩 Add the client as a user in GHL with strictly limited permissions *(the setup is internal; the client simply receives access — no action required from them)*

---

## Stage 3 — Testing (Day 14)

**20 raw tasks (Meta-only) → 4 client milestones**

**1. Confirm your connections are working**
- 🚩 On the call, confirm the client has downloaded the LeadConnector App on their phone
- 🚩 Confirm their calendar is connected and user availability/timezone is correct
- 🚩 Confirm social media DMs are connected
- 🚩 Confirm a call to the client's number rings their LeadConnector mobile app
_(all four are staff-verification phrasing — rewrite as a single client-facing checklist: "Confirm your app, calendar & social accounts are connected")_

**2. Test your AI receptionist live**
- 🚩 Send the client the link to the AI testing environment funnel
- 🚩 Instruct the client to live-chat and speak with the agent
- 🚩 Tell the client to pretend to be different personas (price shopper, emergency, browsing) to try and stump the bot
- 🚩 Collect actionable feedback from the client during the test

**3. Status card — "We're fine-tuning based on your feedback"** (no client action)
- Document the feedback in GHL notes and via Read.ai *(internal)*
- Post the feedback in LaunchBay for the AISS Dev Team *(internal)*
- Update the CloseBot/snapshot configuration based on the feedback *(internal)*

**4. Your Go-Live Call is scheduled**
- 🚩 Schedule the "Go Live Call" for Day 30

### Purely internal — correctly hidden (5 tasks)
Final build check, GHL funnel navigation, self-testing live chat/voice, developer escalation on failure, email signature confirmation.

---

## Stage 4 — Go-Live (Day 30)

**32 raw tasks (Meta-only) → 5 client milestones**

**1. Attend your Go-Live walkthrough call**
- 🚩 On the call, frame the session: explain the goal is simplicity and getting the team confident using the live system

**2. Learn your live system**
- 🚩 Have the client open the live app URL
- 🚩 Walk the client through the LeadConnector app features
- 🚩 Show them how to make and receive calls
- 🚩 Show them how to handle missed calls
_(Show Contacts / SMS / conversations / push notifications are internal walkthrough detail, folded into this one milestone rather than listed separately)_

**3. See your AI in action**
- 🚩 Demo the AI Summaries (call transcripts, notes, follow-up suggestions)
- 🚩 Demo the AI Coaching Notes (call scoring, insights)
- 🚩 Demo the AI answering a missed call
- 🚩 Submit a live test webform or FB/IG DM to demo an inbound lead
_(pipeline-card-movement and auto-nurture demo steps are internal detail folded into this milestone)_

**4. Set your team's usage standards**
- 🚩 Establish team usage standards: all business calls must go through the app, avoid personal mobiles, review summaries daily, reply from inside the app

**5. You're live — access your recording & support links**
- 🚩 Post-Call: Send a LaunchBay message confirming their system is live
- 🚩 Include the Read.ai call recording link in the message
- 🚩 Remind the client that SaaS fees have officially commenced *(informational banner, not a milestone)*

### Purely internal — correctly hidden (remaining ~14 tasks)
GHL automation activation, billing/auto-recharge thresholds, rebilling fee configuration.

---

## Stage 5 — Post-Launch (Ongoing / Weekly)

**30 raw tasks (Meta-only) → 2 client actions + 1 status card**

This phase is almost entirely RT Digital's **ongoing account management** — billing checks, weekly audits, support-ticket triage, internal reporting. Very little of it belongs on a client-facing checklist; most of it belongs in a "your account is being actively managed" reassurance card.

**1. Your Week 1 & Week 2 check-in calls**
- Conduct a 30-minute Zoom check-in during Week 1
- Conduct a 30-minute Zoom check-in during Week 2
- Transition to monthly client check-in calls *(ongoing cadence note)*

**2. Send us a testimonial**
- 🚩 Mark LaunchBay tasks "Client Satisfaction Call (Day 3)" and "Send A Testimonial (Day 5)" as completed *(the underlying client ask — "please send a testimonial" — isn't written as its own task anywhere; recommend adding one explicitly)*

**3. Status card — "Your account is being actively monitored"** (no client action)
- ~27 raw tasks: Stripe billing verification, Google Sheet fee tracking, Slack notifications to accounts, weekly GHL account audits, support-ticket diagnosis/escalation, Ads team hour allocation, CEO pipeline reporting. All internal.

---

## Summary table

| Stage | Day Range | Raw Tasks (Meta) | Client Milestones | Status-Only Cards |
|---|---|---|---|---|
| Onboarding | 1–2 | 42 | 8 | 1 (timeline/fees notice) |
| Build | 2–13 | 106 | 4 | 2 |
| Testing | 14 | 20 | 3 | 1 |
| Go-Live | 30 | 32 | 5 | 0 |
| Post-Launch | Ongoing | 30 | 2 | 1 |
| **Total** | **30 days** | **230** | **22** | **5** |

**230 raw tasks → 22 real client actions + 5 status cards.** That's the actual size of the client-facing journey once the internal execution noise is stripped out.

---

## Recommendations for the CSM backend

1. **Fix the 🚩 flagged tasks.** ~35 tasks across the 5 stages are `portal_visible = true` but written in staff-instruction voice ("Instruct the client to...", "Confirm..."). Either rewrite `portal_title` in second person, or fold them into a parent milestone (as done throughout this report) and turn `portal_visible` off on the sub-steps.
2. **Add `portal_title` to condense sub-steps.** Rather than deleting the granular internal tasks, the cleanest fix is: keep them for staff process tracking, but give the *parent concept* a single `portal_title` and only mark **one** representative task per milestone as `portal_visible`. The rest stay internal.
3. **Fix the Google/Meta variant leak in Onboarding task #47.** It's in a general "Admin" category so it wasn't caught by the existing meta/google category filter — it needs a manual per-task variant check, not just category-level filtering.
4. **Add a missing task:** there's no explicit "client sends a testimonial" ask in Post-Launch — only a "mark as completed" checklist item. Worth adding a real task for it.
5. **Support phase:** keep all 14 Support-phase tasks in the system as-is, but do not surface them in the standard portal journey. Recommend a hidden admin toggle that reveals a "pause/cancel" flow only if a client initiates an exit — this matches how you described wanting to handle it.

---

## Next steps

- **Option A:** Hand this report to the CSM project's Claude Code session (`CSM Project UI/UX improvement plan`) and have it apply the `portal_title`/`portal_visible` fixes directly to the 310-task database, using the milestone groupings above as the spec.
- **Option B:** Use this report as your own manual editing checklist in the CSM admin UI.
- **Either way:** once the CSM task set reflects this structure, the client portal (this project) can pull a clean, pre-condensed milestone list instead of needing further filtering logic on the portal side.
