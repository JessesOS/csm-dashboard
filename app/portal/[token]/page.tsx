import type { CSSProperties } from "react";
import { productConfig } from "../../../lib/productWorkspaces";
import { getPortalWorkspace } from "../../../lib/taskStore";
import { statusLabels, type Phase, type Task, type TaskStatus } from "../../../lib/types";

export const dynamic = "force-dynamic";

const portalPhaseOrder: Phase[] = ["Onboarding", "Build", "Testing", "Go-Live", "Post-Launch", "Support"];

const statusClass: Record<TaskStatus, string> = {
  queued: "portal-status-queued",
  in_progress: "portal-status-in_progress",
  blocked: "portal-status-blocked",
  review: "portal-status-review",
  complete: "portal-status-complete",
};

function phaseStatus(tasks: Task[]): TaskStatus {
  if (tasks.length === 0) {
    return "queued";
  }

  if (tasks.every((task) => task.status === "complete")) {
    return "complete";
  }

  if (tasks.some((task) => task.status === "blocked")) {
    return "blocked";
  }

  if (tasks.some((task) => task.status === "in_progress")) {
    return "in_progress";
  }

  if (tasks.some((task) => task.status === "review")) {
    return "review";
  }

  return "queued";
}

function readableWindow(tasks: Task[]) {
  const windows = [...new Set(tasks.map((task) => task.dueWindow).filter(Boolean))];
  if (windows.length === 0) {
    return "Timing to be confirmed";
  }

  return windows.slice(0, 2).join(" / ");
}

function portalTitle(task: Task) {
  return task.portalTitle || task.title;
}

function portalDetail(task: Task) {
  return task.portalNote || `${task.category} - ${task.dueWindow || "Timing to be confirmed"}`;
}

function portalActionUrl(task: Task) {
  const clean = task.portalActionUrl?.trim() ?? "";
  return /^https?:\/\//i.test(clean) ? clean : "";
}

function portalActionLabel(task: Task) {
  return task.portalActionLabel?.trim() || "Complete this item";
}

type PortalWorkspace = Awaited<ReturnType<typeof getPortalWorkspace>>;

async function resolvePortalWorkspace(token: string): Promise<PortalWorkspace | null> {
  try {
    return await getPortalWorkspace(token);
  } catch {
    return null;
  }
}

function PortalUnavailable() {
  return (
    <main className="client-portal-shell client-portal-unavailable">
      <section className="portal-unavailable-panel">
        <RespondMark className="portal-brand-mark" />
        <h1>Portal unavailable</h1>
        <p>This private project link is missing, expired, or not ready yet. Please ask your CSM contact for a fresh portal link.</p>
      </section>
    </main>
  );
}

