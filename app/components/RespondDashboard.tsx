"use client";

import { useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from "react";
import {
  defaultEnvironment,
  defaultProduct,
  environmentConfig,
  environmentProductClients,
  operatingEnvironments,
  productCategories,
  productConfig,
  productTasks,
  productTeamMembers,
  productWorkspaces,
  type OperatingEnvironment,
  type ProductWorkspace,
} from "../../lib/productWorkspaces";
import { missionTimelineDays } from "../../lib/respondClients";
import type {
  Category,
  ClientCreatePayload,
  ClientHealth,
  ClientRisk,
  EnvironmentKey,
  ProductKey,
  RespondClient,
  Task,
  TaskStatus,
  TaskUpdatePayload,
} from "../../lib/types";
import { statusLabels, taskStatuses } from "../../lib/types";

interface DashboardProps {
  initialEnvironment: EnvironmentKey;
  initialProduct: ProductKey;
  initialTasks: Task[];
  initialCategories: Category[];
  initialTeamMembers: string[];
  initialClients: RespondClient[];
}

const phaseOrder = ["Onboarding", "Build", "Testing", "Go-Live", "Post-Launch", "Support"];
const statusColumnDetails: Record<TaskStatus, string> = {
  queued: "Ready to start",
  in_progress: "Being worked",
  blocked: "Needs attention",
  review: "Awaiting review",
  complete: "Done",
};

type ThemeMode = "dark" | "light";
type AppSection = "home" | "tasks";
type AttachmentFilter = "all" | "loom" | "forms";
type TourTarget =
  | "mission-header"
  | "portfolio"
  | "client-cards"
  | "saved-lenses"
  | "attention"
  | "tasks-header"
  | "task-board"
  | "task-inspector"
  | "filters"
  | "theme";

interface TourStep {
  section: AppSection;
  target: TourTarget;
  title: string;
  body: string;
  clientId?: string;
}

const tourSteps: TourStep[] = [
  {
    section: "home",
    target: "mission-header",
    title: "Start with Mission Control",
    body: "This is the daily command centre for client delivery. Use it to see portfolio health, urgent work, and where each client is in the onboarding path.",
  },
  {
    section: "home",
    target: "portfolio",
    title: "Read the portfolio health strip",
    body: "These metrics show total clients, risk, holds, near-term go-lives, and overall health so the team can quickly decide where attention is needed.",
  },
  {
    section: "home",
    target: "client-cards",
    title: "Select a client",
    body: "Client tiles summarize owner, phase, readiness, health, and go-live timing. Selecting a client narrows the attention view before opening the workflow board.",
  },
  {
    section: "home",
    target: "saved-lenses",
    title: "Use saved lenses",
    body: "The saved lenses are fast filters for daily operating rituals: waiting on client, go-live next 30 days, and high-risk work.",
  },
  {
    section: "home",
    target: "attention",
    title: "Review what needs attention",
    body: "This table turns the portfolio into next actions. Check the issue, owner, last update, next step, risk level, and blocker before standup.",
  },
  {
    section: "tasks",
    target: "tasks-header",
    title: "Open the task board",
    body: "The task area keeps the same client context and shows the master operational checklist for onboarding and delivery work.",
    clientId: "northlane-health",
  },
  {
    section: "tasks",
    target: "task-board",
    title: "Move work through statuses",
    body: "Drag cards between columns or use the quick actions on each card to mark work done, return it to review, or flag blockers.",
    clientId: "northlane-health",
  },
  {
    section: "tasks",
    target: "task-inspector",
    title: "Open the task detail modal",
    body: "Select a task card to hold your place on the board, then open the detail view to update status, assignee, category, due window, notes, portal settings, and dependencies.",
    clientId: "northlane-health",
  },
  {
    section: "tasks",
    target: "filters",
    title: "Filter the workflow",
    body: "Use client, status, owner, and category filters to reduce the board to the exact operational slice you need.",
    clientId: "northlane-health",
  },
  {
    section: "tasks",
    target: "theme",
    title: "Choose the working mode",
    body: "Dark mode gives the Mission Control feel for delivery reviews. Light mode is available for calmer review sessions or screenshares.",
    clientId: "northlane-health",
  },
];

const clientHealthLabels: Record<ClientHealth, string> = {
  on_track: "On track",
  at_risk: "At risk",
  off_track: "Off track",
  on_hold: "On hold",
};

const clientRiskLabels: Record<ClientRisk, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const missionToday = Date.parse("2026-06-13T00:00:00Z");
const missionThirtyDayLimit = Date.parse("2026-07-13T00:00:00Z");

type ActiveClientPipelineOpportunity = {
  id: string;
  title: string;
  businessName?: string;
  source?: string;
  value: number;
  valueLabel: string;
  owner?: string;
  initials: string;
  updatedAt?: string;
};

type ActiveClientPipelineStage = {
  id: string;
  name: string;
  tone: string;
  count: number;
  value: number;
  valueLabel: string;
  opportunities: ActiveClientPipelineOpportunity[];
};

type ActiveClientPipelineData = {
  id: string;
  name: string;
  syncedAt: string;
  stages: ActiveClientPipelineStage[];
};

function demoPipelineOpportunity(
  id: string,
  title: string,
  businessName: string,
  source: string,
  valueLabel: string,
  initials: string
): ActiveClientPipelineOpportunity {
  return {
    id,
    title,
    businessName,
    source,
    value: 0,
    valueLabel,
    initials,
  };
}

function demoPipelineStage(
  id: string,
  name: string,
  tone: string,
  count: number,
  valueLabel: string,
  opportunities: ActiveClientPipelineOpportunity[]
): ActiveClientPipelineStage {
  return {
    id,
    name,
    tone,
    count,
    value: 0,
    valueLabel,
    opportunities,
  };
}

const demoActiveClientPipeline: ActiveClientPipelineData = {
  id: "demo-active-clients",
  name: "Active Clients",
  syncedAt: "2026-06-15T00:00:00.000Z",
  stages: [
    demoPipelineStage("urgent", "Urgent", "urgent", 3, "AU$250.00", [
      demoPipelineOpportunity("shiva-smyth", "Shiva Smyth", "Geoscape", "Rich Latimer 60 Min", "AU$0.00", "SS"),
      demoPipelineOpportunity("kevin-french", "Kevin French", "CWP Painting", "Inbound: RESPOND Meta Ad", "AU$250.00", "KF"),
      demoPipelineOpportunity("lance-murphy", "Lance Murphy - TAI Respond", "Murphy's Fencing", "Resvita - TradeAi Demo Booking", "AU$0.00", "LM"),
    ]),
    demoPipelineStage("onboarding", "Onboarding", "onboarding", 1, "AU$1,250.00", [
      demoPipelineOpportunity("bruce-chaplin", "Bruce Chaplin - BCTD Management", "BCTD Management PTY LTD", "Outbound", "AU$1,250.00", "BC"),
    ]),
    demoPipelineStage("building", "Building", "building", 3, "AU$12,500.00", [
      demoPipelineOpportunity("ben-baker", "Ben Baker", "AT", "Outbound", "AU$0.00", "BB"),
      demoPipelineOpportunity("scott-lambert", "Scott Lambert", "Doctor Damp", "Outbound", "AU$7,500.00", "SL"),
      demoPipelineOpportunity("bear-olive", "Bear Olive - MiracleMint", "MiracleMint", "Inbound: Lenderly AI Typeform", "AU$5,000.00", "BO"),
    ]),
    demoPipelineStage("recently-active", "Recently Active", "recent", 2, "AU$1,250.00", [
      demoPipelineOpportunity("melissa-arlitsch", "Melissa Arlitsch", "Discovery Coast Build Pty Ltd", "Inbound: RESPOND Meta Ad", "AU$1,250.00", "MA"),
      demoPipelineOpportunity("nicole-cannon", "Nicole Cannon", "Pink Finance", "Rich Latimer 60 Min", "AU$0.00", "NC"),
    ]),
    demoPipelineStage("live-month", "Live > 1 month", "live", 15, "AU$16,100.00", [
      demoPipelineOpportunity("troy-rudoll", "Troy Rudoll", "Patriot Homes", "Inbound: ActiveCampaign", "AU$0.00", "TR"),
      demoPipelineOpportunity("patrick-franzini", "Patrick Franzini", "Good News Electrical", "TradeAI - Demo Bookings", "AU$1,100.00", "PF"),
      demoPipelineOpportunity("david-evan", "David and Evan", "MDS Solar", "Inbound: ActiveCampaign", "AU$0.00", "DE"),
      demoPipelineOpportunity("veronica-jones", "Veronica Jones", "Anstey Homes", "Outbound", "AU$0.00", "VJ"),
      demoPipelineOpportunity("jason-king", "Jason King", "KYTEK Joinery Pty Ltd", "Outbound", "AU$0.00", "JK"),
    ]),
    demoPipelineStage("paused", "Paused", "paused", 3, "AU$5,000.00", [
      demoPipelineOpportunity("kane-bannam", "Kane Bannam", "Bannam Building", "Inbound voice", "AU$0.00", "KB"),
      demoPipelineOpportunity("adam-donnelly", "Adam Donnelly", "High Quality Roofworx Pty Ltd", "Inbound: TradeAI Typeform", "AU$0.00", "AD"),
      demoPipelineOpportunity("robert-de-marcellis", "Robert De Marcellis", "Foresight Constructions", "Inbound: ActiveCampaign", "AU$5,000.00", "RD"),
    ]),
    demoPipelineStage("exiting", "Exiting", "exiting", 2, "AU$5,000.00", [
      demoPipelineOpportunity("darren-oke", "Darren Oke", "Oke Builders", "WSC Webinar", "AU$0.00", "DO"),
      demoPipelineOpportunity("daniel-scothern", "TSA - Daniel Scothern", "TradeAi Basic", "TSA - TradeAi Demo Booking", "AU$5,000.00", "DS"),
    ]),
    demoPipelineStage("cancelled", "Cancelled", "cancelled", 23, "AU$161,000.00", [
      demoPipelineOpportunity("josh-waldron", "Josh Waldron", "Resvita Coaching", "Inbound voice", "AU$0.00", "JW"),
      demoPipelineOpportunity("chris-ling", "Chris Ling - TAI Respond", "Champion Accountants", "Checkout Funnel (AUD)", "AU$1,250.00", "CL"),
      demoPipelineOpportunity("camille-williams", "Camille Williams", "MD Wealth Fortress", "Rich Latimer 60 Min", "AU$15,000.00", "CW"),
      demoPipelineOpportunity("marko-jelinic", "Marko Jelinic - Dinamo Group", "Dinamo Group", "Outbound", "AU$7,500.00", "MJ"),
      demoPipelineOpportunity("sophie-mclean", "Sophie McLean", "Your Property Profits", "Typeform Onboarding", "AU$5,000.00", "SM"),
    ]),
  ],
};

function Icon({
  name,
}: {
  name:
    | "search"
    | "filter"
    | "plus"
    | "check"
    | "link"
    | "user"
    | "calendar"
    | "move"
    | "home"
    | "tasks"
    | "users"
    | "alert"
    | "chart"
    | "clock"
    | "sun"
    | "moon"
    | "play"
    | "video"
    | "settings"
    | "download"
    | "trash"
    | "x";
}) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "search") {
    return (
      <svg {...common}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    );
  }

  if (name === "filter") {
    return (
      <svg {...common}>
        <path d="M4 5h16" />
        <path d="M7 12h10" />
        <path d="M10 19h4" />
      </svg>
    );
  }

  if (name === "plus") {
    return (
      <svg {...common}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    );
  }

  if (name === "check") {
    return (
      <svg {...common}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    );
  }

  if (name === "link") {
    return (
      <svg {...common}>
        <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.2 1.2" />
        <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2a5 5 0 0 0 7.1 7.1l1.2-1.2" />
      </svg>
    );
  }

  if (name === "download") {
    return (
      <svg {...common}>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
    );
  }

  if (name === "x") {
    return (
      <svg {...common}>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    );
  }

  if (name === "trash") {
    return (
      <svg {...common}>
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 15H6L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </svg>
    );
  }

  if (name === "user") {
    return (
      <svg {...common}>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <circle cx="12" cy="8" r="4" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
      </svg>
    );
  }

  if (name === "home") {
    return (
      <svg {...common}>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </svg>
    );
  }

  if (name === "tasks") {
    return (
      <svg {...common}>
        <path d="M8 6h13" />
        <path d="M8 12h13" />
        <path d="M8 18h13" />
        <path d="m3 6 .8.8L5.5 5" />
        <path d="m3 12 .8.8 1.7-1.8" />
        <path d="m3 18 .8.8 1.7-1.8" />
      </svg>
    );
  }

  if (name === "users") {
    return (
      <svg {...common}>
        <path d="M16 21a6 6 0 0 0-12 0" />
        <circle cx="10" cy="8" r="4" />
        <path d="M22 20a5 5 0 0 0-5-5" />
        <path d="M17 4a3 3 0 0 1 0 6" />
      </svg>
    );
  }

  if (name === "alert") {
    return (
      <svg {...common}>
        <path d="M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    );
  }

  if (name === "chart") {
    return (
      <svg {...common}>
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="m7 15 4-4 3 3 5-7" />
      </svg>
    );
  }

  if (name === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (name === "sun") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="m17.66 17.66 1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="m6.34 17.66-1.41 1.41" />
        <path d="m19.07 4.93-1.41 1.41" />
      </svg>
    );
  }

  if (name === "moon") {
    return (
      <svg {...common}>
        <path d="M20.5 14.4A8.5 8.5 0 0 1 9.6 3.5 8.5 8.5 0 1 0 20.5 14.4Z" />
      </svg>
    );
  }

  if (name === "play") {
    return (
      <svg {...common}>
        <path d="M8 5v14l11-7Z" />
      </svg>
    );
  }

  if (name === "video") {
    return (
      <svg {...common}>
        <path d="M15 10.5 20 7v10l-5-3.5" />
        <rect x="3" y="6" width="12" height="12" rx="2" />
      </svg>
    );
  }

  if (name === "settings") {
    return (
      <svg {...common}>
        <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 0 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L4.2 7A2 2 0 0 1 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 0 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M12 3v18" />
      <path d="m8 7 4-4 4 4" />
      <path d="m8 17 4 4 4-4" />
      <path d="M3 12h18" />
      <path d="m7 8-4 4 4 4" />
      <path d="m17 8 4 4-4 4" />
    </svg>
  );
}

