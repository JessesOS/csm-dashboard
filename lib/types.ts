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
