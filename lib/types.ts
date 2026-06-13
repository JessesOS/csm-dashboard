export const taskStatuses = [
  "queued",
  "in_progress",
  "blocked",
  "review",
  "complete",
] as const;

export type TaskStatus = (typeof taskStatuses)[number];

export const statusLabels: Record<TaskStatus, string> = {
  queued: "Queued",
  in_progress: "In progress",
  blocked: "Blocked",
  review: "Review",
  complete: "Complete",
};

export type Priority = "low" | "normal" | "high" | "critical";

export type Phase =
  | "Onboarding"
  | "Build"
  | "Testing"
  | "Go-Live"
  | "Post-Launch"
  | "Support";

export interface Category {
  id: string;
  name: string;
  phase: Phase;
  accent: string;
}

export interface Task {
  id: string;
  clientId?: string;
  templateId?: string;
  title: string;
  category: string;
  phase: Phase;
  status: TaskStatus;
  assignee: string;
  dueWindow: string;
  priority: Priority;
  dependencies: string[];
  notes: string;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskUpdatePayload {
  title?: string;
  category?: string;
  phase?: Phase;
  status?: TaskStatus;
  assignee?: string;
  dueWindow?: string;
  priority?: Priority;
  dependencies?: string[];
  notes?: string;
}

export type ClientHealth = "on_track" | "at_risk" | "off_track" | "on_hold";

export type ClientRisk = "low" | "medium" | "high";

export type ClientDeliveryPhase =
  | "Discovery"
  | "Onboarding"
  | "Implementation"
  | "Handoff"
  | "Testing"
  | "Go-Live"
  | "Support";

export interface ClientTimelineSegment {
  label: string;
  phase: ClientDeliveryPhase;
  startDay: number;
  span: number;
  status: ClientHealth;
  marker?: "milestone" | "risk" | "approval";
}

export interface ClientAttentionItem {
  issue: string;
  status: string;
  owner: string;
  lastUpdate: string;
  nextStep: string;
  blocker: string;
  risk: ClientRisk;
}

export interface RespondClient {
  id: string;
  name: string;
  code: string;
  industry: string;
  owner: string;
  phase: ClientDeliveryPhase;
  health: ClientHealth;
  progress: number;
  currentTask: string;
  goLiveDate: string;
  goLiveLabel: string;
  lastUpdate: string;
  nextStep: string;
  blocker: string;
  risk: ClientRisk;
  activeTasks: number;
  completedTasks: number;
  timeline: ClientTimelineSegment[];
  attention: ClientAttentionItem[];
}

export interface ClientCreatePayload {
  name?: string;
  owner?: string;
  industry?: string;
  goLiveDate?: string;
}