function AttachmentLensSettings({
  attachmentFilter,
  attachmentCounts,
  onAttachmentFilterChange,
  adminEditing,
  onAdminEditingChange,
  variant = "rail",
}: {
  attachmentFilter: AttachmentFilter;
  attachmentCounts: { looms: number; forms: number };
  onAttachmentFilterChange: (filter: AttachmentFilter) => void;
  adminEditing: boolean;
  onAdminEditingChange: (enabled: boolean) => void;
  variant?: "rail" | "compact";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const settingsRef = useRef<HTMLElement>(null);
  const hasActiveLens = attachmentFilter !== "all" || adminEditing;
  const isCompact = variant === "compact";

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    function closeOnOutsidePointer(event: PointerEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePointer);

    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
    };
  }, [isOpen]);

  function toggleAttachmentFilter(filter: Exclude<AttachmentFilter, "all">) {
    onAttachmentFilterChange(attachmentFilter === filter ? "all" : filter);
  }

  return (
    <section className={`${isOpen ? "rail-settings rail-settings-open" : "rail-settings"} ${isCompact ? "rail-settings-compact" : ""}`} aria-label="Settings" ref={settingsRef}>
      {isOpen ? (
        <div className="rail-settings-menu" id="task-rail-settings-menu" role="menu">
          <div className="rail-settings-title">
            <Icon name="settings" />
            <span>Settings</span>
          </div>
          <div className="attachment-lenses" aria-label="Attachment filters">
            <button type="button" className={attachmentFilter === "loom" ? "active" : ""} aria-pressed={attachmentFilter === "loom"} onClick={() => toggleAttachmentFilter("loom")}>
              <span>
                <Icon name="video" />
                Looms
              </span>
              <strong>{attachmentCounts.looms}</strong>
            </button>
            <button type="button" className={attachmentFilter === "forms" ? "active" : ""} aria-pressed={attachmentFilter === "forms"} onClick={() => toggleAttachmentFilter("forms")}>
              <span>
                <Icon name="link" />
                Forms
              </span>
              <strong>{attachmentCounts.forms}</strong>
            </button>
          </div>
          <div className="rail-settings-divider" />
          <div className="attachment-lenses admin-settings" aria-label="Admin controls">
            <button type="button" className={adminEditing ? "active" : ""} aria-pressed={adminEditing} onClick={() => onAdminEditingChange(!adminEditing)}>
              <span>
                <Icon name="settings" />
                Admin editing
              </span>
              <strong>{adminEditing ? "On" : "Off"}</strong>
            </button>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        className={hasActiveLens ? "rail-settings-button active" : "rail-settings-button"}
        aria-label={isCompact ? "Settings" : undefined}
        title={isCompact ? "Settings" : undefined}
        aria-expanded={isOpen}
        aria-controls="task-rail-settings-menu"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>
          <Icon name="settings" />
          {isCompact ? null : "Settings"}
        </span>
      </button>
    </section>
  );
}

function ThemeToggle({ theme, onThemeChange }: { theme: ThemeMode; onThemeChange: (theme: ThemeMode) => void }) {
  return (
    <div className="theme-toggle" aria-label="Theme mode">
      <button type="button" className={theme === "dark" ? "active" : ""} onClick={() => onThemeChange("dark")} title="Use dark mode">
        <Icon name="moon" />
        Dark
      </button>
      <button type="button" className={theme === "light" ? "active" : ""} onClick={() => onThemeChange("light")} title="Use light mode">
        <Icon name="sun" />
        Light
      </button>
    </div>
  );
}

function RespondMark({ className }: { className: string }) {
  return <span className={`${className} respond-mark-image`} aria-hidden="true" />;
}

function ProductSwitcher({
  activeProduct,
  onProductChange,
}: {
  activeProduct: ProductKey;
  onProductChange: (product: ProductKey) => void;
}) {
  return (
    <div className="product-switcher" aria-label="Client workspace">
      <span>Workspace</span>
      <div>
        {productWorkspaces.map((workspace) => (
          <button
            type="button"
            key={workspace.key}
            className={activeProduct === workspace.key ? "active" : ""}
            onClick={() => onProductChange(workspace.key)}
            title={workspace.description}
          >
            <RespondMark className="product-switcher-mark" />
            <span>{workspace.clientLabel}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function EnvironmentSwitcher({
  activeEnvironment,
  onEnvironmentChange,
}: {
  activeEnvironment: EnvironmentKey;
  onEnvironmentChange: (environment: EnvironmentKey) => void;
}) {
  return (
    <div className="environment-switcher" aria-label="Operating environment">
      <span>Mode</span>
      <div>
        {operatingEnvironments.map((environment) => (
          <button
            type="button"
            key={environment.key}
            className={activeEnvironment === environment.key ? "active" : ""}
            onClick={() => onEnvironmentChange(environment.key)}
            title={environment.description}
          >
            {environment.shortLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

function WalkthroughPanel({
  step,
  stepIndex,
  totalSteps,
  onBack,
  onNext,
  onSkip,
}: {
  step: TourStep | null;
  stepIndex: number | null;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
}) {
  if (!step || stepIndex === null) {
    return null;
  }

  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  return (
    <aside className="walkthrough-panel" aria-live="polite" aria-label="Platform walkthrough">
      <div className="walkthrough-kicker">
        <span>Walkthrough</span>
        <strong>
          Step {stepIndex + 1} of {totalSteps}
        </strong>
      </div>
      <h2>{step.title}</h2>
      <p>{step.body}</p>
      <div className="walkthrough-progress" aria-hidden="true">
        <span style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }} />
      </div>
      <div className="walkthrough-actions">
        <button type="button" className="walkthrough-secondary" onClick={onSkip}>
          Skip
        </button>
        <div>
          <button type="button" className="walkthrough-secondary" onClick={onBack} disabled={isFirst}>
            Back
          </button>
          <button type="button" className="walkthrough-primary" onClick={onNext}>
            {isLast ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </aside>
  );
}

function initials(name: string) {
  if (name === "Unassigned") {
    return "--";
  }

  return name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getDependencyState(task: Task, taskMap: Map<string, Task>) {
  const dependencies = task.dependencies.map((id) => taskMap.get(id)).filter((item): item is Task => Boolean(item));
  const open = dependencies.filter((item) => item.status !== "complete");

  return {
    dependencies,
    open,
    isBlockedByDependencies: open.length > 0,
  };
}

function normalizeText(value: string) {
  return value.toLowerCase().trim();
}

function safeInstructionUrl(value: string | null | undefined) {
  const clean = value?.trim() ?? "";
  return /^https?:\/\//i.test(clean) ? clean : "";
}

function taskHasLoom(task: Task) {
  return Boolean(safeInstructionUrl(task.loomUrl));
}

function taskHasClientForm(task: Task) {
  return Boolean(safeInstructionUrl(task.portalActionUrl));
}

function useFilteredTasks(tasks: Task[], query: string, category: string, owner: string, status: string, attachments: AttachmentFilter) {
  return useMemo(() => {
    const text = normalizeText(query);

    return tasks.filter((task) => {
      const matchesText =
        !text ||
        normalizeText(task.title).includes(text) ||
        normalizeText(task.category).includes(text) ||
        normalizeText(task.assignee).includes(text);
      const matchesCategory = category === "all" || task.category === category;
      const matchesOwner = owner === "all" || task.assignee === owner;
      const matchesStatus = status === "all" || task.status === status;
      const matchesAttachment = attachments === "all" || (attachments === "loom" ? taskHasLoom(task) : taskHasClientForm(task));

      return matchesText && matchesCategory && matchesOwner && matchesStatus && matchesAttachment;
    });
  }, [tasks, query, category, owner, status, attachments]);
}

interface TaskNavigationOrder {
  categoryOrder: Map<string, number>;
  templateOrder: Map<string, number>;
}

const categoryOrderBucket = 100_000;
const customTaskOffset = 50_000;

function buildTaskNavigationOrder(categories: Category[], templateTasks: Task[]): TaskNavigationOrder {
  const categoryOrder = new Map<string, number>();

  for (const phase of phaseOrder) {
    for (const category of categories) {
      if (category.phase === phase && !categoryOrder.has(category.name)) {
        categoryOrder.set(category.name, categoryOrder.size);
      }
    }
  }

  for (const category of categories) {
    if (!categoryOrder.has(category.name)) {
      categoryOrder.set(category.name, categoryOrder.size);
    }
  }

  const templateOrder = new Map<string, number>();
  const withinCategoryCounts = new Map<string, number>();

  for (const task of templateTasks) {
    const categoryRank = categoryOrder.get(task.category) ?? categoryOrder.size;
    const withinCategoryRank = withinCategoryCounts.get(task.category) ?? 0;
    withinCategoryCounts.set(task.category, withinCategoryRank + 1);
    templateOrder.set(task.id, categoryRank * categoryOrderBucket + withinCategoryRank);
  }

  return { categoryOrder, templateOrder };
}

function templateKeyForTask(task: Task) {
  if (task.templateId) {
    return task.templateId;
  }

  const scopedParts = task.id.split("__");
  return scopedParts.length > 1 ? scopedParts[scopedParts.length - 1] : task.id;
}

function taskNavigationRank(task: Task, order: TaskNavigationOrder) {
  const templateRank = order.templateOrder.get(templateKeyForTask(task));

  if (templateRank !== undefined) {
    return templateRank;
  }

  const categoryRank = order.categoryOrder.get(task.category) ?? order.categoryOrder.size;
  return categoryRank * categoryOrderBucket + customTaskOffset + task.sortOrder;
}

function compareTasksByNavigationOrder(a: Task, b: Task, order: TaskNavigationOrder) {
  const rankDifference = taskNavigationRank(a, order) - taskNavigationRank(b, order);

  if (rankDifference !== 0) {
    return rankDifference;
  }

  const sortDifference = a.sortOrder - b.sortOrder;

  if (sortDifference !== 0) {
    return sortDifference;
  }

  return a.title.localeCompare(b.title);
}

function taskWorkspaceKey(environment: EnvironmentKey, product: ProductKey, clientId: string) {
  return clientId ? `${environment}:${product}:${clientId}` : "";
}

function TaskCard({
  task,
  taskMap,
  active,
  adminEditing,
  isDeleting,
  onSelect,
  onQuickMove,
  onTitleChange,
  onDelete,
  onDragStart,
}: {
  task: Task;
  taskMap: Map<string, Task>;
  active: boolean;
  adminEditing: boolean;
  isDeleting: boolean;
  onSelect: (task: Task) => void;
  onQuickMove: (task: Task, status: TaskStatus) => void;
  onTitleChange: (task: Task, title: string) => void;
  onDelete: (task: Task) => void;
  onDragStart: (task: Task) => void;
}) {
  const [draftState, setDraftState] = useState(() => ({
    sourceTitle: task.title,
    taskId: task.id,
    title: task.title,
  }));
  const draftTitle = draftState.taskId === task.id && draftState.sourceTitle === task.title ? draftState.title : task.title;
  const dependencyState = getDependencyState(task, taskMap);
  const isDone = task.status === "complete";
  const loomUrl = safeInstructionUrl(task.loomUrl);
  const dependencySummary =
    dependencyState.dependencies.length === 0
      ? "None"
      : dependencyState.isBlockedByDependencies
        ? `${dependencyState.open.length} open`
        : `${dependencyState.dependencies.length} cleared`;

  function updateDraftTitle(title: string) {
    setDraftState({
      sourceTitle: task.title,
      taskId: task.id,
      title,
    });
  }

  function commitTitle() {
    const cleanTitle = draftTitle.trim();

    if (!cleanTitle) {
      updateDraftTitle(task.title);
      return;
    }

    if (cleanTitle !== task.title) {
      onTitleChange(task, cleanTitle);
    }
  }

  return (
    <article
      className={`task-card ${active ? "task-card-active" : ""} ${adminEditing ? "task-card-admin" : ""}`}
      draggable={!adminEditing}
      onDragStart={() => onDragStart(task)}
      onClick={() => onSelect(task)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(task);
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={active}
    >
      <div className="task-card-topline">
        {adminEditing ? (
          <input
            className="task-title-edit"
            aria-label="Task title"
            value={draftTitle}
            onChange={(event) => updateDraftTitle(event.target.value)}
            onBlur={commitTitle}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              event.stopPropagation();

              if (event.key === "Enter") {
                event.preventDefault();
                commitTitle();
                event.currentTarget.blur();
              }

              if (event.key === "Escape") {
                updateDraftTitle(task.title);
                event.currentTarget.blur();
              }
            }}
          />
        ) : (
          <h3>{task.title}</h3>
        )}
        <span className="avatar" title={task.assignee}>
          {initials(task.assignee)}
        </span>
      </div>
      <dl className="task-card-details">
        <div>
          <dt>Category:</dt>
          <dd>{task.category}</dd>
        </div>
        <div>
          <dt>Owner:</dt>
          <dd>{task.assignee}</dd>
        </div>
        <div>
          <dt>Due:</dt>
          <dd>{task.dueWindow || "-"}</dd>
        </div>
        <div>
          <dt>Dependencies:</dt>
          <dd>{dependencySummary}</dd>
        </div>
      </dl>
      <div className="task-card-footer">
        <span className={`priority priority-${task.priority}`}>{task.priority}</span>
        {loomUrl ? (
          <span className="loom-card-indicator" title={task.loomTitle || "Loom instructions attached"}>
            <Icon name="video" />
          </span>
        ) : null}
        <span className={`dependency-chip ${dependencyState.isBlockedByDependencies ? "dependency-open" : ""}`}>
          <Icon name="link" />
          {dependencyState.dependencies.length}
        </span>
        {task.portalVisible ? <span className="portal-chip">Portal</span> : null}
        <div className="task-actions" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
          {adminEditing ? (
            <button type="button" className="admin-delete-task" onClick={() => onDelete(task)} disabled={isDeleting} title="Delete task">
              <Icon name="trash" />
              {isDeleting ? "Deleting" : "Delete"}
            </button>
          ) : null}
          {isDone ? (
            <button type="button" onClick={() => onQuickMove(task, "review")} title="Move back to review">
              Review
            </button>
          ) : (
            <button type="button" onClick={() => onQuickMove(task, "complete")} title="Mark complete">
              <Icon name="check" />
              Done
            </button>
          )}
          {dependencyState.isBlockedByDependencies && task.status !== "blocked" ? (
            <button type="button" onClick={() => onQuickMove(task, "blocked")} title="Mark blocked">
              Block
            </button>
          ) : null}
        </div>
        <span className="drag-handle" title="Drag to move status">
          <Icon name="move" />
        </span>
      </div>
    </article>
  );
}

function TaskDetailModal({
  task,
  taskMap,
  categories,
  teamMembers,
  isPending,
  onClose,
  onUpdate,
  onOpenDependency,
}: {
  task: Task;
  taskMap: Map<string, Task>;
  categories: Category[];
  teamMembers: string[];
  isPending: boolean;
  onClose: () => void;
  onUpdate: (id: string, payload: TaskUpdatePayload) => void;
  onOpenDependency: (task: Task) => void;
}) {
  const [showLoomEditor, setShowLoomEditor] = useState(Boolean(safeInstructionUrl(task.loomUrl)));
  const [showPortalActionEditor, setShowPortalActionEditor] = useState(Boolean(safeInstructionUrl(task.portalActionUrl)));
  const loomUrl = safeInstructionUrl(task.loomUrl);
  const loomLabel = task.loomTitle?.trim() || "Loom instructions";
  const portalActionUrl = safeInstructionUrl(task.portalActionUrl);
  const portalActionLabel = task.portalActionLabel?.trim() || "Complete form";

  return (
    <div className="modal-backdrop task-modal-backdrop" onClick={onClose}>
      <section className="task-detail-modal" role="dialog" aria-modal="true" aria-labelledby="task-detail-title" onClick={(event) => event.stopPropagation()}>
        <header className="task-modal-head">
          <div>
            <div className="task-modal-chip-row">
              <span className={`priority priority-${task.priority}`}>{task.priority}</span>
              <button
                type="button"
                className={loomUrl ? "task-loom-trigger active" : "task-loom-trigger"}
                onClick={() => setShowLoomEditor((current) => !current)}
              >
                <Icon name="video" />
                {loomUrl ? "Loom" : "Add Loom"}
              </button>
              <button
                type="button"
                className={portalActionUrl ? "task-portal-action-trigger active" : "task-portal-action-trigger"}
                onClick={() => setShowPortalActionEditor((current) => !current)}
              >
                <Icon name="link" />
                {portalActionUrl ? "Form" : "Add form"}
              </button>
              {loomUrl ? (
                <a className="task-loom-open" href={loomUrl} target="_blank" rel="noreferrer">
                  <Icon name="play" />
                  Watch
                </a>
              ) : null}
              {portalActionUrl ? (
                <a className="task-portal-action-open" href={portalActionUrl} target="_blank" rel="noreferrer">
                  <Icon name="play" />
                  Open
                </a>
              ) : null}
            </div>
            <h2 id="task-detail-title">{task.title}</h2>
            <p>
              {task.category} / {task.phase}
            </p>
          </div>
          <button type="button" className="modal-close-button" onClick={onClose} aria-label="Close task details">
            <Icon name="x" />
          </button>
        </header>

        <div className="task-modal-summary" aria-label="Task summary">
          <div>
            <span>Status</span>
            <strong>{statusLabels[task.status]}</strong>
          </div>
          <div>
            <span>Owner</span>
            <strong>{task.assignee}</strong>
          </div>
          <div>
            <span>Due window</span>
            <strong>{task.dueWindow || "No date"}</strong>
          </div>
          <div>
            <span>Portal</span>
            <strong>{task.portalVisible ? "Visible" : "Hidden"}</strong>
          </div>
        </div>

        <div className="task-modal-body">
          <section className="task-modal-section">
            <label>
              Status
              <div className="status-grid">
                {taskStatuses.map((status) => (
                  <button
                    type="button"
                    key={status}
                    className={task.status === status ? "active" : ""}
                    onClick={() => onUpdate(task.id, { status })}
                  >
                    {statusLabels[status]}
                  </button>
                ))}
              </div>
            </label>

            <div className="task-field-grid">
              <label>
                Assignee
                <select aria-label="Assignee" value={task.assignee} onChange={(event) => onUpdate(task.id, { assignee: event.target.value })}>
                  {teamMembers.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Category
                <select aria-label="Category" value={task.category} onChange={(event) => onUpdate(task.id, { category: event.target.value })}>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Due window
              <input aria-label="Due window" value={task.dueWindow} onChange={(event) => onUpdate(task.id, { dueWindow: event.target.value })} />
            </label>

            <label>
              Notes
              <textarea aria-label="Notes" value={task.notes} onChange={(event) => onUpdate(task.id, { notes: event.target.value })} placeholder="Add context for the team" />
            </label>

            {showLoomEditor || loomUrl ? (
              <div className="loom-editor">
                <div className="inspector-section-title">
                  <Icon name="video" />
                  Loom instructions
                </div>
                {loomUrl ? (
                  <a className="loom-watch-link" href={loomUrl} target="_blank" rel="noreferrer">
                    <Icon name="play" />
                    {loomLabel}
                  </a>
                ) : null}
                <label>
                  Loom URL
                  <input
                    aria-label="Loom URL"
                    value={task.loomUrl ?? ""}
                    onChange={(event) => onUpdate(task.id, { loomUrl: event.target.value })}
                    placeholder="https://www.loom.com/share/..."
                  />
                </label>
                <label>
                  Instruction title
                  <input
                    aria-label="Loom instruction title"
                    value={task.loomTitle ?? ""}
                    onChange={(event) => onUpdate(task.id, { loomTitle: event.target.value })}
                    placeholder="How to complete this task"
                  />
                </label>
              </div>
            ) : null}
          </section>

          <section className="task-modal-section">
            <div className="portal-editor">
              <div className="inspector-section-title">
                <Icon name="link" />
                Client portal
              </div>
              <label className="portal-toggle">
                <input type="checkbox" checked={task.portalVisible} onChange={(event) => onUpdate(task.id, { portalVisible: event.target.checked })} />
                <span>
                  Show in portal
                  <small>Make this item visible on the private client link.</small>
                </span>
              </label>
              <label className="portal-toggle">
                <input
                  type="checkbox"
                  checked={task.portalActionRequired}
                  disabled={!task.portalVisible}
                  onChange={(event) => onUpdate(task.id, { portalActionRequired: event.target.checked })}
                />
                <span>
                  Client action required
                  <small>Place it in the client action list.</small>
                </span>
              </label>
              <label>
                Client-facing title
                <input
                  aria-label="Client-facing title"
                  value={task.portalTitle}
                  onChange={(event) => onUpdate(task.id, { portalTitle: event.target.value })}
                  placeholder={task.title}
                />
              </label>
              <label>
                Client-facing note
                <textarea
                  aria-label="Client-facing note"
                  value={task.portalNote}
                  onChange={(event) => onUpdate(task.id, { portalNote: event.target.value })}
                  placeholder="Add a short note the client will see"
                />
              </label>
              {showPortalActionEditor || portalActionUrl ? (
                <div className="portal-action-editor">
                  <div className="inspector-section-title">
                    <Icon name="link" />
                    Client form/action link
                  </div>
                  {portalActionUrl ? (
                    <a className="portal-action-preview-link" href={portalActionUrl} target="_blank" rel="noreferrer">
                      <Icon name="play" />
                      {portalActionLabel}
                    </a>
                  ) : null}
                  <label>
                    Link URL
                    <input
                      aria-label="Client form or action URL"
                      value={task.portalActionUrl ?? ""}
                      onChange={(event) => {
                        const portalActionUrlValue = event.target.value;
                        const hasPortalActionUrl = Boolean(safeInstructionUrl(portalActionUrlValue));
                        onUpdate(task.id, {
                          portalActionUrl: portalActionUrlValue,
                          portalVisible: hasPortalActionUrl || task.portalVisible,
                          portalActionRequired: hasPortalActionUrl || task.portalActionRequired,
                        });
                      }}
                      placeholder="https://docs.google.com/forms/..."
                    />
                  </label>
                  <label>
                    Button label
                    <input
                      aria-label="Client action button label"
                      value={task.portalActionLabel ?? ""}
                      onChange={(event) => onUpdate(task.id, { portalActionLabel: event.target.value })}
                      placeholder="Complete onboarding form"
                    />
                  </label>
                </div>
              ) : null}
            </div>

            <div className="dependency-list">
              <div className="inspector-section-title">
                <Icon name="link" />
                Dependencies
              </div>
              {task.dependencies.length === 0 ? (
                <p>No dependencies attached.</p>
              ) : (
                task.dependencies.map((id) => {
                  const dependency = taskMap.get(id);
                  return (
                    <button type="button" key={id} onClick={() => dependency && onOpenDependency(dependency)}>
                      <span>{dependency?.title ?? id}</span>
                      <em>{dependency ? statusLabels[dependency.status] : "Missing"}</em>
                    </button>
                  );
                })
              )}
            </div>
          </section>
        </div>

        <footer className="task-modal-footer">
          <span className={isPending ? "saving active" : "saving"}>{isPending ? "Saving" : "Saved"}</span>
          <div>
            <button type="button" className="task-modal-secondary" onClick={onClose}>
              Close
            </button>
            <button type="button" className="task-modal-primary" onClick={() => onUpdate(task.id, { status: "complete" })}>
              <Icon name="check" />
              Complete
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function NewClientPanel({
  open,
  saving,
  theme,
  environment,
  product,
  onClose,
  onSubmit,
}: {
  open: boolean;
  saving: boolean;
  theme: ThemeMode;
  environment: OperatingEnvironment;
  product: ProductWorkspace;
  onClose: () => void;
  onSubmit: (payload: ClientCreatePayload) => void;
}) {
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("");
  const [owner, setOwner] = useState(product.ownerFallback);
  const [goLiveDate, setGoLiveDate] = useState("");

  if (!open) {
    return null;
  }

  return (
    <div className={`modal-backdrop modal-backdrop-${theme}`} role="presentation">
      <form
        className="new-client-panel"
        aria-label="Create client"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({ name, industry, owner, goLiveDate });
        }}
      >
        <div className="new-client-head">
          <div>
            <span>New client</span>
            <h2>Create {environment.shortLabel} {product.shortLabel} client workspace</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} title="Close">
            x
          </button>
        </div>
        <label>
          Client name
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Acme Health" autoFocus />
        </label>
        <label>
          Industry
          <input value={industry} onChange={(event) => setIndustry(event.target.value)} placeholder="Healthcare" />
        </label>
        <label>
          Owner
          <input value={owner} onChange={(event) => setOwner(event.target.value)} placeholder={product.ownerFallback} />
        </label>
        <label>
          Target go-live
          <input type="date" value={goLiveDate} onChange={(event) => setGoLiveDate(event.target.value)} />
        </label>
        <div className="new-client-actions">
          <button type="button" className="walkthrough-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="walkthrough-primary" disabled={!name.trim() || saving}>
            {saving ? "Creating" : "Create workspace"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ActiveClientPipelineBoard() {
  const [pipeline, setPipeline] = useState<ActiveClientPipelineData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    fetch("/api/ghl/pipeline", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Could not load GHL pipeline.");
        }

        return data.pipeline as ActiveClientPipelineData;
      })
      .then((remotePipeline) => {
        if (!active) {
          return;
        }

        setPipeline(remotePipeline);
        setLoadFailed(false);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setPipeline(null);
        setLoadFailed(true);
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [refreshKey]);

  function refreshPipeline() {
    setIsLoading(true);
    setLoadFailed(false);
    setRefreshKey((current) => current + 1);
  }

  const visiblePipeline = pipeline ?? demoActiveClientPipeline;
  const visibleCount = visiblePipeline.stages.reduce((total, stage) => total + stage.count, 0);
  const syncLabel = pipeline
    ? `Synced from GHL - ${formatPipelineSyncTime(pipeline.syncedAt)}`
    : isLoading
      ? "Connecting to GHL Active Clients"
      : "GHL layout preview";

  return (
    <section className="mission-panel ghl-pipeline-panel" aria-label="Active client pipeline">
      <div className="mission-panel-head ghl-pipeline-head">
        <div>
          <h2>Active client pipeline</h2>
          <p>{visibleCount} opportunities across {visiblePipeline.name}.</p>
        </div>
        <div className="ghl-pipeline-actions">
          <span className={loadFailed ? "ghl-sync-pill ghl-sync-preview" : "ghl-sync-pill"}>
            <span />
            {syncLabel}
          </span>
          <button type="button" onClick={refreshPipeline} disabled={isLoading}>
            {isLoading ? "Refreshing" : "Refresh"}
          </button>
        </div>
      </div>

      <div className="ghl-pipeline-board" aria-label="GHL Active Clients stages">
        {visiblePipeline.stages.map((stage) => (
          <section className="ghl-pipeline-stage" key={stage.id} aria-label={`${stage.name} stage`}>
            <header className={`ghl-pipeline-stage-head ghl-stage-${stage.tone}`}>
              <strong>{stage.name}</strong>
              <div>
                <span>{stage.count} {stage.count === 1 ? "Opportunity" : "Opportunities"}</span>
                <b>{stage.valueLabel}</b>
              </div>
            </header>

            <div className="ghl-pipeline-cards">
              {stage.opportunities.length === 0 ? (
                <p className="ghl-pipeline-empty">No opportunities in this stage.</p>
              ) : null}
              {stage.opportunities.slice(0, 8).map((opportunity) => (
                <article className="ghl-opportunity-card" key={opportunity.id}>
                  <div className="ghl-opportunity-card-top">
                    <strong>{opportunity.title}</strong>
                    <span>{opportunity.initials}</span>
                  </div>
                  <dl>
                    <div>
                      <dt>Business Name:</dt>
                      <dd>{opportunity.businessName ?? "-"}</dd>
                    </div>
                    <div>
                      <dt>Source:</dt>
                      <dd>{opportunity.source ?? "-"}</dd>
                    </div>
                    <div>
                      <dt>Value:</dt>
                      <dd>{opportunity.valueLabel}</dd>
                    </div>
                  </dl>
                  <div className="ghl-opportunity-card-foot">
                    <span><Icon name="link" /> GHL</span>
                    {opportunity.owner ? <span>{opportunity.owner}</span> : null}
                  </div>
                </article>
              ))}
              {stage.opportunities.length > 8 ? (
                <div className="ghl-pipeline-more">+{stage.opportunities.length - 8} more in {stage.name}</div>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function formatPipelineSyncTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "just now";
  }

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function MissionControl({
  environment,
  activeEnvironment,
  onEnvironmentChange,
  product,
  activeProduct,
  onProductChange,
  clients,
  selectedClientId,
  onSelectClient,
  onOpenTasks,
  onCreateClientClick,
  onImportGhlClient,
  canImportGhlClient,
  isImportingGhlClient,
  theme,
  onThemeChange,
  tourTarget,
  onStartTour,
  walkthroughPanel,
  taskCount,
  completedTasks,
  waitingTasks,
  attachmentFilter,
  attachmentCounts,
  onAttachmentFilterChange,
  adminEditing,
  onAdminEditingChange,
}: {
  environment: OperatingEnvironment;
  activeEnvironment: EnvironmentKey;
  onEnvironmentChange: (environment: EnvironmentKey) => void;
  product: ProductWorkspace;
  activeProduct: ProductKey;
  onProductChange: (product: ProductKey) => void;
  clients: RespondClient[];
  selectedClientId: string;
  onSelectClient: (clientId: string) => void;
  onOpenTasks: (clientId?: string) => void;
  onCreateClientClick: () => void;
  onImportGhlClient: () => void;
  canImportGhlClient: boolean;
  isImportingGhlClient: boolean;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  tourTarget?: TourTarget;
  onStartTour: () => void;
  walkthroughPanel: ReactNode;
  taskCount: number;
  completedTasks: number;
  waitingTasks: number;
  attachmentFilter: AttachmentFilter;
  attachmentCounts: { looms: number; forms: number };
  onAttachmentFilterChange: (filter: AttachmentFilter) => void;
  adminEditing: boolean;
  onAdminEditingChange: (enabled: boolean) => void;
}) {
  const [activeLens, setActiveLens] = useState<"all" | "waiting" | "golive" | "high">("all");
  const selectedClient = clients.find((client) => client.id === selectedClientId);
  const lensLabels = {
    all: "All clients",
    waiting: "Waiting on client",
    golive: "Go-live next 30 days",
    high: "High risk",
  };
  const lensClients = useMemo(() => {
    if (activeLens === "waiting") {
      return clients.filter((client) => client.blocker.toLowerCase().includes("waiting"));
    }

    if (activeLens === "golive") {
      return clients.filter((client) => {
        const date = Date.parse(`${client.goLiveDate}T00:00:00Z`);
        return date >= missionToday && date <= missionThirtyDayLimit;
      });
    }

    if (activeLens === "high") {
      return clients.filter((client) => client.risk === "high" || client.health === "off_track");
    }

    return clients;
  }, [activeLens, clients]);
  const scopedClients = selectedClient ? [selectedClient] : lensClients;
  const clientCards = selectedClient ? clients : lensClients;
  const emptyPortfolio = clients.length === 0;
  const totalClients = clients.length || 1;
  const portfolioStats = {
    onTrack: clients.filter((client) => client.health === "on_track").length,
    atRisk: clients.filter((client) => client.health === "at_risk").length,
    offTrack: clients.filter((client) => client.health === "off_track").length,
    onHold: clients.filter((client) => client.health === "on_hold").length,
  };
  const goLiveSoon = clients.filter((client) => {
    const date = Date.parse(`${client.goLiveDate}T00:00:00Z`);
    return date >= missionToday && date <= missionThirtyDayLimit;
  }).length;
  const attentionRows = scopedClients.flatMap((client) =>
    client.attention.map((item) => ({
      client,
      ...item,
    }))
  );
  const timelineClients = scopedClients;
  const totalAtRisk = portfolioStats.atRisk + portfolioStats.offTrack;
  const riskPercent = Math.round((totalAtRisk / totalClients) * 100);
  const riskDegrees = emptyPortfolio ? 0 : Math.max(8, Math.round((riskPercent / 100) * 360));
  const overallStatus = emptyPortfolio ? "Ready" : portfolioStats.offTrack > 0 ? "At risk" : portfolioStats.atRisk > 0 ? "Watch" : "Healthy";
  const overallClass: ClientHealth = emptyPortfolio ? "on_track" : portfolioStats.offTrack > 0 ? "off_track" : portfolioStats.atRisk > 0 ? "at_risk" : "on_track";

  function chooseLens(lens: "all" | "waiting" | "golive" | "high") {
    setActiveLens(lens);
    onSelectClient("all");
  }

  function chooseClient(clientId: string) {
    setActiveLens("all");
    onSelectClient(clientId);
  }

  return (
    <main className={`mission-shell mission-shell-${theme}`} data-tour-target={tourTarget}>
      <aside className="mission-side">
        <div className="mission-brand">
          <RespondMark className="mission-brand-mark" />
          <div>
            <strong>{product.label} CSM</strong>
            <span>Delivery command center</span>
          </div>
        </div>

        <ProductSwitcher activeProduct={activeProduct} onProductChange={onProductChange} />

        <nav className="mission-nav" aria-label="Primary views">
          <button type="button" className="active">
            <Icon name="home" />
            Mission Control
          </button>
          <button type="button" onClick={() => onOpenTasks(selectedClient?.id)} disabled={emptyPortfolio}>
            <Icon name="tasks" />
            Tasks
          </button>
        </nav>

        <div className="mission-side-section">
          <span>Saved lenses</span>
          <button type="button" className={activeLens === "all" && !selectedClient ? "active" : ""} onClick={() => chooseLens("all")}>All clients</button>
          <button type="button" className={activeLens === "waiting" && !selectedClient ? "active" : ""} onClick={() => chooseLens("waiting")}>Waiting on client</button>
          <button type="button" className={activeLens === "golive" && !selectedClient ? "active" : ""} onClick={() => chooseLens("golive")}>Go-live next 30 days</button>
          <button type="button" className={activeLens === "high" && !selectedClient ? "active" : ""} onClick={() => chooseLens("high")}>High risk</button>
        </div>

        <EnvironmentSwitcher activeEnvironment={activeEnvironment} onEnvironmentChange={onEnvironmentChange} />

        <div className="mission-user-row">
          <div className="mission-user">
            <span className="avatar">JB</span>
            <div>
              <strong>Jamie Bennett</strong>
              <span>CSM lead</span>
            </div>
          </div>
          <AttachmentLensSettings
            attachmentFilter={attachmentFilter}
            attachmentCounts={attachmentCounts}
            onAttachmentFilterChange={onAttachmentFilterChange}
            adminEditing={adminEditing}
            onAdminEditingChange={onAdminEditingChange}
            variant="compact"
          />
        </div>
      </aside>

      <section className="mission-main">
        <header className="mission-header">
          <div>
            <h1>Mission Control</h1>
            <p>Portfolio health across {product.clientLabel}.</p>
          </div>
          <div className="mission-header-actions">
            <span className="system-pill">
              <span />
              {environment.statusLabel}
            </span>
            <span className="mission-date">Jun 13, 2026</span>
            <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
            <button type="button" className="walkthrough-button" onClick={onStartTour}>
              <Icon name="play" />
              Start walkthrough
            </button>
            {selectedClient?.portalToken ? (
              <a className="mission-secondary portal-link" href={`/portal/${selectedClient.portalToken}`} target="_blank" rel="noreferrer">
                <Icon name="link" />
                Client portal
              </a>
            ) : null}
            {canImportGhlClient ? (
              <button type="button" className="mission-secondary" onClick={onImportGhlClient} disabled={isImportingGhlClient}>
                <Icon name="download" />
                {isImportingGhlClient ? "Importing" : "Import from GHL"}
              </button>
            ) : null}
            <button type="button" className="mission-secondary" onClick={onCreateClientClick}>
              <Icon name="plus" />
              New client
            </button>
            <select
              aria-label="Select client"
              value={selectedClientId}
              onChange={(event) => {
                setActiveLens("all");
                onSelectClient(event.target.value);
              }}
            >
              <option value="all">All clients</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}{client.companyName ? ` - ${client.companyName}` : ""}
                </option>
              ))}
            </select>
            <button type="button" className="mission-primary" onClick={() => onOpenTasks(selectedClient?.id)} disabled={emptyPortfolio}>
              <Icon name="tasks" />
              Open tasks
            </button>
          </div>
        </header>

        <section className="portfolio-strip" aria-label="Portfolio health">
          <div className="portfolio-kpi">
            <span>Total clients</span>
            <strong>{clients.length}</strong>
            <small>{taskCount} tasks per client</small>
          </div>
          <div className="portfolio-kpi">
            <span>On track</span>
            <strong>{portfolioStats.onTrack}</strong>
            <small>{Math.round((portfolioStats.onTrack / totalClients) * 100)}% of portfolio</small>
          </div>
          <div className="portfolio-kpi">
            <span>At risk</span>
            <strong className="tone-amber">{portfolioStats.atRisk}</strong>
            <small>{Math.round((portfolioStats.atRisk / totalClients) * 100)}% needs attention</small>
          </div>
          <div className="portfolio-kpi">
            <span>Off track</span>
            <strong className="tone-red">{portfolioStats.offTrack}</strong>
            <small>{Math.round((portfolioStats.offTrack / totalClients) * 100)}% escalated</small>
          </div>
          <div className="portfolio-kpi">
            <span>On hold</span>
            <strong>{portfolioStats.onHold}</strong>
            <small>Paused or duplicate</small>
          </div>
          <div className="portfolio-kpi">
            <span>Go-live next 30 days</span>
            <strong className="tone-lime">{goLiveSoon}</strong>
            <small>Through Jul 13, 2026</small>
          </div>
          <div className="portfolio-health">
            <span className="mission-health-ring" style={{ background: `conic-gradient(#f5b22c 0deg ${riskDegrees}deg, rgba(148, 163, 184, 0.18) ${riskDegrees}deg 360deg)` }} />
            <div>
              <span>Overall health</span>
              <strong className={`client-health-${overallClass}`}>{overallStatus}</strong>
              <small>{completedTasks} complete, {waitingTasks} waiting</small>
            </div>
          </div>
        </section>

        <section className="mission-client-grid" aria-label="Client portfolio">
          {emptyPortfolio ? (
            <article className="empty-state-card">
              <span>{environment.shortLabel}</span>
              <h2>No {product.clientLabel.toLowerCase()} yet</h2>
              <p>Create your first {product.shortLabel} client to generate a fresh checklist, portal link, timeline, and task board.</p>
              <div className="empty-actions">
                {canImportGhlClient ? (
                  <button type="button" className="mission-primary" onClick={onImportGhlClient} disabled={isImportingGhlClient}>
                    <Icon name="download" />
                    {isImportingGhlClient ? "Importing" : "Import from GHL"}
                  </button>
                ) : null}
                <button type="button" className={canImportGhlClient ? "mission-secondary" : "mission-primary"} onClick={onCreateClientClick}>
                  <Icon name="plus" />
                  New client
                </button>
              </div>
            </article>
          ) : null}
          {clientCards.map((client) => (
            <article
              key={client.id}
              className={selectedClientId === client.id ? "mission-client-card active" : "mission-client-card"}
            >
              <button type="button" className="mission-client-card-main" onClick={() => chooseClient(client.id)}>
                <span className="mission-client-code">{client.code}</span>
                <span className="mission-client-name">
                  {client.name}
                  {client.companyName ? <small>{client.companyName}</small> : null}
                </span>
                <span className={`client-health client-health-${client.health}`}>{clientHealthLabels[client.health]}</span>
                <span className="mission-client-meta">{client.phase} - {client.owner}</span>
                <span className="mission-progress-track">
                  <span style={{ width: `${client.progress}%` }} />
                </span>
                <span className="mission-client-foot">
                  <span>{client.progress}% ready</span>
                  <span>{client.goLiveLabel}</span>
                </span>
              </button>
              {client.portalToken ? (
                <a className="mission-client-portal-link" href={`/portal/${client.portalToken}`} target="_blank" rel="noreferrer">
                  <Icon name="link" />
                  Portal link
                </a>
              ) : null}
            </article>
          ))}
        </section>

        <section className="mission-panel attention-panel">
          <div className="mission-panel-head">
            <div>
              <h2>Needs attention now</h2>
              <p>{selectedClient ? selectedClient.name : lensLabels[activeLens]} - blockers, approvals, and handoffs.</p>
            </div>
            <span>{attentionRows.length}</span>
          </div>

          <div className="attention-table-wrap">
            <table className="attention-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Issue / context</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Last update</th>
                  <th>Next step</th>
                  <th>Risk</th>
                  <th>Blocker</th>
                </tr>
              </thead>
              <tbody>
                {attentionRows.map((row) => (
                  <tr key={`${row.client.id}-${row.issue}`}>
                    <td>
                      <button type="button" className="attention-client" onClick={() => onSelectClient(row.client.id)}>
                        <span>{row.client.code}</span>
                        {row.client.name}
                      </button>
                    </td>
                    <td>{row.issue}</td>
                    <td>
                      <span className={`status-pill client-health-${row.client.health}`}>{row.status}</span>
                    </td>
                    <td>{row.owner}</td>
                    <td>{row.lastUpdate}</td>
                    <td>{row.nextStep}</td>
                    <td>
                      <span className={`risk-pill risk-${row.risk}`}>{clientRiskLabels[row.risk]}</span>
                    </td>
                    <td>{row.blocker}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mission-panel timeline-panel">
          <div className="mission-panel-head">
            <div>
              <h2>14-day delivery timeline</h2>
              <p>Current critical path from Jun 13 to Jun 26, 2026.</p>
            </div>
            <button type="button" onClick={() => chooseLens("all")}>View all</button>
          </div>

          <div className="timeline-grid" aria-label="14 day client delivery timeline">
            <div className="timeline-row timeline-head">
              <span>Client</span>
              <span>Phase</span>
              {missionTimelineDays.map((day) => (
                <span key={day}>{day}</span>
              ))}
              <span>Go-live</span>
            </div>
            {timelineClients.map((client) => (
              <div className="timeline-row" key={client.id}>
                <div className="timeline-client">
                  <span>{client.code}</span>
                  <strong>{client.name}</strong>
                </div>
                <span className={`timeline-phase client-health-${client.health}`}>{client.phase}</span>
                {client.timeline.map((segment) => {
                  const start = Math.max(0, Math.min(segment.startDay, missionTimelineDays.length - 1));
                  const span = Math.max(1, Math.min(segment.span, missionTimelineDays.length - start));
                  const markerColumn = Math.min(start + span + 2, 16);

                  return (
                    <span
                      key={segment.label}
                      className={`timeline-bar timeline-bar-${segment.status}`}
                      style={{ gridColumn: `${start + 3} / span ${span}` }}
                    >
                      {segment.label}
                      {segment.marker ? (
                        <span className={`timeline-marker timeline-marker-${segment.marker}`} style={{ gridColumn: `${markerColumn}` }}>
                          {segment.marker === "milestone" ? "M" : "!"}
                        </span>
                      ) : null}
                    </span>
                  );
                })}
                <span className={`timeline-golive risk-${client.risk}`} style={{ gridColumn: "17" }}>
                  {client.goLiveLabel}
                </span>
              </div>
            ))}
          </div>
        </section>

        {activeEnvironment === "demo" && activeProduct === "respond" ? <ActiveClientPipelineBoard /> : null}
      </section>
      {walkthroughPanel}
    </main>
  );
}

export default function RespondDashboard({
  initialEnvironment,
  initialProduct,
  initialTasks,
  initialCategories,
  initialTeamMembers,
  initialClients,
}: DashboardProps) {
  const [activeEnvironment, setActiveEnvironment] = useState<EnvironmentKey>(initialEnvironment ?? defaultEnvironment);
  const [activeProduct, setActiveProduct] = useState<ProductKey>(initialProduct ?? defaultProduct);
  const [clients, setClients] = useState(initialClients);
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedId, setSelectedId] = useState(initialTasks[0]?.id ?? "");
  const [loadedTaskKey, setLoadedTaskKey] = useState(() =>
    taskWorkspaceKey(initialEnvironment ?? defaultEnvironment, initialProduct ?? defaultProduct, initialClients[0]?.id ?? "")
  );
  const [detailReadyTaskId, setDetailReadyTaskId] = useState<string | null>(null);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<AppSection>("home");
  const [selectedClientId, setSelectedClientId] = useState("all");
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const storedTheme = window.localStorage.getItem("respond-csm-theme");
    return storedTheme === "light" ? "light" : "dark";
  });
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [attachmentFilter, setAttachmentFilter] = useState<AttachmentFilter>("all");
  const [adminEditing, setAdminEditing] = useState(false);
  const [view, setView] = useState<"board" | "categories">("board");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState(initialCategories[0]?.name ?? "");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => new Set());
  const [isTaskOverviewOpen, setIsTaskOverviewOpen] = useState(false);
  const [storageNotice, setStorageNotice] = useState("");
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [showNewClientPanel, setShowNewClientPanel] = useState(false);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [isImportingGhlClient, setIsImportingGhlClient] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [tourStepIndex, setTourStepIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const currentEnvironment = useMemo(() => environmentConfig(activeEnvironment), [activeEnvironment]);
  const currentProduct = useMemo(() => productConfig(activeProduct), [activeProduct]);
  const categories = useMemo(
    () => (activeProduct === initialProduct ? initialCategories : productCategories(activeProduct)),
    [activeProduct, initialProduct, initialCategories]
  );
  const teamMembers = useMemo(
    () => (activeProduct === initialProduct ? initialTeamMembers : productTeamMembers(activeProduct)),
    [activeProduct, initialProduct, initialTeamMembers]
  );
  const templateTasks = useMemo(
    () => (activeProduct === initialProduct ? initialTasks : productTasks(activeProduct)),
    [activeProduct, initialProduct, initialTasks]
  );

  const activeTaskClientId = useMemo(() => {
    if (selectedClientId !== "all" && clients.some((client) => client.id === selectedClientId)) {
      return selectedClientId;
    }

    return clients[0]?.id ?? "";
  }, [clients, selectedClientId]);
  const activeTaskKey = taskWorkspaceKey(activeEnvironment, activeProduct, activeTaskClientId);
  const tasksMatchActiveWorkspace = useMemo(
    () =>
      Boolean(activeTaskClientId && tasks.length > 0) &&
      tasks.every((task) => task.clientId === activeTaskClientId && task.environment === activeEnvironment && task.product === activeProduct),
    [activeEnvironment, activeProduct, activeTaskClientId, tasks]
  );
  const hasActiveTaskData = loadedTaskKey === activeTaskKey || tasksMatchActiveWorkspace;
  const isTaskBoardRefreshing = Boolean(activeTaskClientId && loadedTaskKey !== activeTaskKey && hasActiveTaskData);
  const isTaskBoardLoading = Boolean(activeTaskClientId && loadedTaskKey !== activeTaskKey && !hasActiveTaskData);

  function resetWorkspace(environment: EnvironmentKey, product: ProductKey) {
    const nextClients = environmentProductClients(environment, product);
    const shouldUseSeededPreview = environment === defaultEnvironment && nextClients.length > 0;
    const nextTasks = shouldUseSeededPreview ? productTasks(product) : [];
    const nextCategories = productCategories(product);

    setActiveEnvironment(environment);
    setActiveProduct(product);
    setClients(nextClients);
    setTasks(nextTasks);
    setSelectedId(nextTasks[0]?.id ?? "");
    setLoadedTaskKey(shouldUseSeededPreview ? taskWorkspaceKey(environment, product, nextClients[0]?.id ?? "") : "");
    setDetailReadyTaskId(null);
    setDetailTaskId(null);
    setSelectedClientId("all");
    setQuery("");
    setCategoryFilter("all");
    setOwnerFilter("all");
    setStatusFilter("all");
    setAttachmentFilter("all");
    setNewTaskTitle("");
    setNewTaskCategory(nextCategories[0]?.name ?? "");
    setExpandedCategories(new Set());
    setIsTaskOverviewOpen(false);
    setShowNewClientPanel(false);
    setStorageNotice("");
  }

  function switchEnvironment(environment: EnvironmentKey) {
    if (environment === activeEnvironment) {
      return;
    }

    resetWorkspace(environment, activeProduct);
  }

  function switchProduct(product: ProductKey) {
    if (product === activeProduct) {
      return;
    }

    resetWorkspace(activeEnvironment, product);
  }

  useEffect(() => {
    window.localStorage.setItem("respond-csm-theme", theme);
  }, [theme]);

  useEffect(() => {
    let active = true;

    fetch(`/api/clients?environment=${encodeURIComponent(activeEnvironment)}&product=${encodeURIComponent(activeProduct)}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Could not load clients.");
        }
        return data.clients as RespondClient[];
      })
      .then((remoteClients) => {
        if (!active) {
          return;
        }
        setClients(remoteClients);
        setSelectedClientId((current) => (current !== "all" && remoteClients.some((client) => client.id === current) ? current : "all"));
        setDetailReadyTaskId(null);
        setDetailTaskId(null);
        setStorageNotice("");
      })
      .catch((error: Error) => {
        if (active) {
          setStorageNotice(error.message);
        }
      });

    return () => {
      active = false;
    };
  }, [activeEnvironment, activeProduct]);

  useEffect(() => {
    let active = true;
    const requestKey = taskWorkspaceKey(activeEnvironment, activeProduct, activeTaskClientId);

    if (!activeTaskClientId) {
      return () => {
        active = false;
      };
    }

    fetch(
      `/api/tasks?environment=${encodeURIComponent(activeEnvironment)}&product=${encodeURIComponent(activeProduct)}&clientId=${encodeURIComponent(activeTaskClientId)}`,
      { cache: "no-store" }
    )
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Could not load task storage.");
        }
        return data.tasks as Task[];
      })
      .then((remoteTasks) => {
        if (!active) {
          return;
        }
        setTasks(remoteTasks);
        setSelectedId((current) => (remoteTasks.some((task) => task.id === current) ? current : remoteTasks[0]?.id || ""));
        setLoadedTaskKey(requestKey);
        setDetailReadyTaskId(null);
        setDetailTaskId((current) => (current && remoteTasks.some((task) => task.id === current) ? current : null));
        setStorageNotice("");
      })
      .catch((error: Error) => {
        if (active) {
          setLoadedTaskKey(requestKey);
          setStorageNotice(error.message);
        }
      });

    return () => {
      active = false;
    };
  }, [activeEnvironment, activeProduct, activeTaskClientId]);

  useEffect(() => {
    if (!detailTaskId) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDetailTaskId(null);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [detailTaskId]);

  const taskMap = useMemo(() => new Map(tasks.map((task) => [task.id, task])), [tasks]);
  const selectedTask = tasks.find((task) => task.id === selectedId) ?? tasks[0];
  const detailTask = detailTaskId ? taskMap.get(detailTaskId) ?? null : null;
  const filteredTasks = useFilteredTasks(tasks, query, categoryFilter, ownerFilter, statusFilter, attachmentFilter);
  const taskNavigationOrder = useMemo(() => buildTaskNavigationOrder(categories, templateTasks), [categories, templateTasks]);
  const orderedTasksForNavigation = useMemo(
    () => [...tasks].sort((a, b) => compareTasksByNavigationOrder(a, b, taskNavigationOrder)),
    [tasks, taskNavigationOrder]
  );
  const tasksByCategory = useMemo(() => {
    const grouped = new Map<string, Task[]>();

    for (const task of orderedTasksForNavigation) {
      const current = grouped.get(task.category) ?? [];
      grouped.set(task.category, [...current, task]);
    }

    return grouped;
  }, [orderedTasksForNavigation]);
  const orderedFilteredTasks = useMemo(
    () => [...filteredTasks].sort((a, b) => compareTasksByNavigationOrder(a, b, taskNavigationOrder)),
    [filteredTasks, taskNavigationOrder]
  );
  const attachmentCounts = useMemo(
    () => ({
      looms: tasks.filter(taskHasLoom).length,
      forms: tasks.filter(taskHasClientForm).length,
    }),
    [tasks]
  );
  const canImportGhlClient = activeEnvironment === "live";

  const metrics = useMemo(() => {
    const completed = tasks.filter((task) => task.status === "complete").length;
    const blocked = tasks.filter((task) => task.status === "blocked" || getDependencyState(task, taskMap).isBlockedByDependencies).length;
    const active = tasks.filter((task) => task.status === "in_progress" || task.status === "review").length;
    const percent = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

    return {
      completed,
      blocked,
      active,
      percent,
    };
  }, [tasks, taskMap]);

  const categoryStats = useMemo(
    () =>
      categories.map((category) => {
        const categoryTasks = tasksByCategory.get(category.name) ?? [];
        const complete = categoryTasks.filter((task) => task.status === "complete").length;
        return {
          ...category,
          total: categoryTasks.length,
          complete,
          percent: categoryTasks.length > 0 ? Math.round((complete / categoryTasks.length) * 100) : 0,
        };
      }),
    [categories, tasksByCategory]
  );
  const phaseStats = useMemo(
    () =>
      phaseOrder.map((phase) => {
        const phaseCategories = categoryStats.filter((category) => category.phase === phase);
        const total = phaseCategories.reduce((sum, category) => sum + category.total, 0);
        const complete = phaseCategories.reduce((sum, category) => sum + category.complete, 0);
        const percent = total > 0 ? Math.round((complete / total) * 100) : 0;

        return {
          phase,
          total,
          complete,
          percent,
          accent: phaseCategories[0]?.accent ?? "#2563eb",
        };
      }),
    [categoryStats]
  );

  async function persistTask(id: string, payload: TaskUpdatePayload) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? "Task update failed.");
    }

    return data.task as Task;
  }

  async function persistDeleteTask(id: string) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? "Task delete failed.");
    }

    return data.task as Pick<Task, "id">;
  }

  function updateTask(id: string, payload: TaskUpdatePayload) {
    const previous = tasks;
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) {
          return task;
        }

        const nextCategory = payload.category ? categories.find((category) => category.name === payload.category) : null;
        return {
          ...task,
          ...payload,
          phase: nextCategory?.phase ?? payload.phase ?? task.phase,
        };
      })
    );

    startTransition(() => {
      persistTask(id, payload)
        .then((remoteTask) => {
          setTasks((current) => current.map((task) => (task.id === id ? remoteTask : task)));
          setStorageNotice("");
        })
        .catch((error: Error) => {
          setTasks(previous);
          setStorageNotice(error.message);
        });
    });
  }

  async function removeTask(task: Task) {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      return;
    }

    const previous = tasks;
    const nextSelectedTask = previous.find((item) => item.id !== task.id);
    setDeletingTaskId(task.id);
    setTasks((current) =>
      current
        .filter((item) => item.id !== task.id)
        .map((item) => ({
          ...item,
          dependencies: item.dependencies.filter((dependencyId) => dependencyId !== task.id),
        }))
    );
    setSelectedId((current) => (current === task.id ? nextSelectedTask?.id ?? "" : current));
    setDetailReadyTaskId((current) => (current === task.id ? null : current));
    setDetailTaskId((current) => (current === task.id ? null : current));

    try {
      await persistDeleteTask(task.id);
      setStorageNotice("");
    } catch (error) {
      setTasks(previous);
      setSelectedId((current) => current || task.id);
      setStorageNotice(error instanceof Error ? error.message : "Task delete failed.");
    } finally {
      setDeletingTaskId(null);
    }
  }

  function moveTask(task: Task, status: TaskStatus) {
    updateTask(task.id, { status });
  }

  function selectTaskClient(clientId: string) {
    setSelectedClientId(clientId);
    setAttachmentFilter("all");
  }

  function selectOrOpenTask(task: Task) {
    if (selectedId === task.id && detailReadyTaskId === task.id) {
      setDetailTaskId(task.id);
      return;
    }

    setSelectedId(task.id);
    setDetailReadyTaskId(task.id);
  }

  function openTaskInModal(task: Task) {
    setSelectedId(task.id);
    setDetailReadyTaskId(task.id);
    setDetailTaskId(task.id);
  }

  function toggleCategory(categoryName: string) {
    const isExpanded = expandedCategories.has(categoryName);

    setCategoryFilter(isExpanded ? "all" : categoryName);
    setExpandedCategories((current) => {
      const next = new Set(current);

      if (next.has(categoryName)) {
        next.delete(categoryName);
      } else {
        next.add(categoryName);
      }

      return next;
    });
  }

  function selectTaskFromCategory(task: Task) {
    setSelectedId(task.id);
    setDetailReadyTaskId(task.id);
    setCategoryFilter(task.category);
    setExpandedCategories((current) => {
      const next = new Set(current);
      next.add(task.category);
      return next;
    });
  }

  async function addTask() {
    const title = newTaskTitle.trim();
    if (!title || !activeTaskClientId) {
      return;
    }

    const tempTask: Task = {
      id: `draft-${activeTaskClientId}-${Date.now()}`,
      environment: activeEnvironment,
      product: activeProduct,
      clientId: activeTaskClientId,
      templateId: `draft-${Date.now()}`,
      title,
      category: newTaskCategory,
      phase: categories.find((category) => category.name === newTaskCategory)?.phase ?? "Onboarding",
      status: "queued",
      assignee: "Unassigned",
      dueWindow: "",
      priority: "normal",
      dependencies: [],
      notes: "",
      loomUrl: "",
      loomTitle: "",
      portalVisible: false,
      portalTitle: "",
      portalNote: "",
      portalActionRequired: false,
      portalActionUrl: "",
      portalActionLabel: "",
      portalConfigured: false,
      sortOrder: tasks.length + 1,
    };

    setTasks((current) => [...current, tempTask]);
    setSelectedId(tempTask.id);
    setDetailReadyTaskId(null);
    setDetailTaskId(null);
    setNewTaskTitle("");

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ environment: activeEnvironment, product: activeProduct, clientId: activeTaskClientId, title, category: newTaskCategory }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Could not create task.");
      }
      setTasks((current) => current.map((task) => (task.id === tempTask.id ? data.task : task)));
      setSelectedId(data.task.id);
      setStorageNotice("");
    } catch (error) {
      setTasks((current) => current.filter((task) => task.id !== tempTask.id));
      setStorageNotice(error instanceof Error ? error.message : "Could not create task.");
    }
  }

  async function createClientWorkspace(payload: ClientCreatePayload) {
    setIsCreatingClient(true);

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, environment: activeEnvironment, product: activeProduct }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Could not create client.");
      }

      const client = data.client as RespondClient;
      const clientTasks = data.tasks as Task[];
      setClients((current) => [...current.filter((item) => item.id !== client.id), client]);
      setSelectedClientId(client.id);
      setTasks(clientTasks);
      setSelectedId(clientTasks[0]?.id ?? "");
      setLoadedTaskKey(taskWorkspaceKey(client.environment, client.product, client.id));
      setDetailReadyTaskId(null);
      setDetailTaskId(null);
      setActiveSection("tasks");
      setShowNewClientPanel(false);
      setStorageNotice("");
    } catch (error) {
      setStorageNotice(error instanceof Error ? error.message : "Could not create client.");
    } finally {
      setIsCreatingClient(false);
    }
  }

  async function importGhlClientWorkspace() {
    if (!canImportGhlClient || isImportingGhlClient) {
      return;
    }

    const selector = window.prompt(`Enter the exact GHL client, contact, or opportunity name/ID to import into ${currentProduct.shortLabel}.`);

    if (!selector?.trim()) {
      return;
    }

    setIsImportingGhlClient(true);

    try {
      const response = await fetch("/api/clients/import-ghl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selector: selector.trim(), product: activeProduct }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Could not import a GHL client.");
      }

      const client = data.client as RespondClient;
      const clientTasks = data.tasks as Task[];
      setClients((current) => [...current.filter((item) => item.id !== client.id), client]);
      setSelectedClientId(client.id);
      setTasks(clientTasks);
      setSelectedId(clientTasks[0]?.id ?? "");
      setLoadedTaskKey(taskWorkspaceKey(client.environment, client.product, client.id));
      setDetailReadyTaskId(null);
      setDetailTaskId(null);
      setActiveSection("tasks");
      setShowNewClientPanel(false);
      setStorageNotice(data.imported === false ? `${client.name} was already imported from GHL.` : `${client.name} imported from GHL.`);
    } catch (error) {
      setStorageNotice(error instanceof Error ? error.message : "Could not import a GHL client.");
    } finally {
      setIsImportingGhlClient(false);
    }
  }

  const statusTasks = useMemo(
    () =>
      taskStatuses.map((status) => ({
        status,
        tasks: orderedFilteredTasks.filter((task) => task.status === status),
      })),
    [orderedFilteredTasks]
  );

  const selectedClient = clients.find((client) => client.id === activeTaskClientId);
  const currentTourStep = tourStepIndex === null ? null : tourSteps[tourStepIndex] ?? null;

  function goToTourStep(index: number) {
    if (index < 0 || index >= tourSteps.length) {
      setTourStepIndex(null);
      return;
    }

    const step = tourSteps[index];
    if (step.clientId) {
      setSelectedClientId(clients[0]?.id ?? "all");
    }
    setActiveSection(step.section);
    setTourStepIndex(index);
  }

  const walkthroughPanel = (
    <WalkthroughPanel
      step={currentTourStep}
      stepIndex={tourStepIndex}
      totalSteps={tourSteps.length}
      onBack={() => goToTourStep((tourStepIndex ?? 0) - 1)}
      onNext={() => goToTourStep((tourStepIndex ?? 0) + 1)}
      onSkip={() => setTourStepIndex(null)}
    />
  );

  function openTasks(clientId?: string) {
    setSelectedClientId(clientId ?? activeTaskClientId);
    setActiveSection("tasks");
  }

  function changeMissionAttachmentFilter(filter: AttachmentFilter) {
    setAttachmentFilter(filter);
    if (filter !== "all") {
      setActiveSection("tasks");
    }
  }

  if (activeSection === "home") {
    return (
      <>
        <MissionControl
          key={`${activeEnvironment}-${activeProduct}`}
          environment={currentEnvironment}
          activeEnvironment={activeEnvironment}
          onEnvironmentChange={switchEnvironment}
          product={currentProduct}
          activeProduct={activeProduct}
          onProductChange={switchProduct}
          clients={clients}
          selectedClientId={selectedClientId}
          onSelectClient={setSelectedClientId}
          onOpenTasks={openTasks}
          onCreateClientClick={() => setShowNewClientPanel(true)}
          onImportGhlClient={importGhlClientWorkspace}
          canImportGhlClient={canImportGhlClient}
          isImportingGhlClient={isImportingGhlClient}
          theme={theme}
          onThemeChange={setTheme}
          tourTarget={currentTourStep?.section === "home" ? currentTourStep.target : undefined}
          onStartTour={() => goToTourStep(0)}
          walkthroughPanel={walkthroughPanel}
          taskCount={templateTasks.length}
          completedTasks={metrics.completed}
          waitingTasks={metrics.blocked}
          attachmentFilter={attachmentFilter}
          attachmentCounts={attachmentCounts}
          onAttachmentFilterChange={changeMissionAttachmentFilter}
          adminEditing={adminEditing}
          onAdminEditingChange={setAdminEditing}
        />
        <NewClientPanel
          key={`home-${activeEnvironment}-${activeProduct}`}
          open={showNewClientPanel}
          saving={isCreatingClient}
          theme={theme}
          environment={currentEnvironment}
          product={currentProduct}
          onClose={() => setShowNewClientPanel(false)}
          onSubmit={createClientWorkspace}
        />
      </>
    );
  }

  return (
    <main
      className={`dashboard-shell dashboard-shell-${theme} ${isTaskOverviewOpen ? "dashboard-shell-overview-open" : "dashboard-shell-overview-closed"}`}
      data-tour-target={currentTourStep?.section === "tasks" ? currentTourStep.target : undefined}
    >
      <aside className="side-rail">
        <div className="brand">
          <RespondMark className="brand-mark" />
          <div>
            <strong>{currentProduct.label} CSM</strong>
            <span>Onboarding & delivery</span>
          </div>
        </div>

        <ProductSwitcher activeProduct={activeProduct} onProductChange={switchProduct} />

        <nav className="view-nav" aria-label="Primary views">
          <button type="button" onClick={() => setActiveSection("home")}>
            <Icon name="home" />
            Mission Control
          </button>
          <button type="button" className="active">
            <Icon name="tasks" />
            Tasks
          </button>
        </nav>

        <nav className="phase-nav" aria-label="Task categories">
          {phaseOrder.map((phase) => {
            const phaseCategories = categoryStats.filter((category) => category.phase === phase);
            return (
              <div key={phase} className="phase-group">
                <span className="phase-label">{phase}</span>
                {phaseCategories.map((category) => {
                  const isExpanded = expandedCategories.has(category.name);
                  const isComplete = category.total > 0 && category.complete === category.total;
                  const categoryTasks = tasksByCategory.get(category.name) ?? [];

                  return (
                    <div key={category.id} className={isExpanded ? "category-nav-group category-nav-group-open" : "category-nav-group"}>
                      <button
                        type="button"
                        className={categoryFilter === category.name ? "category-link active" : "category-link"}
                        aria-expanded={isExpanded}
                        aria-controls={`category-tasks-${category.id}`}
                        onClick={() => toggleCategory(category.name)}
                      >
                        <span className={isExpanded ? "category-chevron category-chevron-open" : "category-chevron"} aria-hidden="true" />
                        <span className="category-dot" style={{ background: category.accent }} />
                        <span>{category.name}</span>
                        <span className={isComplete ? "category-state category-state-done" : "category-state"} title={isComplete ? "Complete" : "Not complete"}>
                          {isComplete ? "✓" : ""}
                        </span>
                        <strong>{category.complete}/{category.total}</strong>
                      </button>

                      {isExpanded ? (
                        <div className="category-nav-tasks" id={`category-tasks-${category.id}`}>
                          {categoryTasks.map((task) => {
                            const isTaskComplete = task.status === "complete";
                            return (
                              <button
                                type="button"
                                key={task.id}
                                className={selectedId === task.id ? "category-nav-task active" : "category-nav-task"}
                                onClick={() => selectTaskFromCategory(task)}
                                title={task.title}
                              >
                                <span
                                  className={isTaskComplete ? "category-task-state category-task-state-done" : "category-task-state"}
                                  aria-label={isTaskComplete ? "Complete" : "Not complete"}
                                >
                                  {isTaskComplete ? "✓" : ""}
                                </span>
                                <span>{task.title}</span>
                                <em>{statusLabels[task.status]}</em>
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <EnvironmentSwitcher activeEnvironment={activeEnvironment} onEnvironmentChange={switchEnvironment} />
        <AttachmentLensSettings
          attachmentFilter={attachmentFilter}
          attachmentCounts={attachmentCounts}
          onAttachmentFilterChange={setAttachmentFilter}
          adminEditing={adminEditing}
          onAdminEditingChange={setAdminEditing}
        />
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <h1>{selectedClient ? `${selectedClient.name} workflow board` : `${currentProduct.shortLabel} workflow board`}</h1>
            <p>
              {tasks.length} operational tasks in this client workspace
              {selectedClient ? ` - client context: ${selectedClient.phase}, ${clientHealthLabels[selectedClient.health]}` : ""}
              {selectedClient?.companyName ? ` - company: ${selectedClient.companyName}` : ""}
            </p>
          </div>
        </header>

        <section className={isTaskOverviewOpen ? "task-overview task-overview-open" : "task-overview"} aria-label="Task controls and progress">
          <button
            type="button"
            className="task-overview-toggle"
            aria-expanded={isTaskOverviewOpen}
            onClick={() => setIsTaskOverviewOpen((current) => !current)}
          >
            <span>
              <strong>Task controls & progress</strong>
              <small>Search, add tasks, delivery stages, and checklist health</small>
            </span>
            <span className={isTaskOverviewOpen ? "task-overview-chevron task-overview-chevron-open" : "task-overview-chevron"} aria-hidden="true" />
          </button>

          {isTaskOverviewOpen ? (
            <div className="task-overview-body">
              <div className="topbar-actions">
            <div className="task-header-tools">
              <ThemeToggle theme={theme} onThemeChange={setTheme} />
              <button type="button" className="walkthrough-button" onClick={() => goToTourStep(0)}>
                <Icon name="play" />
                Start walkthrough
              </button>
              <button type="button" className="walkthrough-button" onClick={() => setShowNewClientPanel(true)}>
                <Icon name="plus" />
                New client
              </button>
              {canImportGhlClient ? (
                <button type="button" className="walkthrough-button" onClick={importGhlClientWorkspace} disabled={isImportingGhlClient}>
                  <Icon name="download" />
                  {isImportingGhlClient ? "Importing" : "Import from GHL"}
                </button>
              ) : null}
              {selectedClient?.portalToken ? (
                <a className="walkthrough-button portal-link" href={`/portal/${selectedClient.portalToken}`} target="_blank" rel="noreferrer">
                  <Icon name="link" />
                  Client portal
                </a>
              ) : null}
            </div>
            <div className="task-quick-tools">
              <div className="search-box">
                <Icon name="search" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks, owners, categories" />
              </div>
              <div className="new-task">
                <input value={newTaskTitle} onChange={(event) => setNewTaskTitle(event.target.value)} placeholder="Add a custom task" />
                <select value={newTaskCategory} onChange={(event) => setNewTaskCategory(event.target.value)}>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={addTask} disabled={!newTaskTitle.trim() || !activeTaskClientId}>
                  <Icon name="plus" />
                  Add
                </button>
              </div>
              <button className="icon-button" type="button" title="Clear filters" onClick={() => {
                setCategoryFilter("all");
                setOwnerFilter("all");
                setStatusFilter("all");
                setAttachmentFilter("all");
                setQuery("");
              }}>
                <Icon name="filter" />
              </button>
            </div>
          </div>

              <section className="command-strip">
                <Metric label="Progress" value={`${metrics.percent}%`} detail={`${metrics.completed} of ${tasks.length} complete`} />
                <Metric label="Active" value={metrics.active} detail="In progress or review" />
                <Metric label="Waiting" value={metrics.blocked} detail="Open dependencies or holds" />
                <Metric label="Categories" value={categories.length} detail="Onboarding to support" />
              </section>

              <section className="stage-strip" aria-label="Stage progress">
                {phaseStats.map((stage) => (
                  <article className="stage-window" key={stage.phase}>
                    <div className="stage-window-head">
                      <span>{stage.phase.replace(/-/g, " ")}</span>
                      <strong>{stage.percent}%</strong>
                    </div>
                    <div className="stage-progress-track" aria-label={`${stage.phase} progress`}>
                      <span style={{ width: `${stage.percent}%`, background: stage.accent }} />
                    </div>
                    <small>{stage.complete} of {stage.total} complete</small>
                  </article>
                ))}
              </section>
            </div>
          ) : null}
        </section>

        <section className="filters-row" aria-label="Dashboard filters">
          <div className="segmented">
            <button type="button" className={view === "board" ? "active" : ""} onClick={() => setView("board")}>Board</button>
            <button type="button" className={view === "categories" ? "active" : ""} onClick={() => setView("categories")}>Categories</button>
          </div>
          <select aria-label="Selected client" value={activeTaskClientId} onChange={(event) => selectTaskClient(event.target.value)} disabled={clients.length === 0}>
            {clients.length === 0 ? <option value="">No clients yet</option> : null}
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}{client.companyName ? ` - ${client.companyName}` : ""}
              </option>
            ))}
          </select>
          <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            {taskStatuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
          <select aria-label="Filter by owner" value={ownerFilter} onChange={(event) => setOwnerFilter(event.target.value)}>
            <option value="all">All owners</option>
            {teamMembers.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
          <select aria-label="Filter by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </section>

        {storageNotice ? <div className="storage-notice">{storageNotice}</div> : null}
        {!storageNotice && isTaskBoardRefreshing ? <div className="storage-notice">Refreshing saved task statuses...</div> : null}
        {adminEditing ? (
          <div className="admin-editing-notice">
            <Icon name="settings" />
            Admin editing mode
          </div>
        ) : null}

        {clients.length === 0 ? (
          <section className="empty-workspace-panel" aria-label="Empty workspace">
            <span>{currentEnvironment.shortLabel}</span>
            <h2>No {currentProduct.clientLabel.toLowerCase()} in this workspace yet</h2>
            <p>Create a client to generate a fresh {currentProduct.taskTemplateLabel.toLowerCase()}, private portal link, and independent task board.</p>
            <div className="empty-actions">
              {canImportGhlClient ? (
                <button type="button" className="walkthrough-primary" onClick={importGhlClientWorkspace} disabled={isImportingGhlClient}>
                  <Icon name="download" />
                  {isImportingGhlClient ? "Importing" : "Import from GHL"}
                </button>
              ) : null}
              <button type="button" className={canImportGhlClient ? "walkthrough-secondary" : "walkthrough-primary"} onClick={() => setShowNewClientPanel(true)}>
                <Icon name="plus" />
                New client
              </button>
            </div>
          </section>
        ) : isTaskBoardLoading ? (
          <section className="empty-workspace-panel task-loading-panel" aria-label="Loading task workspace">
            <span>{currentEnvironment.shortLabel}</span>
            <h2>Loading {selectedClient?.name ?? currentProduct.shortLabel} task board</h2>
            <p>Pulling the saved checklist statuses before showing this workspace.</p>
          </section>
        ) : view === "board" ? (
          <section className="board" aria-label="Task workflow board">
            {statusTasks.map(({ status, tasks: columnTasks }) => (
              <div
                key={status}
                className="board-column"
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (draggedTask) {
                    moveTask(draggedTask, status);
                    setDraggedTask(null);
                  }
                }}
              >
                <div className={`column-header task-stage-${status}`}>
                  <strong>{statusLabels[status]}</strong>
                  <div>
                    <span>{columnTasks.length} {columnTasks.length === 1 ? "Task" : "Tasks"}</span>
                    <b>{statusColumnDetails[status]}</b>
                  </div>
                </div>
                <div className="column-scroll">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      taskMap={taskMap}
                      active={selectedTask?.id === task.id}
                      adminEditing={adminEditing}
                      isDeleting={deletingTaskId === task.id}
                      onSelect={selectOrOpenTask}
                      onQuickMove={moveTask}
                      onTitleChange={(targetTask, title) => updateTask(targetTask.id, { title })}
                      onDelete={removeTask}
                      onDragStart={setDraggedTask}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : (
          <section className="category-view" aria-label="Task categories">
            {categoryStats.map((category) => {
              const rows = orderedFilteredTasks.filter((task) => task.category === category.name);
              return (
                <article key={category.id} className="category-panel">
                  <div className="category-panel-head">
                    <span className="category-dot" style={{ background: category.accent }} />
                    <div>
                      <strong>{category.name}</strong>
                      <span>{category.phase}</span>
                    </div>
                    <progress value={category.percent} max="100" aria-label={`${category.name} progress`} />
                    <b>{category.percent}%</b>
                  </div>
                  <div className="category-task-list">
                    {rows.slice(0, 10).map((task) => (
                      <button type="button" key={task.id} onClick={() => selectOrOpenTask(task)}>
                        <span>{task.title}</span>
                        <em>{statusLabels[task.status]}</em>
                      </button>
                    ))}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </section>

      <NewClientPanel
        key={`tasks-${activeEnvironment}-${activeProduct}`}
        open={showNewClientPanel}
        saving={isCreatingClient}
        theme={theme}
        environment={currentEnvironment}
        product={currentProduct}
        onClose={() => setShowNewClientPanel(false)}
        onSubmit={createClientWorkspace}
      />
      {detailTask ? (
        <TaskDetailModal
          key={detailTask.id}
          task={detailTask}
          taskMap={taskMap}
          categories={categories}
          teamMembers={teamMembers}
          isPending={isPending}
          onClose={() => setDetailTaskId(null)}
          onUpdate={updateTask}
          onOpenDependency={openTaskInModal}
        />
      ) : null}
      {walkthroughPanel}
    </main>
  );
}
