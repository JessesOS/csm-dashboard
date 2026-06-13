"use client";

import { useEffect, useMemo, useState, useTransition, type ReactNode } from "react";
import { missionTimelineDays } from "../../lib/respondClients";
import type { Category, ClientHealth, ClientRisk, RespondClient, Task, TaskStatus, TaskUpdatePayload } from "../../lib/types";
import { statusLabels, taskStatuses } from "../../lib/types";

interface DashboardProps {
  initialTasks: Task[];
  categories: Category[];
  teamMembers: string[];
  clients: RespondClient[];
}

const phaseOrder = ["Onboarding", "Build", "Testing", "Go-Live", "Post-Launch", "Support"];

type ThemeMode = "dark" | "light";
type AppSection = "home" | "tasks";
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
    title: "Use the inspector for details",
    body: "The inspector is where the selected task gets updated: status, assignee, category, due window, notes, and dependencies.",
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
    | "play";
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

function useFilteredTasks(tasks: Task[], query: string, category: string, owner: string, status: string) {
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

      return matchesText && matchesCategory && matchesOwner && matchesStatus;
    });
  }, [tasks, query, category, owner, status]);
}

function TaskCard({
  task,
  taskMap,
  active,
  onSelect,
  onQuickMove,
  onDragStart,
}: {
  task: Task;
  taskMap: Map<string, Task>;
  active: boolean;
  onSelect: (task: Task) => void;
  onQuickMove: (task: Task, status: TaskStatus) => void;
  onDragStart: (task: Task) => void;
}) {
  const dependencyState = getDependencyState(task, taskMap);
  const isDone = task.status === "complete";

  return (
    <article
      className={`task-card ${active ? "task-card-active" : ""}`}
      draggable
      onDragStart={() => onDragStart(task)}
      onClick={() => onSelect(task)}
    >
      <div className="task-card-topline">
        <span className={`priority priority-${task.priority}`}>{task.priority}</span>
        <span className="drag-handle" title="Drag to move status">
          <Icon name="move" />
        </span>
      </div>
      <h3>{task.title}</h3>
      <div className="task-meta-line">
        <span>{task.category}</span>
      </div>
      <div className="task-card-footer">
        <span className="avatar" title={task.assignee}>
          {initials(task.assignee)}
        </span>
        <span className="mini-meta" title="Due window">
          <Icon name="calendar" />
          {task.dueWindow || "No date"}
        </span>
        <span className={`dependency-chip ${dependencyState.isBlockedByDependencies ? "dependency-open" : ""}`}>
          <Icon name="link" />
          {dependencyState.dependencies.length}
        </span>
      </div>
      <div className="task-actions" onClick={(event) => event.stopPropagation()}>
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
    </article>
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

function MissionControl({
  clients,
  selectedClientId,
  onSelectClient,
  onOpenTasks,
  theme,
  onThemeChange,
  tourTarget,
  onStartTour,
  walkthroughPanel,
  taskCount,
  completedTasks,
  waitingTasks,
}: {
  clients: RespondClient[];
  selectedClientId: string;
  onSelectClient: (clientId: string) => void;
  onOpenTasks: (clientId?: string) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  tourTarget?: TourTarget;
  onStartTour: () => void;
  walkthroughPanel: ReactNode;
  taskCount: number;
  completedTasks: number;
  waitingTasks: number;
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
  const riskDegrees = Math.max(8, Math.round((riskPercent / 100) * 360));
  const overallStatus = portfolioStats.offTrack > 0 ? "At risk" : portfolioStats.atRisk > 0 ? "Watch" : "Healthy";
  const overallClass: ClientHealth = portfolioStats.offTrack > 0 ? "off_track" : portfolioStats.atRisk > 0 ? "at_risk" : "on_track";

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
          <span className="mission-brand-mark">R</span>
          <div>
            <strong>Respond CSM</strong>
            <span>Delivery command center</span>
          </div>
        </div>

        <nav className="mission-nav" aria-label="Primary views">
          <button type="button" className="active">
            <Icon name="home" />
            Mission Control
          </button>
          <button type="button" onClick={() => onOpenTasks(selectedClient?.id)}>
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

        <div className="mission-user">
          <span className="avatar">JB</span>
          <div>
            <strong>Jamie Bennett</strong>
            <span>CSM lead</span>
          </div>
        </div>
      </aside>

      <section className="mission-main">
        <header className="mission-header">
          <div>
            <h1>Mission Control</h1>
            <p>Portfolio health across Respond clients.</p>
          </div>
          <div className="mission-header-actions">
            <span className="system-pill">
              <span />
              All systems operational
            </span>
            <span className="mission-date">Jun 13, 2026</span>
            <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
            <button type="button" className="walkthrough-button" onClick={onStartTour}>
              <Icon name="play" />
              Start walkthrough
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
                  {client.name}
                </option>
              ))}
            </select>
            <button type="button" className="mission-primary" onClick={() => onOpenTasks(selectedClient?.id)}>
              <Icon name="tasks" />
              Open tasks
            </button>
          </div>
        </header>

        <section className="portfolio-strip" aria-label="Portfolio health">
          <div className="portfolio-kpi">
            <span>Total clients</span>
            <strong>{clients.length}</strong>
            <small>{taskCount} master tasks available</small>
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
          {clientCards.map((client) => (
            <button
              type="button"
              key={client.id}
              className={selectedClientId === client.id ? "mission-client-card active" : "mission-client-card"}
              onClick={() => chooseClient(client.id)}
            >
              <span className="mission-client-code">{client.code}</span>
              <span className="mission-client-name">{client.name}</span>
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
      </section>
      {walkthroughPanel}
    </main>
  );
}

export default function RespondDashboard({ initialTasks, categories, teamMembers, clients }: DashboardProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedId, setSelectedId] = useState(initialTasks[0]?.id ?? "");
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
  const [view, setView] = useState<"board" | "categories">("board");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState(categories[0]?.name ?? "");
  const [storageNotice, setStorageNotice] = useState("");
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [tourStepIndex, setTourStepIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    window.localStorage.setItem("respond-csm-theme", theme);
  }, [theme]);

  useEffect(() => {
    let active = true;

    fetch("/api/tasks", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Could not load task storage.");
        }
        return data.tasks as Task[];
      })
      .then((remoteTasks) => {
        if (!active || remoteTasks.length === 0) {
          return;
        }
        setTasks(remoteTasks);
        setSelectedId((current) => current || remoteTasks[0]?.id || "");
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
  }, []);

  const taskMap = useMemo(() => new Map(tasks.map((task) => [task.id, task])), [tasks]);
  const selectedTask = tasks.find((task) => task.id === selectedId) ?? tasks[0];
  const filteredTasks = useFilteredTasks(tasks, query, categoryFilter, ownerFilter, statusFilter);

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
        const categoryTasks = tasks.filter((task) => task.category === category.name);
        const complete = categoryTasks.filter((task) => task.status === "complete").length;
        return {
          ...category,
          total: categoryTasks.length,
          complete,
          percent: categoryTasks.length > 0 ? Math.round((complete / categoryTasks.length) * 100) : 0,
        };
      }),
    [categories, tasks]
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

  function moveTask(task: Task, status: TaskStatus) {
    updateTask(task.id, { status });
  }

  async function addTask() {
    const title = newTaskTitle.trim();
    if (!title) {
      return;
    }

    const tempTask: Task = {
      id: `draft-${Date.now()}`,
      title,
      category: newTaskCategory,
      phase: categories.find((category) => category.name === newTaskCategory)?.phase ?? "Onboarding",
      status: "queued",
      assignee: "Unassigned",
      dueWindow: "",
      priority: "normal",
      dependencies: [],
      notes: "",
      sortOrder: tasks.length + 1,
    };

    setTasks((current) => [...current, tempTask]);
    setSelectedId(tempTask.id);
    setNewTaskTitle("");

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category: newTaskCategory }),
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

  const statusTasks = useMemo(
    () =>
      taskStatuses.map((status) => ({
        status,
        tasks: filteredTasks.filter((task) => task.status === status),
      })),
    [filteredTasks]
  );

  const selectedClient = clients.find((client) => client.id === selectedClientId);
  const currentTourStep = tourStepIndex === null ? null : tourSteps[tourStepIndex] ?? null;

  function goToTourStep(index: number) {
    if (index < 0 || index >= tourSteps.length) {
      setTourStepIndex(null);
      return;
    }

    const step = tourSteps[index];
    if (step.clientId) {
      setSelectedClientId(step.clientId);
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
    if (clientId) {
      setSelectedClientId(clientId);
    }
    setActiveSection("tasks");
  }

  if (activeSection === "home") {
    return (
      <MissionControl
        clients={clients}
        selectedClientId={selectedClientId}
        onSelectClient={setSelectedClientId}
        onOpenTasks={openTasks}
        theme={theme}
        onThemeChange={setTheme}
        tourTarget={currentTourStep?.section === "home" ? currentTourStep.target : undefined}
        onStartTour={() => goToTourStep(0)}
        walkthroughPanel={walkthroughPanel}
        taskCount={tasks.length}
        completedTasks={metrics.completed}
        waitingTasks={metrics.blocked}
      />
    );
  }

  return (
    <main className={`dashboard-shell dashboard-shell-${theme}`} data-tour-target={currentTourStep?.section === "tasks" ? currentTourStep.target : undefined}>
      <aside className="side-rail">
        <div className="brand">
          <span className="brand-mark">R</span>
          <div>
            <strong>Respond CSM</strong>
            <span>Onboarding & delivery</span>
          </div>
        </div>

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
                {phaseCategories.map((category) => (
                  <button
                    type="button"
                    key={category.id}
                    className={categoryFilter === category.name ? "category-link active" : "category-link"}
                    onClick={() => setCategoryFilter(categoryFilter === category.name ? "all" : category.name)}
                  >
                    <span className="category-dot" style={{ background: category.accent }} />
                    <span>{category.name}</span>
                    <strong>{category.complete}/{category.total}</strong>
                  </button>
                ))}
              </div>
            );
          })}
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <h1>{selectedClient ? `${selectedClient.name} workflow board` : "Respond workflow board"}</h1>
            <p>
              {tasks.length} operational tasks from the master CSM checklist
              {selectedClient ? ` - client context: ${selectedClient.phase}, ${clientHealthLabels[selectedClient.health]}` : ""}
            </p>
          </div>
          <div className="topbar-actions">
            <ThemeToggle theme={theme} onThemeChange={setTheme} />
            <button type="button" className="walkthrough-button" onClick={() => goToTourStep(0)}>
              <Icon name="play" />
              Start walkthrough
            </button>
            <div className="search-box">
              <Icon name="search" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks, owners, categories" />
            </div>
            <button className="icon-button" type="button" title="Clear filters" onClick={() => {
              setCategoryFilter("all");
              setOwnerFilter("all");
              setStatusFilter("all");
              setQuery("");
            }}>
              <Icon name="filter" />
            </button>
          </div>
        </header>

        <section className="command-strip">
          <Metric label="Progress" value={`${metrics.percent}%`} detail={`${metrics.completed} of ${tasks.length} complete`} />
          <Metric label="Active" value={metrics.active} detail="In progress or review" />
          <Metric label="Waiting" value={metrics.blocked} detail="Open dependencies or holds" />
          <Metric label="Categories" value={categories.length} detail="Onboarding to support" />
          <div className="new-task">
            <input value={newTaskTitle} onChange={(event) => setNewTaskTitle(event.target.value)} placeholder="Add a custom task" />
            <select value={newTaskCategory} onChange={(event) => setNewTaskCategory(event.target.value)}>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <button type="button" onClick={addTask} disabled={!newTaskTitle.trim()}>
              <Icon name="plus" />
              Add
            </button>
          </div>
        </section>

        <section className="filters-row" aria-label="Dashboard filters">
          <div className="segmented">
            <button type="button" className={view === "board" ? "active" : ""} onClick={() => setView("board")}>Board</button>
            <button type="button" className={view === "categories" ? "active" : ""} onClick={() => setView("categories")}>Categories</button>
          </div>
          <select aria-label="Selected client" value={selectedClientId} onChange={(event) => setSelectedClientId(event.target.value)}>
            <option value="all">All clients / template</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
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

        {view === "board" ? (
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
                <div className="column-header">
                  <strong>{statusLabels[status]}</strong>
                  <span>{columnTasks.length}</span>
                </div>
                <div className="column-scroll">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      taskMap={taskMap}
                      active={selectedTask?.id === task.id}
                      onSelect={(item) => setSelectedId(item.id)}
                      onQuickMove={moveTask}
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
              const rows = filteredTasks.filter((task) => task.category === category.name);
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
                      <button type="button" key={task.id} onClick={() => setSelectedId(task.id)}>
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

      <aside className="inspector">
        {selectedTask ? (
          <>
            <div className="inspector-head">
              <span className={`priority priority-${selectedTask.priority}`}>{selectedTask.priority}</span>
              <h2>{selectedTask.title}</h2>
              <p>{selectedTask.category}</p>
            </div>

            <label>
              Status
              <div className="status-grid">
                {taskStatuses.map((status) => (
                  <button
                    type="button"
                    key={status}
                    className={selectedTask.status === status ? "active" : ""}
                    onClick={() => updateTask(selectedTask.id, { status })}
                  >
                    {statusLabels[status]}
                  </button>
                ))}
              </div>
            </label>

            <label>
              Assignee
              <select aria-label="Assignee" value={selectedTask.assignee} onChange={(event) => updateTask(selectedTask.id, { assignee: event.target.value })}>
                {teamMembers.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Category
              <select aria-label="Category" value={selectedTask.category} onChange={(event) => updateTask(selectedTask.id, { category: event.target.value })}>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Due window
              <input aria-label="Due window" value={selectedTask.dueWindow} onChange={(event) => updateTask(selectedTask.id, { dueWindow: event.target.value })} />
            </label>

            <label>
              Notes
              <textarea aria-label="Notes" value={selectedTask.notes} onChange={(event) => updateTask(selectedTask.id, { notes: event.target.value })} placeholder="Add context for the team" />
            </label>

            <div className="dependency-list">
              <div className="inspector-section-title">
                <Icon name="link" />
                Dependencies
              </div>
              {selectedTask.dependencies.length === 0 ? (
                <p>No dependencies attached.</p>
              ) : (
                selectedTask.dependencies.map((id) => {
                  const dependency = taskMap.get(id);
                  return (
                    <button type="button" key={id} onClick={() => dependency && setSelectedId(dependency.id)}>
                      <span>{dependency?.title ?? id}</span>
                      <em>{dependency ? statusLabels[dependency.status] : "Missing"}</em>
                    </button>
                  );
                })
              )}
            </div>

            <div className="inspector-footer">
              <span className={isPending ? "saving active" : "saving"}>{isPending ? "Saving" : "Saved"}</span>
              <button type="button" onClick={() => updateTask(selectedTask.id, { status: "complete" })}>
                <Icon name="check" />
                Complete
              </button>
            </div>
          </>
        ) : null}
      </aside>
      {walkthroughPanel}
    </main>
  );
}
