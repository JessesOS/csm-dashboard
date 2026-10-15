import type { Category, Task } from "./types";

// BSS Fin Creighton — custom delivery template for Bitcoin Success School, RT
// Digital's first signed client. Not derived from Scale/Respond; the task list
// is drawn directly from the signed Scope & Agreement v2 (2026-10-14):
// https://bss-agreement.vercel.app/ — ~6 weeks core delivery, partner/webinar/
// onboarding by ~week 10, refine & support through month 8. 41 tasks across the
// standard five stages. Portal-visible tasks (portalVisible: true) are the ones
// Fin sees in his customer-journey portal.
export const bssSourceDocument = {
  title: "Bitcoin Success School — Scope & Agreement v2 (2026-10-14)",
  url: "https://bss-agreement.vercel.app/",
};

export const bssTeamMembers = [
  "Unassigned",
  "Jesse Allan",
  "RT Digital",
];

export const bssCategories: Category[] = [
  { id: "bss-intake", name: "Intake & Kick-off", phase: "Onboarding", accent: "#0f766e" },
  { id: "bss-discovery", name: "Mapping & Audit", phase: "Onboarding", accent: "#0891b2" },
  { id: "bss-crm", name: "CRM Build", phase: "Build", accent: "#4f46e5" },
  { id: "bss-website", name: "Website Build", phase: "Build", accent: "#7c3aed" },
  { id: "bss-connect", name: "Channel Connections", phase: "Build", accent: "#ea580c" },
  { id: "bss-testing", name: "Testing & QA", phase: "Testing", accent: "#ca8a04" },
  { id: "bss-golive", name: "Launch & Automate", phase: "Go-Live", accent: "#059669" },
  { id: "bss-partners", name: "Partners, Webinar & Onboarding", phase: "Post-Launch", accent: "#0284c7" },
  { id: "bss-support", name: "Refine & Support", phase: "Post-Launch", accent: "#0d9488" },
];

const categoryMap = new Map(bssCategories.map((category) => [category.id, category]));

function task(
  idNumber: number,
  categoryId: string,
  title: string,
  options: Partial<Omit<Task, "id" | "category" | "phase" | "title" | "sortOrder">> = {}
): Task {
  const category = categoryMap.get(categoryId);

  if (!category) {
    throw new Error(`Unknown category ${categoryId}`);
  }

  return {
    id: `bss-${String(idNumber).padStart(3, "0")}`,
    title,
    category: category.name,
    phase: category.phase,
    status: options.status ?? "queued",
    blockedReason: options.blockedReason ?? "",
    assignee: options.assignee ?? "Unassigned",
    dueWindow: options.dueWindow ?? "",
    priority: options.priority ?? "normal",
    dependencies: options.dependencies ?? [],
    notes: options.notes ?? "",
    portalVisible: options.portalVisible ?? false,
    portalTitle: options.portalTitle ?? "",
    portalNote: options.portalNote ?? "",
    portalActionRequired: options.portalActionRequired ?? false,
    portalActionUrl: options.portalActionUrl ?? "",
    portalActionLabel: options.portalActionLabel ?? "",
    portalConfigured: options.portalConfigured ?? false,
    sortOrder: idNumber,
  };
}

