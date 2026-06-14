import type { Category, Task } from "./types";

export const scaleSourceDocument = {
  "title": "Full List Of Tasks - Scale CSM Comprehensive Operational Workflow Manual",
  "url": "https://docs.google.com/document/d/1KJZdPO2NkB9w67_stgykSrBSr6hVqeA32Tvihp439yg/edit?usp=drive_link"
};

export const scaleCategories: Category[] = [
  {
    "id": "scale-01-comms-admin-communication-routines",
    "name": "Comms, Admin & Communication Routines",
    "phase": "Onboarding",
    "accent": "#0891b2"
  },
  {
    "id": "scale-02-pre-onboarding-welcome-call",
    "name": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "accent": "#0f766e"
  },
  {
    "id": "scale-03-meta-ads-strategy-ebook-creation-gamma-chatgpt-switc",
    "name": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "accent": "#7c3aed"
  },
  {
    "id": "scale-04-meta-ads-setup-handoff-partner-access",
    "name": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "accent": "#2563eb"
  },
  {
    "id": "scale-05-google-ads-strategy-landing-page-funnel-creation",
    "name": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "accent": "#0284c7"
  },
  {
    "id": "scale-06-ai-bot-build-ghl-configuration",
    "name": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "accent": "#4f46e5"
  },
  {
    "id": "scale-07-ai-test-call-final-checks-day-14",
    "name": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "accent": "#ca8a04"
  },
  {
    "id": "scale-08-go-live-call-day-30",
    "name": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "accent": "#059669"
  },
  {
    "id": "scale-09-post-go-live-check-ins-reporting-admin",
    "name": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "accent": "#0d9488"
  },
  {
    "id": "scale-10-exit-pause-cancellation-protocol",
    "name": "Exit, Pause, & Cancellation Protocol",
    "phase": "Support",
    "accent": "#64748b"
  }
];

export const scaleTeamMembers = [
  "Unassigned",
  "Scale CSM",
  "Account Manager",
  "Creative Strategist",
  "Ads Team",
  "Automation Specialist",
  "Voice AI Specialist",
  "Support Lead",
  "Accounts - Sandy",
  "Joseph",
  "Rich"
];

