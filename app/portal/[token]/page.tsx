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
  return safePortalUrl(task.portalActionUrl);
}

function portalLoomUrl(task: Task) {
  return safePortalUrl(task.loomUrl);
}

function safePortalUrl(value: string | null | undefined) {
  const clean = value?.trim() ?? "";
  return /^https?:\/\//i.test(clean) ? clean : "";
}

function portalActionLabel(task: Task) {
  return task.portalActionLabel?.trim() || "Complete this item";
}

function portalStepState(task: Task, index: number, activeIndex: number) {
  if (task.status === "complete") {
    return "complete";
  }

  if (index === activeIndex) {
    return "active";
  }

  if (index > activeIndex) {
    return "locked";
  }

  return "available";
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
  const guidedSource = progressTasks.some((task) => task.portalActionRequired || portalActionUrl(task))
    ? progressTasks.filter((task) => task.portalActionRequired || portalActionUrl(task))
    : progressTasks;
  const guidedSteps = guidedSource.slice(0, 8);
  const firstOpenGuidedStep = guidedSteps.findIndex((task) => task.status !== "complete");
  const activeGuidedStepIndex = firstOpenGuidedStep;
  const activeGuidedStep = activeGuidedStepIndex >= 0 ? guidedSteps[activeGuidedStepIndex] : null;
  const activeGuidedStepUrl = activeGuidedStep ? portalActionUrl(activeGuidedStep) : "";
  const activeGuidedStepLoomUrl = activeGuidedStep ? portalLoomUrl(activeGuidedStep) : "";
  const guidedComplete = guidedSteps.filter((task) => task.status === "complete").length;
  const guidedProgress = guidedSteps.length > 0 ? Math.round((guidedComplete / guidedSteps.length) * 100) : 0;
  const guidedProgressLabel = guidedSteps.length > 0
    ? activeGuidedStepIndex >= 0
      ? `Step ${activeGuidedStepIndex + 1} of ${guidedSteps.length}`
      : "All steps complete"
    : "No required steps";
  const supportingResources = progressTasks
    .filter((task) => task.id !== activeGuidedStep?.id && (portalLoomUrl(task) || portalActionUrl(task)))
    .slice(0, 3);
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

        <section className="portal-guided-panel" aria-label="Guided onboarding steps">
          <div className="portal-guided-head">
            <div>
              <span className="portal-guided-kicker">{client.name} guided onboarding</span>
              <h2>Complete one step at a time</h2>
              <p>Start with the current step. Later steps unlock as your CSM marks each required item complete.</p>
            </div>
            <div className="portal-guided-progress" aria-label="Guided step progress">
              <span>{guidedProgressLabel}</span>
              <strong>{guidedProgress}%</strong>
              <div className="portal-guided-meter">
                <span style={{ width: `${guidedProgress}%` }} />
              </div>
            </div>
          </div>

          {guidedSteps.length > 0 ? (
            <div className="portal-guided-layout">
              <ol className="portal-stepper-list">
                {guidedSteps.map((task, index) => {
                  const stepState = portalStepState(task, index, activeGuidedStepIndex);
                  const isLocked = stepState === "locked";
                  const isActive = stepState === "active";
                  const isComplete = stepState === "complete";
                  return (
                    <li key={task.id} className={`portal-step-card portal-step-${stepState}`}>
                      <span className="portal-step-marker">{isComplete ? "✓" : index + 1}</span>
                      <div className="portal-step-content">
                        <div className="portal-step-title">
                          <strong>{portalTitle(task)}</strong>
                          <em>{isComplete ? "Complete" : isActive ? "Current step" : isLocked ? "Locked" : statusLabels[task.status]}</em>
                        </div>
                        <p>{portalDetail(task)}</p>
                        {isLocked ? <small>Unlocks after the current step is completed.</small> : null}
                      </div>
                    </li>
                  );
                })}
              </ol>

              <aside className="portal-focus-card" aria-label="Current portal step">
                {activeGuidedStep ? (
                  <>
                    <span className="portal-focus-eyebrow">Current step</span>
                    <h3>{portalTitle(activeGuidedStep)}</h3>
                    <p>{portalDetail(activeGuidedStep)}</p>
                    <div className="portal-focus-actions">
                      {activeGuidedStepUrl ? (
                        <a className="portal-primary-action" href={activeGuidedStepUrl} target="_blank" rel="noreferrer">
                          {portalActionLabel(activeGuidedStep)}
                        </a>
                      ) : (
                        <span className="portal-action-placeholder">Your CSM will confirm this step with you.</span>
                      )}
                      {activeGuidedStepLoomUrl ? (
                        <a className="portal-secondary-action" href={activeGuidedStepLoomUrl} target="_blank" rel="noreferrer">
                          Watch walkthrough
                        </a>
                      ) : null}
                    </div>
                    <small className="portal-focus-note">Once this is complete, the next step becomes your focus.</small>
                  </>
                ) : (
                  <>
                    <span className="portal-focus-eyebrow">All set</span>
                    <h3>No client actions are currently required</h3>
                    <p>Your onboarding team will add the next guided step here if they need anything from you.</p>
                  </>
                )}

                <div className="portal-resource-list" aria-label="Helpful resources">
                  <h4>Resources</h4>
                  {supportingResources.length > 0 ? (
                    supportingResources.map((task) => {
                      const resourceUrl = portalLoomUrl(task) || portalActionUrl(task);
                      return (
                        <a key={task.id} className="portal-resource-item" href={resourceUrl} target="_blank" rel="noreferrer">
                          <span>{portalLoomUrl(task) ? "Walkthrough" : "Link"}</span>
                          <strong>{portalTitle(task)}</strong>
                        </a>
                      );
                    })
                  ) : (
                    <div className="portal-resource-item portal-resource-static">
                      <span>Support</span>
                      <strong>{client.owner} is keeping this path clear for you.</strong>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          ) : (
            <p className="portal-empty">Your guided onboarding path is being prepared.</p>
          )}
        </section>

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