export const bssSeedTasks: Task[] = [
  // ── Onboarding (Weeks 1–2: onboard, map & evaluate) ──────────────────────
  task(1, "bss-intake", "Voice interview — intake", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 1-2",
    priority: "high",
    portalVisible: true,
    portalConfigured: true,
    portalTitle: "Your intake interview",
    portalNote: "Answer a few short questions so we can tailor the CRM, website, and AI agent to your business. Your answers are saved here.",
    portalActionRequired: true,
    notes: "Mirrors the portal's first task (voice interview). The transcript is saved as this task's note once completed.",
  }),
  task(2, "bss-intake", "Portal setup & kick-off call", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 1-2",
    priority: "high",
    portalVisible: true,
    portalConfigured: true,
    portalTitle: "Kick-off call & portal walkthrough",
    portalNote: "We'll set you up in the portal, walk the journey, and agree next steps.",
  }),
  task(3, "bss-intake", "Collect access — CRM, GHL, Cal.com, domain, hosting, socials", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 1-2",
    priority: "high",
    dependencies: ["bss-002"],
    portalVisible: true,
    portalConfigured: true,
    portalTitle: "Share your access",
    portalNote: "Give us access to your existing CRM, GoHighLevel sub-account, Cal.com (admin), domain, hosting, and social accounts.",
    portalActionRequired: true,
    notes: "Client responsibility per the agreement: CRM, GHL sub-account, Cal.com admin, domain, hosting, socials.",
  }),
  task(4, "bss-discovery", "Map & agree the customer journey (before any build)", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 1-2",
    priority: "high",
    dependencies: ["bss-003"],
    notes: "Customer journey mapped end to end and agreed with the client before build starts.",
  }),
  task(5, "bss-discovery", "Audit current CRM + GHL sub-account → written findings", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 1-2",
    dependencies: ["bss-003"],
    notes: "Audit the existing custom CRM and GHL sub-account. Written findings: keep / migrate / replace, and whether the sub-account can be reused.",
  }),
  task(6, "bss-discovery", "Map all current enquiry channels", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 1-2",
    dependencies: ["bss-003"],
  }),
  task(7, "bss-discovery", "Map partner / payment / webinar / Cal.com setup", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 1-2",
    dependencies: ["bss-003"],
    notes: "Map the current partner, commission and payout setup; the payment method taken after sales calls; the webinar platform; and Cal.com.",
  }),

  // ── Build (Weeks 2–5: CRM, website, connect) ─────────────────────────────
  task(8, "bss-crm", "Install & configure the GHL snapshot", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 2-4",
    priority: "high",
    dependencies: ["bss-005"],
  }),
  task(9, "bss-crm", "Set up pipeline stages, tags & custom fields", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 2-4",
    dependencies: ["bss-008"],
  }),
  task(10, "bss-crm", "Migrate, clean, de-dupe & tag contacts by source", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 2-4",
    dependencies: ["bss-008"],
  }),
  task(11, "bss-crm", "Create smart lists + lead score (hot / warm / cold)", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 2-4",
    dependencies: ["bss-009", "bss-010"],
  }),
  task(12, "bss-crm", "Set up business phone number + missed-call text-back", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 2-4",
    dependencies: ["bss-008"],
  }),
  task(13, "bss-crm", "Set up calendar, booking, confirmations & reminders", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 2-4",
    dependencies: ["bss-008"],
    notes: "Connected to Cal.com without duplicate reminders; needs Cal.com admin access.",
  }),
  task(14, "bss-website", "Build 8 core pages (desktop + mobile)", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 2-4",
    priority: "high",
    dependencies: ["bss-004"],
    portalVisible: true,
    portalConfigured: true,
    portalTitle: "Your new website — core pages",
    portalNote: "Home, About, Podcast & socials, Book a call, Call booked, Not-qualified, Link-in-bio, Privacy. Two rounds of changes included.",
    notes: "Keep existing copy, claims, offers and guarantee unchanged unless the client approves a change. 2 revision rounds on core pages.",
  }),
  task(15, "bss-website", "Build 2 webinar pages (registration + thank-you)", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 2-4",
    dependencies: ["bss-004"],
    portalVisible: true,
    portalConfigured: true,
    portalTitle: "Webinar pages",
    portalNote: "Registration and thank-you pages. Three rounds of changes included.",
  }),
  task(16, "bss-website", "Update partner pages", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 2-4",
    dependencies: ["bss-007"],
    portalVisible: true,
    portalConfigured: true,
    portalTitle: "Partner pages",
    portalNote: "Exact pages confirmed in the first two weeks. Two rounds of changes included.",
  }),
  task(17, "bss-website", "Add VSL placeholder slot", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 2-4",
    priority: "low",
    dependencies: ["bss-014"],
    notes: "Placeholder slot only — the VSL itself is an excluded add-on.",
  }),
  task(18, "bss-website", "Wire all forms, booking buttons & chat widget into GHL", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 2-4",
    priority: "high",
    dependencies: ["bss-014", "bss-009"],
  }),
  task(19, "bss-connect", "Two-way SMS + email + consent capture", {
    assignee: "Jesse Allan",
    dueWindow: "Week 5",
    dependencies: ["bss-012", "bss-018"],
    notes: "Enable two-way SMS and email plus missed-call text-back; capture phone numbers and text consent on sign-up forms.",
  }),
  task(20, "bss-connect", "Connect Instagram + Facebook messaging, tag by channel", {
    assignee: "Jesse Allan",
    dueWindow: "Week 5",
    dependencies: ["bss-018"],
  }),
  task(21, "bss-connect", "YouTube trackable lead links + posting", {
    assignee: "Jesse Allan",
    dueWindow: "Week 5",
    priority: "low",
    dependencies: ["bss-018"],
  }),

  // ── Testing (Week 6 prep: QA before go-live) ─────────────────────────────
  task(22, "bss-testing", "Test call-booked sequence", {
    assignee: "Jesse Allan",
    dueWindow: "Week 6",
    priority: "high",
    dependencies: ["bss-013", "bss-018"],
    notes: "5-day booking window, short-notice bookings, reschedules and cancellations, no duplicate Cal.com reminders.",
  }),
  task(23, "bss-testing", "Test new-lead warm-up (6 emails + texts)", {
    assignee: "Jesse Allan",
    dueWindow: "Week 6",
    priority: "high",
    dependencies: ["bss-018"],
    notes: "Six emails drafted with the client and approved before going live, plus matching text follow-ups. Stops on reply / book / becomes a client.",
  }),
  task(24, "bss-testing", "Test AI lead agent (qualify → CRM → book, across channels)", {
    assignee: "Jesse Allan",
    dueWindow: "Week 6",
    priority: "high",
    dependencies: ["bss-018", "bss-009"],
    notes: "Qualifies with the booking form's questions, writes answers to the CRM, books Clarity Calls. Runs on chat widget, text, Instagram and Facebook. Knowledge base built only from approved wording.",
  }),
  task(25, "bss-testing", "Test reactivation + no-show / quiet-lead follow-up", {
    assignee: "Jesse Allan",
    dueWindow: "Week 6",
    dependencies: ["bss-010"],
  }),
  task(26, "bss-testing", "End-to-end journey test (forms → pipeline → dashboard)", {
    assignee: "Jesse Allan",
    dueWindow: "Week 6",
    priority: "high",
    dependencies: ["bss-022", "bss-023", "bss-024"],
  }),

  // ── Go-Live (Week 6: automate & launch) ──────────────────────────────────
  task(27, "bss-golive", "Launch core website on Fin's domain (agreed day)", {
    assignee: "Jesse Allan",
    dueWindow: "Week 6",
    priority: "high",
    dependencies: ["bss-014", "bss-018", "bss-026"],
    portalVisible: true,
    portalConfigured: true,
    portalTitle: "Website launch",
    portalNote: "We launch on your domain on an agreed day.",
  }),
  task(28, "bss-golive", "Lead nurture sequence live", {
    assignee: "Jesse Allan",
    dueWindow: "Week 6",
    priority: "high",
    dependencies: ["bss-023"],
  }),
  task(29, "bss-golive", "Call-booked sequence live", {
    assignee: "Jesse Allan",
    dueWindow: "Week 6",
    priority: "high",
    dependencies: ["bss-022"],
  }),
  task(30, "bss-golive", "AI lead agent live (chat / text / IG / FB)", {
    assignee: "Jesse Allan",
    dueWindow: "Week 6",
    priority: "high",
    dependencies: ["bss-024"],
  }),
  task(31, "bss-golive", "Reactivation text campaign live", {
    assignee: "Jesse Allan",
    dueWindow: "Week 6",
    dependencies: ["bss-025"],
    notes: "Past contacts with existing consent only.",
  }),
  task(32, "bss-golive", "Missed-call text-back + two-way messaging live", {
    assignee: "Jesse Allan",
    dueWindow: "Week 6",
    dependencies: ["bss-019"],
  }),
  task(33, "bss-golive", "Pipeline auto-moves + stop-on-reply/book live", {
    assignee: "Jesse Allan",
    dueWindow: "Week 6",
    dependencies: ["bss-009"],
  }),
  task(34, "bss-golive", "Leads / bookings / conversions dashboard live", {
    assignee: "Jesse Allan",
    dueWindow: "Week 6",
    dependencies: ["bss-009"],
  }),

  // ── Post-Launch (Weeks 7–10 + Months 2–8) ────────────────────────────────
  task(35, "bss-partners", "Partner / referral tracking live", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 7-10",
    dependencies: ["bss-016"],
    notes: "Referral source recorded on each contact from partner link through to payment; reporting on which partners bring paying clients.",
  }),
  task(36, "bss-partners", "Weekly webinar system live", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 7-10",
    dependencies: ["bss-015"],
    notes: "Registration confirmation + daily lead-up, 3–4 days of follow-up after each webinar, tailored to attendees vs no-shows, repeatable weekly. Depends on the webinar platform reporting attendance to GHL.",
  }),
  task(37, "bss-partners", "Client onboarding flow live", {
    assignee: "Jesse Allan",
    dueWindow: "Weeks 7-10",
    dependencies: ["bss-027"],
    portalVisible: true,
    portalConfigured: true,
    portalTitle: "Client onboarding flow",
    portalNote: "Triggered when payment is confirmed; linked to the portal and the implementation coach handover.",
  }),
  task(38, "bss-support", "Deliver walkthrough + written guide", {
    assignee: "Jesse Allan",
    dueWindow: "Months 2-8",
    dependencies: ["bss-027"],
    portalVisible: true,
    portalConfigured: true,
    portalTitle: "Your walkthrough & guide",
    portalNote: "A live walkthrough plus a short written guide to running everything.",
  }),
  task(39, "bss-support", "Review real leads + AI conversations; tune what isn't working", {
    assignee: "Jesse Allan",
    dueWindow: "Months 2-8",
    dependencies: ["bss-030"],
  }),
  task(40, "bss-support", "Follow-up after sales calls (no-show / nurture / unpaid-invoice)", {
    assignee: "Jesse Allan",
    dueWindow: "Months 2-8",
    dependencies: ["bss-029"],
    notes: "Depends on how payment is taken, confirmed in the first two weeks.",
  }),
  task(41, "bss-support", "Ongoing support through month 8", {
    assignee: "Jesse Allan",
    dueWindow: "Months 2-8",
    priority: "low",
    portalVisible: true,
    portalConfigured: true,
    portalTitle: "Ongoing support",
    portalNote: "We review and support through month 8.",
  }),
];