export const scaleTasks: Task[] = [
  {
    "id": "scl-001",
    "title": "Log into the Gmail, check emails.",
    "category": "Comms, Admin & Communication Routines",
    "phase": "Onboarding",
    "status": "complete",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 1
  },
  {
    "id": "scl-002",
    "title": "Log into the RTDigital Agency Slack to check Slack comms, multiple channels and DM's daily.",
    "category": "Comms, Admin & Communication Routines",
    "phase": "Onboarding",
    "status": "complete",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-001"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 2
  },
  {
    "id": "scl-003",
    "title": "Log into the GoHighLevel (GHL) Agency View -> RT Digital sub-account. Contacts, Scott Lambert Check comms with client. Message replies etc. Also, check clients sub account comms.",
    "category": "Comms, Admin & Communication Routines",
    "phase": "Onboarding",
    "status": "complete",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-002"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 3
  },
  {
    "id": "scl-004",
    "title": "Use GHL as the mandatory primary platform for all client communication.",
    "category": "Comms, Admin & Communication Routines",
    "phase": "Onboarding",
    "status": "complete",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-003"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 4
  },
  {
    "id": "scl-005",
    "title": "Leave an 'internal comment' on the GHL contact record for every single client interaction.",
    "category": "Comms, Admin & Communication Routines",
    "phase": "Onboarding",
    "status": "review",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-004"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 5
  },
  {
    "id": "scl-006",
    "title": "Format every GHL note strictly as: Date - Reason for follow-up or communication - Team member name (e.g., \"May 19, 2026 - Followed up regarding website revisions - John\").",
    "category": "Comms, Admin & Communication Routines",
    "phase": "Onboarding",
    "status": "review",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-005"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 6
  },
  {
    "id": "scl-007",
    "title": "Create a task inside GHL attached to the client's contact record for any new project build or support request.",
    "category": "Comms, Admin & Communication Routines",
    "phase": "Onboarding",
    "status": "in_progress",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-006"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 7
  },
  {
    "id": "scl-008",
    "title": "Name every GHL task strictly using the convention: Client Business Name | Task Description.",
    "category": "Comms, Admin & Communication Routines",
    "phase": "Onboarding",
    "status": "in_progress",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-007"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 8
  },
  {
    "id": "scl-009",
    "title": "Monitor the backend \"Accounts\" progress in LaunchBay.",
    "category": "Comms, Admin & Communication Routines",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-008"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 9
  },
  {
    "id": "scl-010",
    "title": "Verify \"Setup Fee Invoices Created and Sent\" is marked completed in LaunchBay.",
    "category": "Comms, Admin & Communication Routines",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-009"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 10
  },
  {
    "id": "scl-011",
    "title": "Verify \"Setup Fee Paid and Reconciled\" is marked completed in LaunchBay.",
    "category": "Comms, Admin & Communication Routines",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-010"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 11
  },
  {
    "id": "scl-012",
    "title": "Check that \"SaaS Fees Are Activated\" in LaunchBay.",
    "category": "Comms, Admin & Communication Routines",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-011"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 12
  },
  {
    "id": "scl-013",
    "title": "Verify \"Recurring Invoices Setup/Auto/Reconciled\" is marked completed in LaunchBay.",
    "category": "Comms, Admin & Communication Routines",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-012"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 13
  },
  {
    "id": "scl-014",
    "title": "Verify \"Client Payments\" in LaunchBay.",
    "category": "Comms, Admin & Communication Routines",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-013"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 14
  },
  {
    "id": "scl-015",
    "title": "Verify the automated Zapier trigger deployed the correct LaunchBay project template upon the deal closing.",
    "category": "Comms, Admin & Communication Routines",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-014"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 15
  },
  {
    "id": "scl-016",
    "title": "Verify the automated Zapier trigger sent the welcome email with the LaunchBay form to the client.",
    "category": "Comms, Admin & Communication Routines",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-015"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 16
  },
  {
    "id": "scl-017",
    "title": "Set up a Zapier automation connecting the client's LaunchBay project with their Slack channel to sync task notifications in real-time.",
    "category": "Comms, Admin & Communication Routines",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-016"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 17
  },
  {
    "id": "scl-018",
    "title": "Check that the client has submitted the onboarding form in LaunchBay.",
    "category": "Comms, Admin & Communication Routines",
    "phase": "Onboarding",
    "status": "blocked",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-017"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 18
  },
  {
    "id": "scl-019",
    "title": "Verify the Sales Team closed the deal, left the opportunity in the Sales Person Pipeline, and booked the Welcome Onboard Call.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 19
  },
  {
    "id": "scl-020",
    "title": "Update the automation that sends the welcome email to ensure the messaging is accurate.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-019"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 20
  },
  {
    "id": "scl-021",
    "title": "Follow up with the new client via GHL SMS or Email to introduce yourself before the Welcome Call.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-020"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 21
  },
  {
    "id": "scl-022",
    "title": "Create a copy of the \"AISS Client Artifact Template\" and save it under the client's name for note-taking.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-021"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 22
  },
  {
    "id": "scl-023",
    "title": "Start the Welcome Onboard call and present the Scale Onboarding Slide Deck (Gamma TAI-Scale-Onboard).",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-022"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 23
  },
  {
    "id": "scl-024",
    "title": "Have the client log into LaunchBay live while sharing their screen on the call.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-023"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 24
  },
  {
    "id": "scl-025",
    "title": "Copy the \"Magic Link\" from the Users tab in LaunchBay and provide it to the client.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-024"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 25
  },
  {
    "id": "scl-026",
    "title": "Instruct the client to bookmark their LaunchBay Magic Link.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-025"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 26
  },
  {
    "id": "scl-027",
    "title": "Walk the client through LaunchBay project milestones, tasks, and the messaging center.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-026"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 27
  },
  {
    "id": "scl-028",
    "title": "Ask the client to send a test message on the onboarding form task in LaunchBay to confirm they understand the system.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-027"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 28
  },
  {
    "id": "scl-029",
    "title": "Review the submitted onboard form with the client: Business Info, Proof of Address, Phone Options, Appointment Options, Domain Access, Website Access, ICP, and Branding/Logos.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-028"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 29
  },
  {
    "id": "scl-030",
    "title": "Ask the client: \"If your agent was a human, how would you train her to talk with leads?\"",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-029"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 30
  },
  {
    "id": "scl-031",
    "title": "Determine their exact pre-qualification questions (e.g., Service type, emergency status, name/email/phone, address, budget).",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "blocked",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-030"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 31
  },
  {
    "id": "scl-032",
    "title": "Document these exact questions in the Client Artifact document.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-031"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 32
  },
  {
    "id": "scl-033",
    "title": "Get verbal approval from the client on the AI questions.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-032"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 33
  },
  {
    "id": "scl-034",
    "title": "Change the approved AI question text to GREEN BOLD in the Client Artifact document.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-033"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 34
  },
  {
    "id": "scl-035",
    "title": "Add a comment \"approved by Client\" to the GREEN BOLD text.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-034"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 35
  },
  {
    "id": "scl-036",
    "title": "Explain the project timeline: Days 2-13 Build, Day 14 AI Test, Day 30 Go Live.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "critical",
    "dependencies": [
      "scl-035"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 36
  },
  {
    "id": "scl-037",
    "title": "Warn the client that SaaS fees start ticking 14-30 days from the point of sale.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-036"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 37
  },
  {
    "id": "scl-038",
    "title": "Instruct the client to download the LeadConnector Mobile App.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-037"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 38
  },
  {
    "id": "scl-039",
    "title": "Client Review of SMS/Email Copy",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-038"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 39
  },
  {
    "id": "scl-040",
    "title": "Have client connect their Calendar, Social Media DMs, and set up a Payment Mechanism in their CRM settings.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-039"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 40
  },
  {
    "id": "scl-041",
    "title": "Instruct the client to prepare and upload a CSV database of their past leads and lost quotes.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-040"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 41
  },
  {
    "id": "scl-042",
    "title": "Schedule the \"AI Test Call\" for Day 14 in the GHL calendar.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-041"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 42
  },
  {
    "id": "scl-043",
    "title": "Post a recap message in LaunchBay tagging the client and Dev Team.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-042"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 43
  },
  {
    "id": "scl-044",
    "title": "Paste the LaunchBay Magic Link into the recap message.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-043"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 44
  },
  {
    "id": "scl-045",
    "title": "Paste the Read.ai call recording link into the recap message.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-044"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 45
  },
  {
    "id": "scl-046",
    "title": "Write a bulleted list of any missing Action Items in the recap message.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "normal",
    "dependencies": [
      "scl-045"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 46
  },
  {
    "id": "scl-047",
    "title": "Chase the client to provide admin access to Google Ads Manager, Google Analytics, and Google My Business Profile.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-046"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 47
  },
  {
    "id": "scl-048",
    "title": "Chase the client to provide Domain Provider Access and Website Builder Access.",
    "category": "Pre-Onboarding & Welcome Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-047"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 48
  },
  {
    "id": "scl-049",
    "title": "Review the client's onboard form to identify their key customer pain points.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 49
  },
  {
    "id": "scl-050",
    "title": "Start the eBook process, utilising ChatGPT and other tools. Open ChatGPT in a new tab.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-049"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 50
  },
  {
    "id": "scl-051",
    "title": "Provide ChatGPT with the prompt: \"There's two parts to our business... We want to create an eBook lead magnet titled... Can you help us?\"",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-050"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 51
  },
  {
    "id": "scl-052",
    "title": "Review the ChatGPT generated outline to ensure it covers the specific pain points requested by the client.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-051"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 52
  },
  {
    "id": "scl-053",
    "title": "Prompt ChatGPT to generate revisions until the outline meets standards.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-052"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 53
  },
  {
    "id": "scl-054",
    "title": "Prompt ChatGPT: \"eBook content draft that I can review and copy-paste.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-053"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 54
  },
  {
    "id": "scl-055",
    "title": "Open a new tab, navigate to Google.com, and search for the client's company name.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-054"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 55
  },
  {
    "id": "scl-056",
    "title": "Click on their Google Reviews.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-055"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 56
  },
  {
    "id": "scl-057",
    "title": "Locate the most relevant and recent 5-star client reviews.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-056"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 57
  },
  {
    "id": "scl-058",
    "title": "Copy and paste 3 to 5 of these client testimonials into the final section of the Google Doc draft.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-057"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 58
  },
  {
    "id": "scl-059",
    "title": "Upload or create the Google Doc in the client's assigned Google Drive folder.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-058"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 59
  },
  {
    "id": "scl-060",
    "title": "Send the Google Doc link to the client via LaunchBay for their review and approval.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-059"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 60
  },
  {
    "id": "scl-061",
    "title": "Wait for client approval on the text.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-060"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 61
  },
  {
    "id": "scl-062",
    "title": "Once approved, click \"File\" > \"Download\" > \"Microsoft Word (.docx)\" in Google Docs.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "blocked",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-061"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 62
  },
  {
    "id": "scl-063",
    "title": "Log into Gamma.app.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-062"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 63
  },
  {
    "id": "scl-064",
    "title": "Navigate to the \"Client eBooks\" folder in Gamma.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-063"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 64
  },
  {
    "id": "scl-065",
    "title": "Click \"Create new AI\".",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-064"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 65
  },
  {
    "id": "scl-066",
    "title": "Click \"Import file\".",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-065"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 66
  },
  {
    "id": "scl-067",
    "title": "Upload the downloaded Word document.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-066"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 67
  },
  {
    "id": "scl-068",
    "title": "Select \"Webpage\" as the output format.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-067"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 68
  },
  {
    "id": "scl-069",
    "title": "Click \"Continue\".",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-068"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 69
  },
  {
    "id": "scl-070",
    "title": "Select \"Card-by-card\".",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-069"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 70
  },
  {
    "id": "scl-071",
    "title": "Click \"Yes, split for me\".",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-070"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 71
  },
  {
    "id": "scl-072",
    "title": "Go through each generated card to manually double-check how the text is segmented.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-071"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 72
  },
  {
    "id": "scl-073",
    "title": "Make manual adjustments to the text segmentation as needed.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-072"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 73
  },
  {
    "id": "scl-074",
    "title": "Click \"Continue\".",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-073"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 74
  },
  {
    "id": "scl-075",
    "title": "Select a visual theme suited for the client's brand.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-074"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 75
  },
  {
    "id": "scl-076",
    "title": "Click \"Generate\".",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-075"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 76
  },
  {
    "id": "scl-077",
    "title": "Click \"Theme\" then \"Customize\" in the Gamma editor.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-076"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 77
  },
  {
    "id": "scl-078",
    "title": "Open the client's actual website in a new tab.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-077"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 78
  },
  {
    "id": "scl-079",
    "title": "Use the \"Color Picker for Chrome\" extension to extract their exact primary brand hex color.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-078"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 79
  },
  {
    "id": "scl-080",
    "title": "Paste the extracted hex color into Gamma to apply it to the page elements.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-079"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 80
  },
  {
    "id": "scl-081",
    "title": "Use the \"What The Font\" extension on the client's site to identify their font, and match it in Gamma's typography settings.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-080"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 81
  },
  {
    "id": "scl-082",
    "title": "Click the CTA buttons in Gamma.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-081"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 82
  },
  {
    "id": "scl-083",
    "title": "Change the link display setting to \"Button\".",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-082"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 83
  },
  {
    "id": "scl-084",
    "title": "Paste the client's contact URL into the button link.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-083"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 84
  },
  {
    "id": "scl-085",
    "title": "Click \"Edit Image\" and use the \"Ask AI\" tool to generate or replace images (e.g., prompt: \"Modern home with solar panels on roof... bright sunny day\").",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-084"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 85
  },
  {
    "id": "scl-086",
    "title": "Review the entire Gamma page and make any final layout changes.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-085"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 86
  },
  {
    "id": "scl-087",
    "title": "Click \"Publish\".",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-086"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 87
  },
  {
    "id": "scl-088",
    "title": "Click \"View site\" and copy the live URL.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-087"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 88
  },
  {
    "id": "scl-089",
    "title": "Navigate to Switchy.io (https://www.switchy.io/6047/list) in a new tab.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-088"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 89
  },
  {
    "id": "scl-090",
    "title": "Click \"New folder\".",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-089"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 90
  },
  {
    "id": "scl-091",
    "title": "Create a new folder named after the client.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-090"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 91
  },
  {
    "id": "scl-092",
    "title": "Click \"Confirm\".",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-091"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 92
  },
  {
    "id": "scl-093",
    "title": "Click the https://yourlink.com field and paste the Gamma URL.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-092"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 93
  },
  {
    "id": "scl-094",
    "title": "Customize the short link to the format [clientname]-ebook.",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-093"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 94
  },
  {
    "id": "scl-095",
    "title": "Fill out the Meta Ad Campaign Strategy Doc using the template.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "blocked",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 95
  },
  {
    "id": "scl-096",
    "title": "Outline the eBook Lead Magnet campaign (broad audience targeting).",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-095"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 96
  },
  {
    "id": "scl-097",
    "title": "Outline the Consult Offer campaign (warm retargeting audience).",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-096"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 97
  },
  {
    "id": "scl-098",
    "title": "Specify audience targeting details (e.g., ages 35-55+, lookalike audiences, engaged followers).",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-097"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 98
  },
  {
    "id": "scl-099",
    "title": "Draft the ad copy, including the Headline and Primary Text.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "normal",
    "dependencies": [
      "scl-098"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 99
  },
  {
    "id": "scl-100",
    "title": "Design the Meta native lead form for the eBook to request Name, Email, Phone, Postcode, and T&Cs agreement.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-099"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 100
  },
  {
    "id": "scl-101",
    "title": "Design the Meta native lead form for the Consult to include one pre-qualifying question (e.g., \"What electrical work do you need help with?\").",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-100"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 101
  },
  {
    "id": "scl-102",
    "title": "Create 1 static image and 1 Reel per campaign using Canva, AdCreative.ai, or Mirage.app.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-101"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 102
  },
  {
    "id": "scl-103",
    "title": "Send the completed strategy doc and creatives to the client for final approval.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-102"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 103
  },
  {
    "id": "scl-104",
    "title": "Instruct the client to add RT Digital as a \"Partner\" in their Meta Business Suite.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-103"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 104
  },
  {
    "id": "scl-105",
    "title": "Send the client the Scribe guide: \"How to Add RT Digital as a Partner on Meta Business Suite\".",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-104"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 105
  },
  {
    "id": "scl-106",
    "title": "Provide the client with the RT Digital Business ID to enter.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-105"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 106
  },
  {
    "id": "scl-107",
    "title": "Once Partner access is granted, log into the RT Digital Meta Business Portfolio.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-106"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 107
  },
  {
    "id": "scl-108",
    "title": "Under \"Users\", click on \"System Users\".",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "normal",
    "dependencies": [
      "scl-107"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 108
  },
  {
    "id": "scl-109",
    "title": "Look for mktg@webindiainc.com or jayking6505@gmail.com.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-108"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 109
  },
  {
    "id": "scl-110",
    "title": "Click \"Assign assets\".",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "normal",
    "dependencies": [
      "scl-109"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 110
  },
  {
    "id": "scl-111",
    "title": "Select \"Facebook Pages\" from the asset type list.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "normal",
    "dependencies": [
      "scl-110"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 111
  },
  {
    "id": "scl-112",
    "title": "Use the \"Search\" field to look for the client's Facebook Page.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-111"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 112
  },
  {
    "id": "scl-113",
    "title": "Click the checkbox next to the client's Facebook Page.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-112"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 113
  },
  {
    "id": "scl-114",
    "title": "Under \"Partial access\", toggle ON the \"Content, Messages, Community activity, Ads, Insights\" switch.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-113"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 114
  },
  {
    "id": "scl-115",
    "title": "Click \"Ad accounts\" from the asset type list.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "normal",
    "dependencies": [
      "scl-114"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 115
  },
  {
    "id": "scl-116",
    "title": "Use the \"Search\" field to look for the client's Ad Account.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-115"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 116
  },
  {
    "id": "scl-117",
    "title": "Click the checkbox next to the client's Ad Account.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-116"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 117
  },
  {
    "id": "scl-118",
    "title": "Under \"Full control\", toggle ON the \"Manage ad accounts\" switch.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "normal",
    "dependencies": [
      "scl-117"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 118
  },
  {
    "id": "scl-119",
    "title": "Click \"Instagram accounts\" from the asset type list.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "normal",
    "dependencies": [
      "scl-118"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 119
  },
  {
    "id": "scl-120",
    "title": "Use the \"Search\" field and select the client's Instagram account.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-119"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 120
  },
  {
    "id": "scl-121",
    "title": "Assign all permissions for Instagram.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "normal",
    "dependencies": [
      "scl-120"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 121
  },
  {
    "id": "scl-122",
    "title": "Click \"Assign assets\" and then \"Done\".",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "normal",
    "dependencies": [
      "scl-121"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 122
  },
  {
    "id": "scl-123",
    "title": "Log into Upwork using credentials in LastPass.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-122"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 123
  },
  {
    "id": "scl-124",
    "title": "Navigate to the Ads Team contracts.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "critical",
    "dependencies": [
      "scl-123"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 124
  },
  {
    "id": "scl-125",
    "title": "Activate the \"Facebook\" setup milestone.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "normal",
    "dependencies": [
      "scl-124"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 125
  },
  {
    "id": "scl-126",
    "title": "Set the hours to 4 hours (at $12/hr = $72).",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "normal",
    "dependencies": [
      "scl-125"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 126
  },
  {
    "id": "scl-127",
    "title": "Attach the approved Meta strategy document to the milestone.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-126"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 127
  },
  {
    "id": "scl-128",
    "title": "Fund the milestone so the Ads team can load the campaign.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-127"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 128
  },
  {
    "id": "scl-129",
    "title": "Record a Loom video walking the client through their new live ad campaigns.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-128"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 129
  },
  {
    "id": "scl-130",
    "title": "Explain in the Loom video how the AI will handle incoming leads from the ads via the native lead forms.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-129"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 130
  },
  {
    "id": "scl-131",
    "title": "Post the Loom video link in the LaunchBay messaging center for the client.",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-130"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 131
  },
  {
    "id": "scl-132",
    "title": "Log into the RT Digital Google Ads Manager (MCC) account via the Projects Chrome profile.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 132
  },
  {
    "id": "scl-133",
    "title": "Go to Sub-account settings.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "normal",
    "dependencies": [
      "scl-132"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 133
  },
  {
    "id": "scl-134",
    "title": "Click the \"+\" (Add) button.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "normal",
    "dependencies": [
      "scl-133"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 134
  },
  {
    "id": "scl-135",
    "title": "Select \"Link existing accounts\".",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "normal",
    "dependencies": [
      "scl-134"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 135
  },
  {
    "id": "scl-136",
    "title": "Paste the client's Customer ID into the field.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-135"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 136
  },
  {
    "id": "scl-137",
    "title": "Click \"Send Request\".",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "normal",
    "dependencies": [
      "scl-136"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 137
  },
  {
    "id": "scl-138",
    "title": "Message the client instructing them to approve the link request on their end.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-137"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 138
  },
  {
    "id": "scl-139",
    "title": "If the client does not have an ad account, click \"Create a new account\" from the MCC.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-138"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 139
  },
  {
    "id": "scl-140",
    "title": "Grant the client admin access to the newly created ad account.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-139"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 140
  },
  {
    "id": "scl-141",
    "title": "Check Google Business Profile manager under projects@richtraining.com.au to ensure RT Digital is invited to manage it.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-140"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 141
  },
  {
    "id": "scl-142",
    "title": "If the GMB profile is new and unverified, instruct the client to log in and manage verification (e.g., submit a video of their business to Google).",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-141"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 142
  },
  {
    "id": "scl-143",
    "title": "Ensure the client sets up and links Google Analytics.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "blocked",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-142"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 143
  },
  {
    "id": "scl-144",
    "title": "Fill out the Google Ads Strategy Doc template.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-143"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 144
  },
  {
    "id": "scl-145",
    "title": "Select 3 to 5 focus services to highlight.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-144"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 145
  },
  {
    "id": "scl-146",
    "title": "Define target service areas (exact suburbs or postcodes).",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "normal",
    "dependencies": [
      "scl-145"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 146
  },
  {
    "id": "scl-147",
    "title": "Define the campaign objective (e.g., calls, form inquiries).",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-146"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 147
  },
  {
    "id": "scl-148",
    "title": "Detail the daily budget.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-147"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 148
  },
  {
    "id": "scl-149",
    "title": "Go to Upwork and activate the \"Google ads standard setup\" milestone.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-148"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 149
  },
  {
    "id": "scl-150",
    "title": "Set the milestone for 6 hours.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "normal",
    "dependencies": [
      "scl-149"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 150
  },
  {
    "id": "scl-151",
    "title": "Wait for the Ads Team to return the Keyword Planner spreadsheet.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-150"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 151
  },
  {
    "id": "scl-152",
    "title": "Log into GHL Agency View.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-151"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 152
  },
  {
    "id": "scl-153",
    "title": "Navigate to a live client's sub-account (e.g., Fusion).",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-152"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 153
  },
  {
    "id": "scl-154",
    "title": "Go to Sites > Funnels.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-153"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 154
  },
  {
    "id": "scl-155",
    "title": "Find the \"Ads Funnel\".",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-154"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 155
  },
  {
    "id": "scl-156",
    "title": "Clone the \"Ads Funnel\" to your new client's sub-account.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-155"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 156
  },
  {
    "id": "scl-157",
    "title": "Open the cloned 2-step funnel (Homepage and Thank You page) in the GHL builder.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-156"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 157
  },
  {
    "id": "scl-158",
    "title": "Update the Hero Section background image to depict the client's specific services.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-157"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 158
  },
  {
    "id": "scl-159",
    "title": "Upload the client's logo.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-158"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 159
  },
  {
    "id": "scl-160",
    "title": "Update the location text in the Hero Section.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "normal",
    "dependencies": [
      "scl-159"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 160
  },
  {
    "id": "scl-161",
    "title": "Write a clear header offering their service.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "normal",
    "dependencies": [
      "scl-160"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 161
  },
  {
    "id": "scl-162",
    "title": "Write a sub-headline listing the exact areas they serve.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "normal",
    "dependencies": [
      "scl-161"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 162
  },
  {
    "id": "scl-163",
    "title": "Configure the \"Request an Appointment\" CTA button.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "normal",
    "dependencies": [
      "scl-162"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 163
  },
  {
    "id": "scl-164",
    "title": "Configure the \"Click to Call\" CTA button.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "normal",
    "dependencies": [
      "scl-163"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 164
  },
  {
    "id": "scl-165",
    "title": "Link the \"Click to Call\" button to the client's new TradeAI GHL phone number.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-164"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 165
  },
  {
    "id": "scl-166",
    "title": "Edit the text in the Services Section to perfectly match the specific keywords the Ads Team provided for the campaign.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-165"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 166
  },
  {
    "id": "scl-167",
    "title": "Insert simple Call-to-Action buttons between sections so users don't have to scroll to the bottom.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "normal",
    "dependencies": [
      "scl-166"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 167
  },
  {
    "id": "scl-168",
    "title": "Navigate away from the funnel builder to Sites > Forms > Builder.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-167"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 168
  },
  {
    "id": "scl-169",
    "title": "Create a new form and name it \"Google Ads Funnel\".",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-168"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 169
  },
  {
    "id": "scl-170",
    "title": "Add standard fields to the form: Name, Phone, Email.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-169"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 170
  },
  {
    "id": "scl-171",
    "title": "Add any pre-qualifying questions requested by the client (e.g., \"When is the best time to call?\") using custom fields.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-170"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 171
  },
  {
    "id": "scl-172",
    "title": "Click Save on the form.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "normal",
    "dependencies": [
      "scl-171"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 172
  },
  {
    "id": "scl-173",
    "title": "Go back to the Funnel builder.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-172"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 173
  },
  {
    "id": "scl-174",
    "title": "Replace the placeholder form with your newly created \"Google Ads Funnel\" form to ensure leads are tagged specifically as Google Ad Leads.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-173"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 174
  },
  {
    "id": "scl-175",
    "title": "Set the form action to \"Go to next step\" (Thank You page).",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "normal",
    "dependencies": [
      "scl-174"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 175
  },
  {
    "id": "scl-176",
    "title": "Update the \"Why Choose Us\" section with their experience, certifications, and brand values.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "normal",
    "dependencies": [
      "scl-175"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 176
  },
  {
    "id": "scl-177",
    "title": "Log into SociableKit.com using projects@richtraining.com.au.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-176"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 177
  },
  {
    "id": "scl-178",
    "title": "Connect their Google Business Profile in SociableKit to generate a live review widget.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-177"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 178
  },
  {
    "id": "scl-179",
    "title": "Embed the SociableKit HTML code on the GHL landing page.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-178"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 179
  },
  {
    "id": "scl-180",
    "title": "If the client lacks project photos, embed their Instagram feed using SociableKit.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-179"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 180
  },
  {
    "id": "scl-181",
    "title": "Edit the Thank You page (second funnel step).",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-180"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 181
  },
  {
    "id": "scl-182",
    "title": "Add links to their main website and list any secondary services not covered on the homepage.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-181"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 182
  },
  {
    "id": "scl-183",
    "title": "Click Save and Publish.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "normal",
    "dependencies": [
      "scl-182"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 183
  },
  {
    "id": "scl-184",
    "title": "Go to funnel settings and connect their domain.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-183"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 184
  },
  {
    "id": "scl-185",
    "title": "Use the DNS settings provided in their onboarding form to connect the domain.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-184"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 185
  },
  {
    "id": "scl-186",
    "title": "Double-check that all URL paths are correct.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-185"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 186
  },
  {
    "id": "scl-187",
    "title": "Generate a preview link of the funnel via \"Share Funnel\".",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-186"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 187
  },
  {
    "id": "scl-188",
    "title": "Send the Ads Team's keyword plan and the GHL landing page preview link to the client for final approval.",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-187"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 188
  },
  {
    "id": "scl-189",
    "title": "Log into GHL Agency View > Settings > Team > Edit Ads Team, and grant the Ads Team access to the client's new GHL sub-account.",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 189
  },
  {
    "id": "scl-190",
    "title": "Set up the GHL sub-account and update the Business Profile.",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [
      "scl-189"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 190
  },
  {
    "id": "scl-191",
    "title": "Add the client as a user in GHL with strictly limited permissions: Contacts, Conversations, Dashboard, Opportunities, Tags, Account Settings.",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [
      "scl-190"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 191
  },
  {
    "id": "scl-192",
    "title": "Use the CloseBot Objective Builder GPT link (https://chatgpt.com/g/g-67ae76f80150819187fbb5fa67ddcec4-closebot-objective-builder) in a new chat.",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [
      "scl-191"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 192
  },
  {
    "id": "scl-193",
    "title": "Change the yellow highlighted sections in the prompt template to reflect the client details (Bot Name, Client Website, Industry Insight, Pain Points, Objections, ICP).",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [
      "scl-192"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 193
  },
  {
    "id": "scl-194",
    "title": "Run Task 1 (Generate Bot Details & Objectives Prompt) and Task 2 (Generate Knowledgebase Prompt) together in ChatGPT.",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [
      "scl-193"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 194
  },
  {
    "id": "scl-195",
    "title": "Review the output for the 7 standard CloseBot Objectives: Pain Point, Motivation, Service Type, Email, Phone, Timezone, and Book Call.",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [
      "scl-194"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 195
  },
  {
    "id": "scl-196",
    "title": "Ensure Max Attempts is set to 2 and Sensitivity is set to 50 for all objectives.",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "normal",
    "dependencies": [
      "scl-195"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 196
  },
  {
    "id": "scl-197",
    "title": "Log into CloseBot (app.closebot.com) using the stored team credentials.",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [
      "scl-196"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 197
  },
  {
    "id": "scl-198",
    "title": "Clone the V2 bot (e.g., 'Susan' Agent and 'CONVERT' workflow or 'LenderlyAIv2' bot).",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [
      "scl-197"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 198
  },
  {
    "id": "scl-199",
    "title": "Rename the bot to match the client details.",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [
      "scl-198"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 199
  },
  {
    "id": "scl-200",
    "title": "Set Persona Name, 'How to Respond' section, and Tone according to the GPT prompt results.",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "normal",
    "dependencies": [
      "scl-199"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 200
  },
  {
    "id": "scl-201",
    "title": "Select Provider as RTD OpenAi.",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [
      "scl-200"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 201
  },
  {
    "id": "scl-202",
    "title": "Connect to RTDigital Agency and the appropriate client GHL subaccount.",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [
      "scl-201"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 202
  },
  {
    "id": "scl-203",
    "title": "Turn ON \"Bot Shutoff Manual Message\".",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "normal",
    "dependencies": [
      "scl-202"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 203
  },
  {
    "id": "scl-204",
    "title": "Turn ON \"Graceful Goodbye\".",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "blocked",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "normal",
    "dependencies": [
      "scl-203"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 204
  },
  {
    "id": "scl-205",
    "title": "Turn OFF \"Followup Availability\" by default.",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [
      "scl-204"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 205
  },
  {
    "id": "scl-206",
    "title": "Paste the GPT-generated Knowledgebase into the \"Knowledge\" section (Knowledge library > Create text file).",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "normal",
    "dependencies": [
      "scl-205"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 206
  },
  {
    "id": "scl-207",
    "title": "Click \"website scrape\", enter the client's website URL, and select website.",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [
      "scl-206"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 207
  },
  {
    "id": "scl-208",
    "title": "Edit sources for both Knowledge entries and link them to the appropriate client subaccount.",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [
      "scl-207"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 208
  },
  {
    "id": "scl-209",
    "title": "Ensure conversational booking logic routes to the GHL AI Calendar using the GET method.",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [
      "scl-208"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 209
  },
  {
    "id": "scl-210",
    "title": "Log into GHL -> Account -> Calendar -> Calendar Settings, and copy the AI Calendar ID to paste into CloseBot.",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [
      "scl-209"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 210
  },
  {
    "id": "scl-211",
    "title": "Provide weekly updates to the client via LaunchBay task comments or phone calls during the build phase.",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [
      "scl-210"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 211
  },
  {
    "id": "scl-212",
    "title": "Perform Final Build Check (Verify users, forms, calendar integrations, and phone routings are flawless).",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "critical",
    "dependencies": [],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 212
  },
  {
    "id": "scl-213",
    "title": "Log into the GHL account.",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-212"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 213
  },
  {
    "id": "scl-214",
    "title": "Navigate to Sites -> Funnels -> AI Test Funnel.",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-213"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 214
  },
  {
    "id": "scl-215",
    "title": "Click the \"View Page\" button to launch the AI test funnel in a browser.",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-214"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 215
  },
  {
    "id": "scl-216",
    "title": "Test the Live Chat and Voice Chat yourself.",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "normal",
    "dependencies": [
      "scl-215"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 216
  },
  {
    "id": "scl-217",
    "title": "If either fails, flag a developer via Slack/LaunchBay immediately.",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-216"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 217
  },
  {
    "id": "scl-218",
    "title": "Ensure Read.ai is recording the client call.",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-217"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 218
  },
  {
    "id": "scl-219",
    "title": "On the call, confirm the client has downloaded the LeadConnector App on their phone.",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-218"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 219
  },
  {
    "id": "scl-220",
    "title": "Confirm their email signature is set up.",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-219"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 220
  },
  {
    "id": "scl-221",
    "title": "Confirm their calendar is connected and user availability/timezone is correct.",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-220"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 221
  },
  {
    "id": "scl-222",
    "title": "Confirm social media DMs are connected.",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-221"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 222
  },
  {
    "id": "scl-223",
    "title": "Confirm a call to the client's TradeAI phone number rings their LeadConnector mobile app.",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-222"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 223
  },
  {
    "id": "scl-224",
    "title": "Send the client the link to the AI testing environment funnel.",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-223"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 224
  },
  {
    "id": "scl-225",
    "title": "Instruct the client to live-chat and speak with the agent.",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-224"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 225
  },
  {
    "id": "scl-226",
    "title": "Tell the client to pretend to be different personas (price shopper, emergency, browsing) to try and stump the bot.",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-225"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 226
  },
  {
    "id": "scl-227",
    "title": "Collect actionable feedback from the client during the test.",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-226"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 227
  },
  {
    "id": "scl-228",
    "title": "Document the feedback in GHL notes and via Read.ai.",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-227"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 228
  },
  {
    "id": "scl-229",
    "title": "Post the feedback in LaunchBay for the AISS Dev Team.",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-228"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 229
  },
  {
    "id": "scl-230",
    "title": "Update the CloseBot/snapshot configuration based on the feedback.",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-229"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 230
  },
  {
    "id": "scl-231",
    "title": "Schedule the \"Go Live Call\" for Day 30 (or 3 days later if massive updates are needed).",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "critical",
    "dependencies": [
      "scl-230"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 231
  },
  {
    "id": "scl-232",
    "title": "CRITICAL PRE-CALL TASK: Go into GHL Automations, search for 001. AISS - Inbound Lead Submitted.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "critical",
    "dependencies": [],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 232
  },
  {
    "id": "scl-233",
    "title": "Turn this automation from Draft to ON.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "critical",
    "dependencies": [
      "scl-232"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 233
  },
  {
    "id": "scl-234",
    "title": "Go to GHL Settings -> Billing.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "critical",
    "dependencies": [
      "scl-233"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 234
  },
  {
    "id": "scl-235",
    "title": "Update Wallet Settings: Ensure auto-recharge is ON.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "normal",
    "dependencies": [
      "scl-234"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 235
  },
  {
    "id": "scl-236",
    "title": "Set the recharge amount to $100.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "normal",
    "dependencies": [
      "scl-235"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 236
  },
  {
    "id": "scl-237",
    "title": "Set the trigger threshold to $10.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "normal",
    "dependencies": [
      "scl-236"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 237
  },
  {
    "id": "scl-238",
    "title": "Confirm SaaS subscriptions are active.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-237"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 238
  },
  {
    "id": "scl-239",
    "title": "Confirm rebilling fees (2.5x phone items, 3x other items) are set correctly.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "critical",
    "dependencies": [
      "scl-238"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 239
  },
  {
    "id": "scl-240",
    "title": "On the call, frame the session: Explain the goal is simplicity and getting the team confident using the live system.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-239"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 240
  },
  {
    "id": "scl-241",
    "title": "Have the client open https://aiss-live.rtdigital.com.au/.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-240"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 241
  },
  {
    "id": "scl-242",
    "title": "Walk the client through the LeadConnector app features.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-241"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 242
  },
  {
    "id": "scl-243",
    "title": "Show them how to navigate Contacts.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "normal",
    "dependencies": [
      "scl-242"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 243
  },
  {
    "id": "scl-244",
    "title": "Show them how to make and receive calls.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "normal",
    "dependencies": [
      "scl-243"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 244
  },
  {
    "id": "scl-245",
    "title": "Show them how to handle missed calls.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "normal",
    "dependencies": [
      "scl-244"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 245
  },
  {
    "id": "scl-246",
    "title": "Show them how to send SMS.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "normal",
    "dependencies": [
      "scl-245"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 246
  },
  {
    "id": "scl-247",
    "title": "Show them how to access and view conversations.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-246"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 247
  },
  {
    "id": "scl-248",
    "title": "Show them how to check push notifications.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-247"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 248
  },
  {
    "id": "scl-249",
    "title": "Demo the AI Summaries (call transcripts, notes, follow-up suggestions) in the contact records.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-248"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 249
  },
  {
    "id": "scl-250",
    "title": "Demo the AI Coaching Notes (call scoring, insights) in the contact records.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-249"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 250
  },
  {
    "id": "scl-251",
    "title": "Demo the AI answering a missed call.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-250"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 251
  },
  {
    "id": "scl-252",
    "title": "Walk through their live ad campaign setup.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-251"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 252
  },
  {
    "id": "scl-253",
    "title": "Submit a live test webform or FB/IG DM to demo an inbound lead.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "normal",
    "dependencies": [
      "scl-252"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 253
  },
  {
    "id": "scl-254",
    "title": "Show them the test lead instantly appearing in the Opportunities pipeline.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "normal",
    "dependencies": [
      "scl-253"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 254
  },
  {
    "id": "scl-255",
    "title": "Show them the AI sending an immediate SMS/Email nurture.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-254"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 255
  },
  {
    "id": "scl-256",
    "title": "Show them how to stop the bot manually by adding the ai off tag.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-255"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 256
  },
  {
    "id": "scl-257",
    "title": "Show them how the opportunity card moves to the \"Booked\" stage.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "normal",
    "dependencies": [
      "scl-256"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 257
  },
  {
    "id": "scl-258",
    "title": "Establish team usage standards: All business calls must go through the app, avoid personal mobiles, review summaries daily, reply from inside the app.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-257"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 258
  },
  {
    "id": "scl-259",
    "title": "Remind the client that SaaS fees have officially commenced.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-258"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 259
  },
  {
    "id": "scl-260",
    "title": "Post-Call: Send a LaunchBay message confirming their system is live.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-259"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 260
  },
  {
    "id": "scl-261",
    "title": "Include the AISS User Manual link in the message.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-260"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 261
  },
  {
    "id": "scl-262",
    "title": "Include the Read.ai call recording link in the message.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-261"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 262
  },
  {
    "id": "scl-263",
    "title": "Remind them to tag @AISS Developer Team in LaunchBay/Slack for support.",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-262"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 263
  },
  {
    "id": "scl-264",
    "title": "Open the shared \"AISS Fees Summary for Accounts\" Google Sheet (bookmarked in the #accounts Slack channel).",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 264
  },
  {
    "id": "scl-265",
    "title": "Log into the client's GHL sub-account to confirm their product configuration is active.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-264"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 265
  },
  {
    "id": "scl-266",
    "title": "Log into Stripe and search for the client's company name or customer name.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-265"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 266
  },
  {
    "id": "scl-267",
    "title": "Verify that their monthly billing subscription is active and successfully charging in Stripe.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "critical",
    "dependencies": [
      "scl-266"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 267
  },
  {
    "id": "scl-268",
    "title": "Update the Google Sheet with the product name, SaaS plan name, SaaS fee in AUD (including GST), and Ad management fee.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-267"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 268
  },
  {
    "id": "scl-269",
    "title": "Change their status to \"Live\" in the Google Sheet.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-268"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 269
  },
  {
    "id": "scl-270",
    "title": "Post a message in the #accounts Slack channel tagging Sandy (e.g., \"Hi Sandy, we launched a new client today. Their fees are live. Updated our sheet here: Link\").",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-269"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 270
  },
  {
    "id": "scl-271",
    "title": "Every week, log into Upwork.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-270"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 271
  },
  {
    "id": "scl-272",
    "title": "Find the \"Facebook optimization\" milestone for the Ads team.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-271"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 272
  },
  {
    "id": "scl-273",
    "title": "Update the milestone, allocating 2 hours per week per live client.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-272"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 273
  },
  {
    "id": "scl-274",
    "title": "Ensure the Ads team is posting their automated fortnightly and monthly campaign performance reports in LaunchBay.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-273"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 274
  },
  {
    "id": "scl-275",
    "title": "Review the Ads team's recommendations in the reports.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-274"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 275
  },
  {
    "id": "scl-276",
    "title": "Mark LaunchBay tasks \"Your SaaS fees will switch on in: 30 days, 14 days, 7 days\" as completed.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-275"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 276
  },
  {
    "id": "scl-277",
    "title": "Mark LaunchBay tasks \"Client Satisfaction Call (Day 3)\" and \"Send A Testimonial (Day 5)\" as completed.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-276"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 277
  },
  {
    "id": "scl-278",
    "title": "Conduct a 30-minute Zoom check-in during Week 1.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-277"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 278
  },
  {
    "id": "scl-279",
    "title": "Conduct a 30-minute Zoom check-in during Week 2.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-278"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 279
  },
  {
    "id": "scl-280",
    "title": "Transition to monthly client check-in calls.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-279"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 280
  },
  {
    "id": "scl-281",
    "title": "Send proof of your follow-ups (e.g., Read.ai links, SMS attempts) in LaunchBay.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-280"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 281
  },
  {
    "id": "scl-282",
    "title": "Perform a Weekly Account Audit: Log into GHL Agency View -> Subaccounts table.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-281"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 282
  },
  {
    "id": "scl-283",
    "title": "Check the client dashboard for call activity, texts, and appointments.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-282"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 283
  },
  {
    "id": "scl-284",
    "title": "Check Conversations to ensure calls are recorded/transcribed, texts are happening, and missed calls result in AI text-backs and AI answering.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-283"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 284
  },
  {
    "id": "scl-285",
    "title": "Check Opportunities pipeline to verify inbound leads are prequalified, nurtured if not responding, followed up by AI, and moving to Booked/Closed stages.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-284"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 285
  },
  {
    "id": "scl-286",
    "title": "Monitor all incoming LaunchBay/GHL support requests daily.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-285"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 286
  },
  {
    "id": "scl-287",
    "title": "Create tasks in GHL attached to the contact record for all support tickets.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-286"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 287
  },
  {
    "id": "scl-288",
    "title": "Diagnose issues (configuration, bug, change request).",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "normal",
    "dependencies": [
      "scl-287"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 288
  },
  {
    "id": "scl-289",
    "title": "Execute Tier 1 technical fixes yourself: fix configuration issues, adjust automations, resolve integration issues, reconnect services.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "normal",
    "dependencies": [
      "scl-288"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 289
  },
  {
    "id": "scl-290",
    "title": "Escalate Tier 2 technical issues to Joseph or the AISS Dev team.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-289"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 290
  },
  {
    "id": "scl-291",
    "title": "Provide clear documentation and reproduction steps when escalating.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "normal",
    "dependencies": [
      "scl-290"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 291
  },
  {
    "id": "scl-292",
    "title": "Update the \"Active Clients Pipeline\" for the Monday CEO Update.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-291"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 292
  },
  {
    "id": "scl-293",
    "title": "Report on: Client Name, Plan/Subscription, Launch Stage, Last Contact Attempt, Last Contact Made, Hot Notes, calls last week/this week, and issues.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-292"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 293
  },
  {
    "id": "scl-294",
    "title": "Acknowledge any request to exit, pause, or downgrade professionally, but DO NOT agree to the cancellation immediately.",
    "category": "Exit, Pause, & Cancellation Protocol",
    "phase": "Support",
    "status": "queued",
    "assignee": "Rich",
    "dueWindow": "As needed",
    "priority": "critical",
    "dependencies": [],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 294
  },
  {
    "id": "scl-295",
    "title": "Reply with: \"I'll review your account, contract terms, and current setup so we can confirm the correct next steps clearly...\"",
    "category": "Exit, Pause, & Cancellation Protocol",
    "phase": "Support",
    "status": "queued",
    "assignee": "Rich",
    "dueWindow": "As needed",
    "priority": "critical",
    "dependencies": [
      "scl-294"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 295
  },
  {
    "id": "scl-296",
    "title": "Review the client's contract.",
    "category": "Exit, Pause, & Cancellation Protocol",
    "phase": "Support",
    "status": "queued",
    "assignee": "Rich",
    "dueWindow": "As needed",
    "priority": "critical",
    "dependencies": [
      "scl-295"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 296
  },
  {
    "id": "scl-297",
    "title": "Check for the 9-month minimum term for SaaS, 3-month notice period for SaaS, and 1-month notice period for Ads.",
    "category": "Exit, Pause, & Cancellation Protocol",
    "phase": "Support",
    "status": "queued",
    "assignee": "Rich",
    "dueWindow": "As needed",
    "priority": "high",
    "dependencies": [
      "scl-296"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 297
  },
  {
    "id": "scl-298",
    "title": "Review product performance and working expectations: check if system was delivered, onboarding completed, AI/CRM activated, leads/calls generated, tech issues resolved, client active usage, and outstanding tasks.",
    "category": "Exit, Pause, & Cancellation Protocol",
    "phase": "Support",
    "status": "queued",
    "assignee": "Rich",
    "dueWindow": "As needed",
    "priority": "high",
    "dependencies": [
      "scl-297"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 298
  },
  {
    "id": "scl-299",
    "title": "Document the performance findings internally.",
    "category": "Exit, Pause, & Cancellation Protocol",
    "phase": "Support",
    "status": "queued",
    "assignee": "Rich",
    "dueWindow": "As needed",
    "priority": "normal",
    "dependencies": [
      "scl-298"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 299
  },
  {
    "id": "scl-300",
    "title": "Clarify the real reason for the exit (e.g., budget, lead quality, not using system, confusion, expectations, poor ad performance).",
    "category": "Exit, Pause, & Cancellation Protocol",
    "phase": "Support",
    "status": "queued",
    "assignee": "Rich",
    "dueWindow": "As needed",
    "priority": "normal",
    "dependencies": [
      "scl-299"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 300
  },
  {
    "id": "scl-301",
    "title": "Attempt intervention before proceeding: propose system walkthrough, extra training, database reactivation push, CRM pipeline review, or strategy call.",
    "category": "Exit, Pause, & Cancellation Protocol",
    "phase": "Support",
    "status": "queued",
    "assignee": "Rich",
    "dueWindow": "As needed",
    "priority": "high",
    "dependencies": [
      "scl-300"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 301
  },
  {
    "id": "scl-302",
    "title": "Escalate the account to Rich and Joseph BEFORE offering any discounts, early releases, pauses, or confirming the exit.",
    "category": "Exit, Pause, & Cancellation Protocol",
    "phase": "Support",
    "status": "queued",
    "assignee": "Rich",
    "dueWindow": "As needed",
    "priority": "high",
    "dependencies": [
      "scl-301"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 302
  },
  {
    "id": "scl-303",
    "title": "Submit the \"Internal Escalation Format\" to Rich/Joseph (Client, Product, Start Date, Term/Notice, Status, Reason, Contract Position, Performance Review, Recommendation).",
    "category": "Exit, Pause, & Cancellation Protocol",
    "phase": "Support",
    "status": "queued",
    "assignee": "Rich",
    "dueWindow": "As needed",
    "priority": "critical",
    "dependencies": [
      "scl-302"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 303
  },
  {
    "id": "scl-304",
    "title": "Enforce the non-negotiable rule: No refunds whatsoever are allowed under any circumstances.",
    "category": "Exit, Pause, & Cancellation Protocol",
    "phase": "Support",
    "status": "queued",
    "assignee": "Rich",
    "dueWindow": "As needed",
    "priority": "critical",
    "dependencies": [
      "scl-303"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 304
  },
  {
    "id": "scl-305",
    "title": "Provide the client with a written confirmation of exit terms: Notice received, Minimum commitment, Final discussion date, Final billing date, and Final service/access date.",
    "category": "Exit, Pause, & Cancellation Protocol",
    "phase": "Support",
    "status": "queued",
    "assignee": "Rich",
    "dueWindow": "As needed",
    "priority": "critical",
    "dependencies": [
      "scl-304"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 305
  },
  {
    "id": "scl-306",
    "title": "Send the internal \"Client Exit Update\" template to Rich, Joseph, Accounts/Billing, Ads Team, and AISS Dev Team.",
    "category": "Exit, Pause, & Cancellation Protocol",
    "phase": "Support",
    "status": "queued",
    "assignee": "Rich",
    "dueWindow": "As needed",
    "priority": "critical",
    "dependencies": [
      "scl-305"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 306
  },
  {
    "id": "scl-307",
    "title": "Update the CRM tracker and \"AISS Fees Summary for Accounts\" sheet to reflect the cancellation.",
    "category": "Exit, Pause, & Cancellation Protocol",
    "phase": "Support",
    "status": "queued",
    "assignee": "Rich",
    "dueWindow": "As needed",
    "priority": "high",
    "dependencies": [
      "scl-306"
    ],
    "notes": "",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 307
  }
];
