import type { Category, ScaleVariant, Task } from "./types";

export const scaleSourceDocument = {
  "title": "Full List Of Tasks - Scale CSM Comprehensive Operational Workflow Manual",
  "url": "https://docs.google.com/document/d/1KJZdPO2NkB9w67_stgykSrBSr6hVqeA32Tvihp439yg/edit?usp=drive_link"
};

export const scaleCategories: Category[] = [
  {
    "id": "scale-01-comms-admin-communication-routines",
    "name": "Accounts Stage Verification",
    "phase": "Onboarding",
    "accent": "#0891b2"
  },
  {
    "id": "scale-02-admin-account-setup",
    "name": "Admin & Account Setup",
    "phase": "Onboarding",
    "accent": "#2563eb"
  },
  {
    "id": "scale-03-pre-onboarding-welcome-call",
    "name": "Welcome Onboarding Call",
    "phase": "Onboarding",
    "accent": "#0f766e"
  },
  {
    "id": "scale-04-meta-ads-strategy-ebook-creation-gamma-chatgpt-switc",
    "name": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "accent": "#7c3aed"
  },
  {
    "id": "scale-05-meta-ads-setup-handoff-partner-access",
    "name": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "accent": "#2563eb"
  },
  {
    "id": "scale-06-google-ads-strategy-landing-page-funnel-creation",
    "name": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "accent": "#0284c7"
  },
  {
    "id": "scale-07-ai-bot-build-ghl-configuration",
    "name": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "accent": "#4f46e5"
  },
  {
    "id": "scale-08-ai-test-call-final-checks-day-14",
    "name": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "accent": "#ca8a04"
  },
  {
    "id": "scale-09-go-live-call-day-30",
    "name": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "accent": "#059669"
  },
  {
    "id": "scale-10-post-go-live-check-ins-reporting-admin",
    "name": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "accent": "#0d9488"
  },
  {
    "id": "scale-11-exit-pause-cancellation-protocol",
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
    "title": "Daily comms routine — Gmail, Slack & GHL",
    "category": "Accounts Stage Verification",
    "phase": "Onboarding",
    "status": "complete",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [],
    "notes": "Merged SOP steps:\n- Log into the Gmail, check emails.\n- Log into the RTDigital Agency Slack to check Slack comms, multiple channels and DM's daily.\n- Log into the GoHighLevel (GHL) Agency View -> RT Digital sub-account. Contacts, Scott Lambert Check comms with client. Message replies etc. Also, check clients sub account comms.\n- Use GHL as the mandatory primary platform for all client communication.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 1
  },
  {
    "id": "scl-005",
    "title": "GHL logging & task-naming conventions",
    "category": "Accounts Stage Verification",
    "phase": "Onboarding",
    "status": "review",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-001"
    ],
    "notes": "Merged SOP steps:\n- Leave an 'internal comment' on the GHL contact record for every single client interaction.\n- Format every GHL note strictly as: Date - Reason for follow-up or communication - Team member name (e.g., \"May 19, 2026 - Followed up regarding website revisions - John\").\n- Create a task inside GHL attached to the client's contact record for any new project build or support request.\n- Name every GHL task strictly using the convention: Client Business Name | Task Description.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 2
  },
  {
    "id": "scl-009",
    "title": "Verify billing & Accounts stage in LaunchBay",
    "category": "Accounts Stage Verification",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-005"
    ],
    "notes": "Merged SOP steps:\n- Monitor the backend \"Accounts\" progress in LaunchBay.\n- Verify \"Setup Fee Invoices Created and Sent\" is marked completed in LaunchBay.\n- Verify \"Setup Fee Paid and Reconciled\" is marked completed in LaunchBay.\n- Check that \"SaaS Fees Are Activated\" in LaunchBay.\n- Verify \"Recurring Invoices Setup/Auto/Reconciled\" is marked completed in LaunchBay.\n- Verify \"Client Payments\" in LaunchBay.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 3
  },
  {
    "id": "scl-015",
    "title": "Confirm Zapier deploy automations (template, welcome email, Slack sync)",
    "category": "Accounts Stage Verification",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-009"
    ],
    "notes": "Merged SOP steps:\n- Verify the automated Zapier trigger deployed the correct LaunchBay project template upon the deal closing.\n- Verify the automated Zapier trigger sent the welcome email with the LaunchBay form to the client.\n- Set up a Zapier automation connecting the client's LaunchBay project with their Slack channel to sync task notifications in real-time.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 4
  },
  {
    "id": "scl-018",
    "title": "Check that the client has submitted the onboarding form in LaunchBay.",
    "category": "Admin & Account Setup",
    "phase": "Onboarding",
    "status": "blocked",
    "assignee": "Scale CSM",
    "dueWindow": "Pre-build / Ongoing",
    "priority": "high",
    "dependencies": [
      "scl-015"
    ],
    "notes": "",
    "portalVisible": true,
    "portalTitle": "Complete your onboarding form",
    "portalNote": "Log in to your portal and submit the onboarding form before your Welcome Call.",
    "portalActionRequired": true,
    "portalConfigured": true,
    "sortOrder": 5
  },
  {
    "id": "scl-019a",
    "title": "Verify project template, welcome email & onboarding form (CSM)",
    "category": "Admin & Account Setup",
    "phase": "Onboarding",
    "status": "complete",
    "assignee": "Scale CSM",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-018"
    ],
    "notes": "Merged SOP steps:\n- Verify client project template is deployed in Scale CSM platform using import from GHL.\n- Verify welcome email sent.\n- Check that the client has submitted the onboarding form in CSM platform.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 6
  },
  {
    "id": "scl-019",
    "title": "Pre-call setup (handoff, welcome email, client intro, artifact doc)",
    "category": "Welcome Onboarding Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [],
    "notes": "Merged SOP steps:\n- Verify the Sales Team closed the deal, left the opportunity in the Sales Person Pipeline, and booked the Welcome Onboard Call.\n- Update the automation that sends the welcome email to ensure the messaging is accurate.\n- Follow up with the new client via GHL SMS or Email to introduce yourself before the Welcome Call.\n- Create a copy of the \"AISS Client Artifact Template\" and save it under the client's name for note-taking.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 7
  },
  {
    "id": "scl-023",
    "title": "Run the Welcome Call & portal walkthrough",
    "category": "Welcome Onboarding Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-019"
    ],
    "notes": "Merged SOP steps:\n- Start the Welcome Onboard call and present the Scale Onboarding Slide Deck (Gamma TAI-Scale-Onboard).\n- Have the client log into CSM live while sharing their screen on the call.\n- Copy the \"Magic Link\" from the Users tab in CSM platform and provide it to the client.\n- Walk the client through CSM project milestones, tasks, and the messaging center.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 8
  },
  {
    "id": "scl-026",
    "title": "Instruct the client to bookmark their Magic Link.",
    "category": "Welcome Onboarding Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-023"
    ],
    "notes": "",
    "portalVisible": true,
    "portalTitle": "Bookmark your portal link",
    "portalNote": "Save your portal link so you can access it anytime.",
    "portalActionRequired": true,
    "portalConfigured": true,
    "sortOrder": 9
  },
  {
    "id": "scl-028",
    "title": "Ask the client to send a test message on the onboarding form task in LaunchBay to confirm they understand the system.",
    "category": "Welcome Onboarding Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-023"
    ],
    "notes": "",
    "portalVisible": true,
    "portalTitle": "Send a test message in your portal",
    "portalNote": "Open your portal onboarding task and send us a test message to confirm everything is working.",
    "portalActionRequired": true,
    "portalConfigured": true,
    "sortOrder": 10
  },
  {
    "id": "scl-029",
    "title": "Review onboarding form & define AI qualification questions",
    "category": "Welcome Onboarding Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-028"
    ],
    "notes": "Merged SOP steps:\n- Review the submitted onboard form with the client: Business Info, Proof of Address, Phone Options, Appointment Options, Domain Access, Website Access, ICP, and Branding/Logos.\n- Ask the client: \"If your agent was a human, how would you train her to talk with leads?\"\n- Determine their exact pre-qualification questions (e.g., Service type, emergency status, name/email/phone, address, budget).\n- Document these exact questions in the Client Artifact document.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 11
  },
  {
    "id": "scl-033",
    "title": "Review & approve the AI qualification questions",
    "category": "Welcome Onboarding Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-029"
    ],
    "notes": "Merged SOP steps:\n- Get verbal approval from the client on the AI questions.\n- Change the approved AI question text to GREEN BOLD in the Client Artifact document.\n- Add a comment \"approved by Client\" to the GREEN BOLD text.",
    "portalVisible": true,
    "portalTitle": "Review & approve your AI qualification questions",
    "portalNote": "We'll go through your AI's qualification questions together on your Welcome Call.",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 12
  },
  {
    "id": "scl-036",
    "title": "Explain timeline & fees, schedule the AI Test Call",
    "category": "Welcome Onboarding Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "critical",
    "dependencies": [
      "scl-033"
    ],
    "notes": "Merged SOP steps:\n- Explain the project timeline: Days 2-13 Build, Day 14 AI Test, Day 30 Go Live.\n- Warn the client that SaaS fees start ticking 14-30 days from the point of sale.\n- Schedule the \"AI Test Call\" for Day 14 in the GHL calendar.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 13
  },
  {
    "id": "scl-038",
    "title": "Instruct the client to download the LeadConnector Mobile App.",
    "category": "Welcome Onboarding Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-036"
    ],
    "notes": "",
    "portalVisible": true,
    "portalTitle": "Download the LeadConnector Mobile App",
    "portalNote": "Search 'LeadConnector' in the App Store or Google Play and install it before your next call.",
    "portalActionRequired": true,
    "portalConfigured": true,
    "sortOrder": 14
  },
  {
    "id": "scl-039",
    "title": "Client Review of SMS/Email Copy",
    "category": "Welcome Onboarding Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-038"
    ],
    "notes": "",
    "portalVisible": true,
    "portalTitle": "Review your SMS & email message copy",
    "portalNote": "We'll walk through your messaging templates together on the call.",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 15
  },
  {
    "id": "scl-040",
    "title": "Have client connect their Calendar, Social Media DMs, and set up a Payment Mechanism in their CRM settings.",
    "category": "Welcome Onboarding Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-039"
    ],
    "notes": "",
    "portalVisible": true,
    "portalTitle": "Connect your calendar, social accounts & payment method",
    "portalNote": "We'll help you set these up during your Welcome Call.",
    "portalActionRequired": true,
    "portalConfigured": true,
    "sortOrder": 16
  },
  {
    "id": "scl-041",
    "title": "Instruct the client to prepare and upload a CSV database of their past leads and lost quotes.",
    "category": "Welcome Onboarding Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-040"
    ],
    "notes": "",
    "portalVisible": true,
    "portalTitle": "Upload your past leads (CSV)",
    "portalNote": "Prepare a CSV of your past leads and lost quotes — we'll walk you through the upload.",
    "portalActionRequired": true,
    "portalConfigured": true,
    "sortOrder": 17
  },
  {
    "id": "scl-043",
    "title": "Post the recap message in LaunchBay",
    "category": "Welcome Onboarding Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-036"
    ],
    "notes": "Merged SOP steps:\n- Post a recap message in LaunchBay tagging the client and Dev Team.\n- Paste the LaunchBay Magic Link into the recap message.\n- Paste the Read.ai call recording link into the recap message.\n- Write a bulleted list of any missing Action Items in the recap message.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 18
  },
  {
    "id": "scl-047",
    "title": "Chase the client to provide access to Google My Business Profile.",
    "category": "Welcome Onboarding Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-043"
    ],
    "notes": "",
    "portalVisible": true,
    "portalTitle": "Grant access to your Google My Business Profile",
    "portalNote": "We'll need this to connect your local business listing. We'll send instructions during your Welcome Call.",
    "portalActionRequired": true,
    "portalConfigured": true,
    "sortOrder": 19
  },
  {
    "id": "scl-048",
    "title": "Chase the client to provide Domain Provider Access and Website Builder Access.",
    "category": "Welcome Onboarding Call",
    "phase": "Onboarding",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Days 1-2",
    "priority": "high",
    "dependencies": [
      "scl-047"
    ],
    "notes": "",
    "portalVisible": true,
    "portalTitle": "Grant domain & website builder access",
    "portalNote": "We'll need access to your domain provider and website builder to set up your funnel.",
    "portalActionRequired": true,
    "portalConfigured": true,
    "sortOrder": 20
  },
  {
    "id": "scl-049",
    "title": "Draft the eBook lead-magnet content with ChatGPT",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [],
    "notes": "Merged SOP steps:\n- Review the client's onboard form to identify their key customer pain points.\n- Open ChatGPT in a new tab and prompt it to create an eBook lead magnet outline for the client's business.\n- Review the generated outline to ensure it covers the specific pain points; prompt for revisions until it meets standards.\n- Prompt ChatGPT for the full eBook content draft that you can review and copy-paste.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 21
  },
  {
    "id": "scl-055",
    "title": "Add client testimonials to the eBook draft",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-049"
    ],
    "notes": "Merged SOP steps:\n- Open a new tab, go to Google, and search the client's company name.\n- Open their Google Reviews and locate the most relevant, recent 5-star reviews.\n- Copy 3 to 5 testimonials into the final section of the Google Doc draft.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 22
  },
  {
    "id": "scl-060",
    "title": "Send the eBook draft for client review & approval",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "high",
    "dependencies": [
      "scl-055"
    ],
    "notes": "Merged SOP steps:\n- Upload or create the Google Doc in the client's assigned Google Drive folder.\n- Send the Google Doc link to the client via LaunchBay for review and approval.\n- Wait for client approval on the text before building the page.",
    "portalVisible": true,
    "portalTitle": "Review & approve your eBook lead magnet content",
    "portalNote": "We'll share a Google Doc link in your portal — please review and send us your feedback.",
    "portalActionRequired": true,
    "portalConfigured": true,
    "sortOrder": 23
  },
  {
    "id": "scl-062",
    "title": "Import the approved doc into Gamma",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-060"
    ],
    "notes": "Merged SOP steps:\n- In Google Docs: File > Download > Microsoft Word (.docx).\n- Log into Gamma.app and open the \"Client eBooks\" folder.\n- Create new AI > Import file > upload the Word document.\n- Select \"Webpage\" as the output format, then Continue.\n- Choose \"Card-by-card\" and confirm \"Yes, split for me\".",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 24
  },
  {
    "id": "scl-072",
    "title": "Refine the Gamma cards & generate the page",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-062"
    ],
    "notes": "Merged SOP steps:\n- Go through each generated card to check how the text is segmented; make manual adjustments as needed.\n- Click Continue, select a visual theme suited to the client's brand, then Generate.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 25
  },
  {
    "id": "scl-077",
    "title": "Apply the client's branding in Gamma",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-072"
    ],
    "notes": "Merged SOP steps:\n- Theme > Customize in the Gamma editor.\n- Open the client's website; use the Color Picker for Chrome extension to grab their primary brand hex, and apply it in Gamma.\n- Use the What The Font extension to identify their font and match it in Gamma's typography settings.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 26
  },
  {
    "id": "scl-082",
    "title": "Set up CTAs & images in Gamma",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-077"
    ],
    "notes": "Merged SOP steps:\n- Select the CTA buttons, set the link display to \"Button\", and paste the client's contact URL.\n- Use Edit Image > Ask AI to generate or replace images to suit the client's services.\n- Review the whole page and make any final layout changes.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 27
  },
  {
    "id": "scl-087",
    "title": "Publish the eBook & copy the live URL",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-082"
    ],
    "notes": "Merged SOP steps:\n- Click Publish.\n- Click View site and copy the live URL.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 28
  },
  {
    "id": "scl-089",
    "title": "Create the Switchy short link for the eBook",
    "category": "Meta Ads Strategy & eBook Creation (Gamma/ChatGPT/Switchy)",
    "phase": "Build",
    "status": "queued",
    "assignee": "Creative Strategist",
    "dueWindow": "Days 2-8",
    "priority": "normal",
    "dependencies": [
      "scl-087"
    ],
    "notes": "Merged SOP steps:\n- Go to Switchy.io and create a New folder named after the client, then Confirm.\n- Paste the Gamma URL into the link field.\n- Customize the short link to the format [clientname]-ebook.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": false,
    "sortOrder": 29
  },
  {
    "id": "scl-095",
    "title": "Build the Meta ad campaign strategy & creatives",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "blocked",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [],
    "notes": "Merged SOP steps:\n- Fill out the Meta Ad Campaign Strategy Doc using the template.\n- Outline the eBook Lead Magnet campaign (broad audience targeting).\n- Outline the Consult Offer campaign (warm retargeting audience).\n- Specify audience targeting details (e.g., ages 35-55+, lookalike audiences, engaged followers).\n- Draft the ad copy, including the Headline and Primary Text.\n- Design the Meta native lead form for the eBook to request Name, Email, Phone, Postcode, and T&Cs agreement.\n- Design the Meta native lead form for the Consult to include one pre-qualifying question (e.g., \"What electrical work do you need help with?\").\n- Create 1 static image and 1 Reel per campaign using Canva, AdCreative.ai, or Mirage.app.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 30
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
      "scl-095"
    ],
    "notes": "",
    "portalVisible": true,
    "portalTitle": "Approve your Meta ad campaigns & creative assets",
    "portalNote": "We'll share your strategy doc and ad creatives in your portal for your final sign-off.",
    "portalActionRequired": true,
    "portalConfigured": true,
    "sortOrder": 31
  },
  {
    "id": "scl-104",
    "title": "Get RT Digital partner access to Meta Business Suite",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-103"
    ],
    "notes": "Merged SOP steps:\n- Instruct the client to add RT Digital as a \"Partner\" in their Meta Business Suite.\n- Send the client the Scribe guide: \"How to Add RT Digital as a Partner on Meta Business Suite\".\n- Provide the client with the RT Digital Business ID to enter.",
    "portalVisible": true,
    "portalTitle": "Add RT Digital as a Partner in your Meta Business Suite",
    "portalNote": "We'll send you our Business ID and a step-by-step guide to complete this in your portal.",
    "portalActionRequired": true,
    "portalConfigured": true,
    "sortOrder": 32
  },
  {
    "id": "scl-107",
    "title": "Assign client's FB Page, Ad Account & Instagram to RT Digital",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-104"
    ],
    "notes": "Merged SOP steps:\n- Once Partner access is granted, log into the RT Digital Meta Business Portfolio.\n- Under \"Users\", click on \"System Users\".\n- Look for mktg@webindiainc.com or jayking6505@gmail.com.\n- Click \"Assign assets\".\n- Select \"Facebook Pages\" from the asset type list.\n- Use the \"Search\" field to look for the client's Facebook Page.\n- Click the checkbox next to the client's Facebook Page.\n- Under \"Partial access\", toggle ON the \"Content, Messages, Community activity, Ads, Insights\" switch.\n- Click \"Ad accounts\" from the asset type list.\n- Use the \"Search\" field to look for the client's Ad Account.\n- Click the checkbox next to the client's Ad Account.\n- Under \"Full control\", toggle ON the \"Manage ad accounts\" switch.\n- Click \"Instagram accounts\" from the asset type list.\n- Use the \"Search\" field and select the client's Instagram account.\n- Assign all permissions for Instagram.\n- Click \"Assign assets\" and then \"Done\".",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 33
  },
  {
    "id": "scl-123",
    "title": "Set up & fund the Ads Team milestone in Upwork",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-107"
    ],
    "notes": "Merged SOP steps:\n- Log into Upwork using credentials in LastPass.\n- Navigate to the Ads Team contracts.\n- Activate the \"Facebook\" setup milestone.\n- Set the hours to 4 hours (at $12/hr = $72).\n- Attach the approved Meta strategy document to the milestone.\n- Fund the milestone so the Ads team can load the campaign.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 34
  },
  {
    "id": "scl-129",
    "title": "Record the ad campaign walkthrough Loom",
    "category": "Meta Ads Setup, Handoff & Partner Access",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-12",
    "priority": "high",
    "dependencies": [
      "scl-123"
    ],
    "notes": "Merged SOP steps:\n- Record a Loom video walking the client through their new live ad campaigns.\n- Explain in the Loom video how the AI will handle incoming leads from the ads via the native lead forms.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 35
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
      "scl-129"
    ],
    "notes": "",
    "portalVisible": true,
    "portalTitle": "Watch your ad campaign walkthrough video",
    "portalNote": "We've recorded a Loom walkthrough of your live campaigns — check your portal messages for the link.",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 36
  },
  {
    "id": "scl-132",
    "title": "Link the client's Google Ads account to the MCC",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [],
    "notes": "Merged SOP steps:\n- Log into the RT Digital Google Ads Manager (MCC) account via the Projects Chrome profile.\n- Go to Sub-account settings.\n- Click the \"+\" (Add) button.\n- Select \"Link existing accounts\".\n- Paste the client's Customer ID into the field.\n- Click \"Send Request\".\n- Message the client instructing them to approve the link request on their end.\n- If the client does not have an ad account, click \"Create a new account\" from the MCC.\n- Grant the client admin access to the newly created ad account.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 37
  },
  {
    "id": "scl-141",
    "title": "Confirm GMB & Google Analytics access",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-132"
    ],
    "notes": "Merged SOP steps:\n- Check Google Business Profile manager under projects@richtraining.com.au to ensure RT Digital is invited to manage it.\n- If the GMB profile is new and unverified, instruct the client to log in and manage verification (e.g., submit a video of their business to Google).\n- Ensure the client sets up and links Google Analytics.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 38
  },
  {
    "id": "scl-144",
    "title": "Fill out the Google Ads Strategy Doc",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-141"
    ],
    "notes": "Merged SOP steps:\n- Fill out the Google Ads Strategy Doc template.\n- Select 3 to 5 focus services to highlight.\n- Define target service areas (exact suburbs or postcodes).\n- Define the campaign objective (e.g., calls, form inquiries).\n- Detail the daily budget.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 39
  },
  {
    "id": "scl-149",
    "title": "Activate the Ads Team keyword-research milestone (Upwork)",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-144"
    ],
    "notes": "Merged SOP steps:\n- Go to Upwork and activate the \"Google ads standard setup\" milestone.\n- Set the milestone for 6 hours.\n- Wait for the Ads Team to return the Keyword Planner spreadsheet.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 40
  },
  {
    "id": "scl-152",
    "title": "Clone the Ads Funnel into the client sub-account",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-149"
    ],
    "notes": "Merged SOP steps:\n- Log into GHL Agency View.\n- Navigate to a live client's sub-account (e.g., Fusion).\n- Go to Sites > Funnels.\n- Find the \"Ads Funnel\".\n- Clone the \"Ads Funnel\" to your new client's sub-account.\n- Open the cloned 2-step funnel (Homepage and Thank You page) in the GHL builder.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 41
  },
  {
    "id": "scl-158",
    "title": "Build the landing page hero, offer & CTAs",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-152"
    ],
    "notes": "Merged SOP steps:\n- Update the Hero Section background image to depict the client's specific services.\n- Upload the client's logo.\n- Update the location text in the Hero Section.\n- Write a clear header offering their service.\n- Write a sub-headline listing the exact areas they serve.\n- Configure the \"Request an Appointment\" CTA button.\n- Configure the \"Click to Call\" CTA button.\n- Link the \"Click to Call\" button to the client's new TradeAI GHL phone number.\n- Edit the text in the Services Section to perfectly match the specific keywords the Ads Team provided for the campaign.\n- Insert simple Call-to-Action buttons between sections so users don't have to scroll to the bottom.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 42
  },
  {
    "id": "scl-168",
    "title": "Create & wire the Google Ads lead form",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-158"
    ],
    "notes": "Merged SOP steps:\n- Navigate away from the funnel builder to Sites > Forms > Builder.\n- Create a new form and name it \"Google Ads Funnel\".\n- Add standard fields to the form: Name, Phone, Email.\n- Add any pre-qualifying questions requested by the client (e.g., \"When is the best time to call?\") using custom fields.\n- Click Save on the form.\n- Go back to the Funnel builder.\n- Replace the placeholder form with your newly created \"Google Ads Funnel\" form to ensure leads are tagged specifically as Google Ad Leads.\n- Set the form action to \"Go to next step\" (Thank You page).",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 43
  },
  {
    "id": "scl-176",
    "title": "Add reviews widget & 'Why Choose Us' section",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "normal",
    "dependencies": [
      "scl-168"
    ],
    "notes": "Merged SOP steps:\n- Update the \"Why Choose Us\" section with their experience, certifications, and brand values.\n- Log into SociableKit.com using projects@richtraining.com.au.\n- Connect their Google Business Profile in SociableKit to generate a live review widget.\n- Embed the SociableKit HTML code on the GHL landing page.\n- If the client lacks project photos, embed their Instagram feed using SociableKit.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 44
  },
  {
    "id": "scl-181",
    "title": "Edit the Thank You page",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "high",
    "dependencies": [
      "scl-176"
    ],
    "notes": "Merged SOP steps:\n- Edit the Thank You page (second funnel step).\n- Add links to their main website and list any secondary services not covered on the homepage.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 45
  },
  {
    "id": "scl-183",
    "title": "Publish, connect domain & send preview for approval",
    "category": "Google Ads Strategy & Landing Page Funnel Creation",
    "phase": "Build",
    "status": "queued",
    "assignee": "Ads Team",
    "dueWindow": "Days 5-18",
    "priority": "normal",
    "dependencies": [
      "scl-181"
    ],
    "notes": "Merged SOP steps:\n- Click Save and Publish.\n- Go to funnel settings and connect their domain.\n- Use the DNS settings provided in their onboarding form to connect the domain.\n- Double-check that all URL paths are correct.\n- Generate a preview link of the funnel via \"Share Funnel\".\n- Send the Ads Team's keyword plan and the GHL landing page preview link to the client for final approval.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 46
  },
  {
    "id": "scl-189",
    "title": "Set up the client's GHL sub-account & access",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [],
    "notes": "Merged SOP steps:\n- Log into GHL Agency View > Settings > Team > Edit Ads Team, and grant the Ads Team access to the client's new GHL sub-account.\n- Set up the GHL sub-account and update the Business Profile.\n- Add the client as a user in GHL with strictly limited permissions: Contacts, Conversations, Dashboard, Opportunities, Tags, Account Settings.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 47
  },
  {
    "id": "scl-192",
    "title": "Generate bot objectives & knowledgebase via CloseBot GPT",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [
      "scl-189"
    ],
    "notes": "Merged SOP steps:\n- Use the CloseBot Objective Builder GPT link (https://chatgpt.com/g/g-67ae76f80150819187fbb5fa67ddcec4-closebot-objective-builder) in a new chat.\n- Change the yellow highlighted sections in the prompt template to reflect the client details (Bot Name, Client Website, Industry Insight, Pain Points, Objections, ICP).\n- Run Task 1 (Generate Bot Details & Objectives Prompt) and Task 2 (Generate Knowledgebase Prompt) together in ChatGPT.\n- Review the output for the 7 standard CloseBot Objectives: Pain Point, Motivation, Service Type, Email, Phone, Timezone, and Book Call.\n- Ensure Max Attempts is set to 2 and Sensitivity is set to 50 for all objectives.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 48
  },
  {
    "id": "scl-197",
    "title": "Clone & configure the CloseBot bot",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "high",
    "dependencies": [
      "scl-192"
    ],
    "notes": "Merged SOP steps:\n- Log into CloseBot (app.closebot.com) using the stored team credentials.\n- Clone the V2 bot (e.g., 'Susan' Agent and 'CONVERT' workflow or 'LenderlyAIv2' bot).\n- Rename the bot to match the client details.\n- Set Persona Name, 'How to Respond' section, and Tone according to the GPT prompt results.\n- Select Provider as RTD OpenAi.\n- Connect to RTDigital Agency and the appropriate client GHL subaccount.\n- Turn ON \"Bot Shutoff Manual Message\".\n- Turn ON \"Graceful Goodbye\".\n- Turn OFF \"Followup Availability\" by default.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 49
  },
  {
    "id": "scl-206",
    "title": "Load knowledgebase & connect calendar booking",
    "category": "AI Bot Build & GHL Configuration",
    "phase": "Build",
    "status": "queued",
    "assignee": "Automation Specialist",
    "dueWindow": "Days 8-13",
    "priority": "normal",
    "dependencies": [
      "scl-197"
    ],
    "notes": "Merged SOP steps:\n- Paste the GPT-generated Knowledgebase into the \"Knowledge\" section (Knowledge library > Create text file).\n- Click \"website scrape\", enter the client's website URL, and select website.\n- Edit sources for both Knowledge entries and link them to the appropriate client subaccount.\n- Ensure conversational booking logic routes to the GHL AI Calendar using the GET method.\n- Log into GHL -> Account -> Calendar -> Calendar Settings, and copy the AI Calendar ID to paste into CloseBot.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 50
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
      "scl-206"
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
    "id": "scl-212",
    "title": "Final build check & self-test the AI funnel",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "critical",
    "dependencies": [],
    "notes": "Merged SOP steps:\n- Perform Final Build Check (Verify users, forms, calendar integrations, and phone routings are flawless).\n- Log into the GHL account.\n- Navigate to Sites -> Funnels -> AI Test Funnel.\n- Click the \"View Page\" button to launch the AI test funnel in a browser.\n- Test the Live Chat and Voice Chat yourself.\n- If either fails, flag a developer via Slack/LaunchBay immediately.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 52
  },
  {
    "id": "scl-218",
    "title": "On the call: confirm the client's connections are working",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-212"
    ],
    "notes": "Merged SOP steps:\n- Ensure Read.ai is recording the client call.\n- On the call, confirm the client has downloaded the LeadConnector App on their phone.\n- Confirm their email signature is set up.\n- Confirm their calendar is connected and user availability/timezone is correct.\n- Confirm social media DMs are connected.\n- Confirm a call to the client's TradeAI phone number rings their LeadConnector mobile app.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 53
  },
  {
    "id": "scl-224",
    "title": "Test your AI receptionist live",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-218"
    ],
    "notes": "Merged SOP steps:\n- Send the client the link to the AI testing environment funnel.\n- Instruct the client to live-chat and speak with the agent.\n- Tell the client to pretend to be different personas (price shopper, emergency, browsing) to try and stump the bot.\n- Collect actionable feedback from the client during the test.",
    "portalVisible": true,
    "portalTitle": "Test your AI receptionist live",
    "portalNote": "Use the link we send you to chat and speak with your AI — try different personas to put it through its paces.",
    "portalActionRequired": true,
    "portalConfigured": true,
    "sortOrder": 54
  },
  {
    "id": "scl-228",
    "title": "Log & apply client test feedback (internal)",
    "category": "AI Test Call & Final Checks (Day 14)",
    "phase": "Testing",
    "status": "queued",
    "assignee": "Voice AI Specialist",
    "dueWindow": "Day 14",
    "priority": "high",
    "dependencies": [
      "scl-224"
    ],
    "notes": "Merged SOP steps:\n- Document the feedback in GHL notes and via Read.ai.\n- Post the feedback in LaunchBay for the AISS Dev Team.\n- Update the CloseBot/snapshot configuration based on the feedback.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 55
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
      "scl-228"
    ],
    "notes": "",
    "portalVisible": true,
    "portalTitle": "Your Go-Live Call is scheduled",
    "portalNote": "We'll confirm the exact date and time via your portal messages.",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 56
  },
  {
    "id": "scl-232",
    "title": "Pre-call: activate automations & billing settings",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "critical",
    "dependencies": [],
    "notes": "Merged SOP steps:\n- CRITICAL PRE-CALL TASK: Go into GHL Automations, search for 001. AISS - Inbound Lead Submitted.\n- Turn this automation from Draft to ON.\n- Go to GHL Settings -> Billing.\n- Update Wallet Settings: Ensure auto-recharge is ON.\n- Set the recharge amount to $100.\n- Set the trigger threshold to $10.\n- Confirm SaaS subscriptions are active.\n- Confirm rebilling fees (2.5x phone items, 3x other items) are set correctly.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 57
  },
  {
    "id": "scl-240",
    "title": "Open the Go-Live call & frame the session",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-232"
    ],
    "notes": "Merged SOP steps:\n- On the call, frame the session: Explain the goal is simplicity and getting the team confident using the live system.\n- Have the client open https://aiss-live.rtdigital.com.au/.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 58
  },
  {
    "id": "scl-242",
    "title": "Walk the client through the live system",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-240"
    ],
    "notes": "Merged SOP steps:\n- Walk the client through the LeadConnector app features.\n- Show them how to navigate Contacts.\n- Show them how to make and receive calls.\n- Show them how to handle missed calls.\n- Show them how to send SMS.\n- Show them how to access and view conversations.\n- Show them how to check push notifications.",
    "portalVisible": true,
    "portalTitle": "Your live system walkthrough",
    "portalNote": "On the Go-Live Call we'll show you how to handle calls, manage contacts, and use notifications.",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 59
  },
  {
    "id": "scl-249",
    "title": "Demo the AI in action & the live lead flow",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-242"
    ],
    "notes": "Merged SOP steps:\n- Demo the AI Summaries (call transcripts, notes, follow-up suggestions) in the contact records.\n- Demo the AI Coaching Notes (call scoring, insights) in the contact records.\n- Demo the AI answering a missed call.\n- Walk through their live ad campaign setup.\n- Submit a live test webform or FB/IG DM to demo an inbound lead.\n- Show them the test lead instantly appearing in the Opportunities pipeline.\n- Show them the AI sending an immediate SMS/Email nurture.\n- Show them how to stop the bot manually by adding the ai off tag.\n- Show them how the opportunity card moves to the \"Booked\" stage.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 60
  },
  {
    "id": "scl-258",
    "title": "Set team usage standards & confirm fees commenced",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-249"
    ],
    "notes": "Merged SOP steps:\n- Establish team usage standards: All business calls must go through the app, avoid personal mobiles, review summaries daily, reply from inside the app.\n- Remind the client that SaaS fees have officially commenced.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 61
  },
  {
    "id": "scl-260",
    "title": "Post-call: confirm live & send recording/support links",
    "category": "Go Live Call (Day 30)",
    "phase": "Go-Live",
    "status": "queued",
    "assignee": "Account Manager",
    "dueWindow": "Day 30",
    "priority": "high",
    "dependencies": [
      "scl-258"
    ],
    "notes": "Merged SOP steps:\n- Post-Call: Send a LaunchBay message confirming their system is live.\n- Include the AISS User Manual link in the message.\n- Include the Read.ai call recording link in the message.\n- Remind them to tag @AISS Developer Team in LaunchBay/Slack for support.",
    "portalVisible": true,
    "portalTitle": "You're live! Access your recording & support links",
    "portalNote": "Your system is now live. Check your portal messages for your call recording and support resources.",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 62
  },
  {
    "id": "scl-264",
    "title": "Verify billing live & update the Accounts sheet",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [],
    "notes": "Merged SOP steps:\n- Open the shared \"AISS Fees Summary for Accounts\" Google Sheet (bookmarked in the #accounts Slack channel).\n- Log into the client's GHL sub-account to confirm their product configuration is active.\n- Log into Stripe and search for the client's company name or customer name.\n- Verify that their monthly billing subscription is active and successfully charging in Stripe.\n- Update the Google Sheet with the product name, SaaS plan name, SaaS fee in AUD (including GST), and Ad management fee.\n- Change their status to \"Live\" in the Google Sheet.\n- Post a message in the #accounts Slack channel tagging Sandy (e.g., \"Hi Sandy, we launched a new client today. Their fees are live. Updated our sheet here: Link\").",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 63
  },
  {
    "id": "scl-271",
    "title": "Weekly Ads Team milestone & performance reports",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-264"
    ],
    "notes": "Merged SOP steps:\n- Every week, log into Upwork.\n- Find the \"Facebook optimization\" milestone for the Ads team.\n- Update the milestone, allocating 2 hours per week per live client.\n- Ensure the Ads team is posting their automated fortnightly and monthly campaign performance reports in LaunchBay.\n- Review the Ads team's recommendations in the reports.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 64
  },
  {
    "id": "scl-276",
    "title": "Mark LaunchBay fee & satisfaction tasks complete (internal)",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-271"
    ],
    "notes": "Merged SOP steps:\n- Mark LaunchBay tasks \"Your SaaS fees will switch on in: 30 days, 14 days, 7 days\" as completed.\n- Mark LaunchBay tasks \"Client Satisfaction Call (Day 3)\" and \"Send A Testimonial (Day 5)\" as completed.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 65
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
      "scl-276"
    ],
    "notes": "",
    "portalVisible": true,
    "portalTitle": "Your Week 1 check-in call",
    "portalNote": "A 30-minute Zoom to review your first week — we'll be in touch to confirm the time.",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 66
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
    "portalVisible": true,
    "portalTitle": "Your Week 2 check-in call",
    "portalNote": "A 30-minute Zoom to review your progress and answer any questions.",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 67
  },
  {
    "id": "scl-308",
    "title": "Ask the client to share a testimonial about their experience.",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Scale CSM",
    "dueWindow": "Week 2–4",
    "priority": "normal",
    "dependencies": [
      "scl-279"
    ],
    "notes": "",
    "portalVisible": true,
    "portalTitle": "Share your experience — send us a testimonial",
    "portalNote": "We'd love to hear how your journey has gone. A short video or written testimonial means the world to us!",
    "portalActionRequired": true,
    "portalConfigured": true,
    "sortOrder": 68
  },
  {
    "id": "scl-280",
    "title": "Transition to monthly check-ins & log follow-ups",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-279"
    ],
    "notes": "Merged SOP steps:\n- Transition to monthly client check-in calls.\n- Send proof of your follow-ups (e.g., Read.ai links, SMS attempts) in LaunchBay.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 69
  },
  {
    "id": "scl-282",
    "title": "Weekly account audit (dashboard, conversations, pipeline)",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-280"
    ],
    "notes": "Merged SOP steps:\n- Perform a Weekly Account Audit: Log into GHL Agency View -> Subaccounts table.\n- Check the client dashboard for call activity, texts, and appointments.\n- Check Conversations to ensure calls are recorded/transcribed, texts are happening, and missed calls result in AI text-backs and AI answering.\n- Check Opportunities pipeline to verify inbound leads are prequalified, nurtured if not responding, followed up by AI, and moving to Booked/Closed stages.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 70
  },
  {
    "id": "scl-286",
    "title": "Support ticket triage & escalation",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-282"
    ],
    "notes": "Merged SOP steps:\n- Monitor all incoming LaunchBay/GHL support requests daily.\n- Create tasks in GHL attached to the contact record for all support tickets.\n- Diagnose issues (configuration, bug, change request).\n- Execute Tier 1 technical fixes yourself: fix configuration issues, adjust automations, resolve integration issues, reconnect services.\n- Escalate Tier 2 technical issues to Joseph or the AISS Dev team.\n- Provide clear documentation and reproduction steps when escalating.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 71
  },
  {
    "id": "scl-292",
    "title": "Weekly CEO pipeline update",
    "category": "Post Go-Live Check-ins, Reporting & Admin",
    "phase": "Post-Launch",
    "status": "queued",
    "assignee": "Support Lead",
    "dueWindow": "Post Go-Live / Weekly",
    "priority": "high",
    "dependencies": [
      "scl-286"
    ],
    "notes": "Merged SOP steps:\n- Update the \"Active Clients Pipeline\" for the Monday CEO Update.\n- Report on: Client Name, Plan/Subscription, Launch Stage, Last Contact Attempt, Last Contact Made, Hot Notes, calls last week/this week, and issues.",
    "portalVisible": false,
    "portalTitle": "",
    "portalNote": "",
    "portalActionRequired": false,
    "portalConfigured": true,
    "sortOrder": 72
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
    "sortOrder": 73
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
    "sortOrder": 74
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
    "sortOrder": 75
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
    "sortOrder": 76
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
    "sortOrder": 77
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
    "sortOrder": 78
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
    "sortOrder": 79
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
    "sortOrder": 80
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
    "sortOrder": 81
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
    "sortOrder": 82
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
    "sortOrder": 83
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
    "sortOrder": 84
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
    "sortOrder": 85
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
    "sortOrder": 86
  }
];

