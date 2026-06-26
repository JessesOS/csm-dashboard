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

export type ProductKey = "respond" | "scale";

export type EnvironmentKey = "demo" | "live";

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
  environment?: EnvironmentKey;
  product?: ProductKey;
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
  loomUrl?: string;
  loomTitle?: string;
  portalVisible: boolean;
  portalTitle: string;
  portalNote: string;
  portalActionRequired: boolean;
  portalActionUrl?: string;
  portalActionLabel?: string;
  portalConfigured: boolean;
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
  loomUrl?: string;
  loomTitle?: string;
  portalVisible?: boolean;
  portalTitle?: string;
  portalNote?: string;
  portalActionRequired?: boolean;
  portalActionUrl?: string;
  portalActionLabel?: string;
}

export interface TaskSnapshot {
  id: string;
  environment: EnvironmentKey;
  product: ProductKey;
  clientId: string;
  name: string;
  description: string;
  taskCount: number;
  createdAt: string;
}

export interface TaskSnapshotDetail extends TaskSnapshot {
  tasks: Task[];
}

export interface TaskSnapshotPointers {
  legacySnapshotId: string | null;
  masterSnapshotId: string | null;
}

export interface TaskSnapshotCollection {
  snapshots: TaskSnapshot[];
  templatePointers: TaskSnapshotPointers;
}

export interface TaskSnapshotCreatePayload {
  environment?: EnvironmentKey;
  product?: ProductKey;
  clientId?: string;
  name?: string;
  description?: string;
  kind?: "backup" | "master";
}

export interface TrainingVideo {
  id: string;
  product: ProductKey;
  category: string;
  title: string;
  description: string;
  loomUrl: string;
  tags: string[];
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrainingVideoCreatePayload {
  product?: ProductKey;
  category?: string;
  title?: string;
  description?: string;
  loomUrl?: string;
  tags?: string[];
}

export type PortalFormValue = string | string[];

export type PortalFormResponses = Record<string, PortalFormValue>;

export interface PortalFormSubmission {
  id: string;
  environment: EnvironmentKey;
  product: ProductKey;
  clientId: string;
  formId: string;
  status: "draft" | "submitted";
  responses: PortalFormResponses;
  submittedAt: string;
  updatedAt: string;
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
  environment: EnvironmentKey;
  product: ProductKey;
  portalToken?: string;
  name: string;
  companyName?: string;
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
  environment?: EnvironmentKey;
  product?: ProductKey;
  name?: string;
  companyName?: string;
  owner?: string;
  industry?: string;
  goLiveDate?: string;
}