export default async function ClientPortal({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const workspace = await resolvePortalWorkspace(token);

  if (!workspace) {
    return <PortalUnavailable />;
  }

  return <ClientPortalView {...workspace} />;
}

function RespondMark({ className }: { className: string }) {
  return <span className={`${className} respond-mark-image`} aria-hidden="true" />;
}

function ClientPortalView({ client, tasks }: PortalWorkspace) {
  const product = productConfig(client.product);
  const progressTasks = tasks.filter((task) => task.portalVisible);
  const completed = progressTasks.filter((task) => task.status === "complete").length;
  const progress = progressTasks.length > 0 ? Math.round((completed / progressTasks.length) * 100) : 0;
  const openTasks = progressTasks.filter((task) => task.status !== "complete");
  const blockedTasks = progressTasks.filter((task) => task.status === "blocked");
  const clientActions = progressTasks.filter((task) => task.status !== "complete" && task.portalActionRequired).slice(0, 6);
  const upcomingTouchpoints = progressTasks.filter((task) => task.status !== "complete" && !task.portalActionRequired).slice(0, 5);
  const nextTask = clientActions[0] ?? openTasks[0];
  const phaseSummaries = portalPhaseOrder
    .map((phase) => {
      const phaseTasks = progressTasks.filter((task) => task.phase === phase);
      const phaseComplete = phaseTasks.filter((task) => task.status === "complete").length;
      return {
        phase,
        tasks: phaseTasks,
        complete: phaseComplete,
        progress: phaseTasks.length > 0 ? Math.round((phaseComplete / phaseTasks.length) * 100) : 0,
        status: phaseStatus(phaseTasks),
        window: readableWindow(phaseTasks),
      };
    })
    .filter((phase) => phase.tasks.length > 0);

  return (
    <main className="client-portal-shell">
      <header className="client-portal-hero">
        <nav className="portal-topline" aria-label="Portal header">
          <div className="portal-brand">
            <RespondMark className="portal-brand-mark" />
            <div>
              <strong>{product.label} CSM</strong>
              <span>Private project portal</span>
            </div>
          </div>
          <span className={`portal-health portal-health-${client.health}`}>{client.phase}</span>
        </nav>

        <section className="portal-hero-grid">
          <div className="portal-hero-copy">
            <span className="portal-code">{client.code}</span>
            <h1>{client.name}</h1>
            {client.companyName ? <strong className="portal-company-name">{client.companyName}</strong> : null}
            <p>A clear client-facing view of your onboarding progress, upcoming milestones, and any actions we need from your team before launch.</p>
            <dl className="portal-meta-grid">
              {client.companyName ? (
                <div>
                  <dt>Company</dt>
                  <dd>{client.companyName}</dd>
                </div>
              ) : null}
              <div>
                <dt>CSM owner</dt>
                <dd>{client.owner}</dd>
              </div>
              <div>
                <dt>Target go-live</dt>
                <dd>{client.goLiveLabel || "To be confirmed"}</dd>
              </div>
              <div>
                <dt>Last update</dt>
                <dd>{client.lastUpdate || "Recently updated"}</dd>
              </div>
            </dl>
          </div>

          <aside className="portal-progress-panel" aria-label="Project progress">
            <div className="portal-progress-ring" style={{ "--portal-progress": `${progress * 3.6}deg` } as CSSProperties}>
              <span>{progress}%</span>
            </div>
            <div>
              <span>Project progress</span>
              <strong>{completed} of {progressTasks.length} milestones complete</strong>
              <p>{nextTask ? `Next focus: ${portalTitle(nextTask)}` : "Portal milestones are being curated."}</p>
            </div>
          </aside>
        </section>
      </header>

      <section className="portal-summary-strip" aria-label="Project summary">
        <div>
          <span>Current phase</span>
          <strong>{client.phase}</strong>
        </div>
        <div>
          <span>Open items</span>
          <strong>{openTasks.length}</strong>
        </div>
        <div>
          <span>Needs attention</span>
          <strong>{blockedTasks.length}</strong>
        </div>
        <div>
          <span>Next step</span>
          <strong>{nextTask ? portalTitle(nextTask) : "Portal milestones are being curated"}</strong>
        </div>
      </section>

      <section className="portal-grid">
        <section className="portal-panel portal-timeline-panel">
          <div className="portal-panel-head">
            <div>
              <h2>Project timeline</h2>
              <p>Your onboarding path from setup through go-live and early support.</p>
            </div>
          </div>

          <ol className="portal-timeline-list">
            {phaseSummaries.map((phase, index) => (
              <li key={phase.phase} className={statusClass[phase.status]}>
                <span className="portal-timeline-index">{index + 1}</span>
                <div>
                  <div className="portal-timeline-title">
                    <strong>{phase.phase}</strong>
                    <span>{statusLabels[phase.status]}</span>
                  </div>
                  <p>{phase.window}</p>
                  <div className="portal-progress-track">
                    <span style={{ width: `${phase.progress}%` }} />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <aside className="portal-panel portal-action-panel">
          <div className="portal-panel-head">
            <div>
              <h2>What we need from you</h2>
              <p>Client-facing items that may need a response, file, approval, or meeting attendance.</p>
            </div>
          </div>

          <div className="portal-action-list">
            {clientActions.length > 0 ? (
              clientActions.map((task) => (
                <article key={task.id} className="portal-action-row">
                  <div>
                    <strong>{portalTitle(task)}</strong>
                    <span>{portalDetail(task)}</span>
                    {portalActionUrl(task) ? (
                      <a className="portal-action-link" href={portalActionUrl(task)} target="_blank" rel="noreferrer">
                        {portalActionLabel(task)}
                      </a>
                    ) : null}
                  </div>
                  <em className={statusClass[task.status]}>{statusLabels[task.status]}</em>
                </article>
              ))
            ) : (
              <p className="portal-empty">Nothing is currently waiting on your team.</p>
            )}
          </div>
        </aside>
      </section>

      <section className="portal-panel portal-touchpoints-panel">
        <div className="portal-panel-head">
          <div>
            <h2>Upcoming touchpoints</h2>
            <p>Meetings and launch moments most relevant to your team.</p>
          </div>
          <span>{upcomingTouchpoints.length}</span>
        </div>

        <div className="portal-touchpoint-grid">
          {upcomingTouchpoints.length > 0 ? (
            upcomingTouchpoints.map((task) => (
              <article key={task.id} className="portal-touchpoint">
                <span className={statusClass[task.status]}>{statusLabels[task.status]}</span>
                <strong>{portalTitle(task)}</strong>
                <p>{portalDetail(task)}</p>
              </article>
            ))
          ) : (
            <p className="portal-empty">No upcoming client meetings are currently visible.</p>
          )}
        </div>
      </section>
    </main>
  );
}