// scl-309 lives in the google-only category so it is automatically excluded for Meta-only clients
export const googleAdsAccessTaskId = "scl-309";

const metaOnlyCategoryIds = new Set([
  "scale-04-meta-ads-strategy-ebook-creation-gamma-chatgpt-switc",
  "scale-05-meta-ads-setup-handoff-partner-access",
]);

const googleOnlyCategoryIds = new Set([
  "scale-06-google-ads-strategy-landing-page-funnel-creation",
]);

export function scaleCategoriesForVariant(variant: ScaleVariant = "meta_google") {
  if (variant === "meta_google") {
    return scaleCategories;
  }

  if (variant === "meta") {
    return scaleCategories.filter((category) => !googleOnlyCategoryIds.has(category.id));
  }

  return scaleCategories.filter((category) => !metaOnlyCategoryIds.has(category.id));
}

export function scaleTasksForVariant(variant: ScaleVariant = "meta_google") {
  const allowedCategories = new Set(scaleCategoriesForVariant(variant).map((category) => category.name));
  const tasks = scaleTasks.filter((task) => allowedCategories.has(task.category));
  // Inject the Google Ads access task (scl-309) for google/meta_google variants only
  if (variant === "google" || variant === "meta_google") {
    const googleAdsAccessTask: Task = {
      id: "scl-309",
      title: "Chase the client to provide admin access to Google Ads Manager and Google Analytics.",
      category: "Google Ads Strategy & Landing Page Funnel Creation",
      phase: "Build",
      status: "queued",
      assignee: "Account Manager",
      dueWindow: "Days 1-5",
      priority: "high",
      dependencies: [],
      notes: "",
      portalVisible: true,
      portalTitle: "Grant access to Google Ads Manager & Google Analytics",
      portalNote: "We'll need admin access to your Google Ads account and Google Analytics to set up tracking and campaigns.",
      portalActionRequired: true,
      portalConfigured: true,
      sortOrder: 309,
    };
    if (!tasks.find((t) => t.id === googleAdsAccessTask.id)) {
      tasks.push(googleAdsAccessTask);
    }
  }
  return tasks;
}
