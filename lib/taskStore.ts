import { getD1 } from "../db";
import { categories, seedTasks, teamMembers } from "./respondTasks";
import { taskStatuses, type Priority, type Task, type TaskStatus, type TaskUpdatePayload } from "./types";

type TaskRow = Omit<Task, "dependencies"> & {
  dependencies: string;
};

const validStatuses = new Set<string>(taskStatuses);
const validPriorities = new Set<string>(["low", "normal", "high", "critical"]);

function parseDependencies(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function fromRow(row: TaskRow): Task {
  return {
    ...row,
    dependencies: parseDependencies(row.dependencies),
  };
}

function routeErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  if (message.includes("D1 binding") || message.includes("no such table")) {
    return "Task storage is not ready yet. The dashboard can still render its seeded checklist, but live updates need the D1 binding and migration.";
  }

  return message;
}

export { routeErrorMessage };

export async function ensureTaskStorage() {
  const d1 = getD1();

  await d1.batch([
    d1.prepare(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        phase TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'queued',
        assignee TEXT NOT NULL DEFAULT 'Unassigned',
        due_window TEXT NOT NULL DEFAULT '',
        priority TEXT NOT NULL DEFAULT 'normal',
        dependencies TEXT NOT NULL DEFAULT '[]',
        notes TEXT NOT NULL DEFAULT '',
        sort_order INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `),
    d1.prepare("CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks (status)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS tasks_category_idx ON tasks (category)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS tasks_assignee_idx ON tasks (assignee)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS tasks_sort_order_idx ON tasks (sort_order)"),
  ]);

  const count = await d1.prepare("SELECT COUNT(*) AS count FROM tasks").first<{ count: number }>();
  if ((count?.count ?? 0) > 0) {
    return;
  }

  await d1.batch(
    seedTasks.map((item) =>
      d1
        .prepare(`
          INSERT INTO tasks (
            id,
            title,
            category,
            phase,
            status,
            assignee,
            due_window,
            priority,
            dependencies,
            notes,
            sort_order
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          item.id,
          item.title,
          item.category,
          item.phase,
          item.status,
          item.assignee,
          item.dueWindow,
          item.priority,
          JSON.stringify(item.dependencies),
          item.notes,
          item.sortOrder
        )
    )
  );
}

export async function listTasks() {
  await ensureTaskStorage();
  const result = await getD1()
    .prepare(
      "SELECT id, title, category, phase, status, assignee, due_window AS dueWindow, priority, dependencies, notes, sort_order AS sortOrder, created_at AS createdAt, updated_at AS updatedAt FROM tasks ORDER BY sort_order ASC"
    )
    .all<TaskRow>();

  return (result.results ?? []).map(fromRow);
}

export async function createTask(payload: Partial<TaskUpdatePayload>) {
  await ensureTaskStorage();
  const d1 = getD1();
  const title = payload.title?.trim();

  if (!title) {
    throw new Error("Task title is required.");
  }

  const category = categories.find((item) => item.name === payload.category) ?? categories[0];
  const nextOrder = await d1.prepare("SELECT COALESCE(MAX(sort_order), 0) + 1 AS nextOrder FROM tasks").first<{ nextOrder: number }>();
  const id = `rsp-custom-${crypto.randomUUID().slice(0, 8)}`;
  const status = payload.status && validStatuses.has(payload.status) ? payload.status : "queued";
  const priority = payload.priority && validPriorities.has(payload.priority) ? payload.priority : "normal";

  await d1
    .prepare(`
      INSERT INTO tasks (
        id,
        title,
        category,
        phase,
        status,
        assignee,
        due_window,
        priority,
        dependencies,
        notes,
        sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      id,
      title,
      category.name,
      category.phase,
      status,
      payload.assignee && teamMembers.includes(payload.assignee) ? payload.assignee : "Unassigned",
      payload.dueWindow?.trim() ?? "",
      priority,
      JSON.stringify(payload.dependencies ?? []),
      payload.notes?.trim() ?? "",
      nextOrder?.nextOrder ?? seedTasks.length + 1
    )
    .run();

  return getTask(id);
}

export async function getTask(id: string) {
  await ensureTaskStorage();
  const row = await getD1()
    .prepare(
      "SELECT id, title, category, phase, status, assignee, due_window AS dueWindow, priority, dependencies, notes, sort_order AS sortOrder, created_at AS createdAt, updated_at AS updatedAt FROM tasks WHERE id = ?"
    )
    .bind(id)
    .first<TaskRow>();

  if (!row) {
    throw new Error("Task not found.");
  }

  return fromRow(row);
}

export async function updateTask(id: string, payload: TaskUpdatePayload) {
  await ensureTaskStorage();
  const d1 = getD1();
  const updates: string[] = [];
  const values: unknown[] = [];

  if (typeof payload.title === "string") {
    const title = payload.title.trim();
    if (!title) {
      throw new Error("Task title is required.");
    }
    updates.push("title = ?");
    values.push(title);
  }

  if (typeof payload.category === "string") {
    const category = categories.find((item) => item.name === payload.category);
    if (category) {
      updates.push("category = ?", "phase = ?");
      values.push(category.name, category.phase);
    }
  }

  if (payload.status) {
    if (!validStatuses.has(payload.status)) {
      throw new Error("Invalid task status.");
    }
    updates.push("status = ?");
    values.push(payload.status satisfies TaskStatus);
  }

  if (typeof payload.assignee === "string") {
    updates.push("assignee = ?");
    values.push(teamMembers.includes(payload.assignee) ? payload.assignee : "Unassigned");
  }

  if (typeof payload.dueWindow === "string") {
    updates.push("due_window = ?");
    values.push(payload.dueWindow.trim());
  }

  if (payload.priority) {
    if (!validPriorities.has(payload.priority)) {
      throw new Error("Invalid priority.");
    }
    updates.push("priority = ?");
    values.push(payload.priority satisfies Priority);
  }

  if (Array.isArray(payload.dependencies)) {
    updates.push("dependencies = ?");
    values.push(JSON.stringify(payload.dependencies));
  }

  if (typeof payload.notes === "string") {
    updates.push("notes = ?");
    values.push(payload.notes.trim());
  }

  if (updates.length === 0) {
    return getTask(id);
  }

  updates.push("updated_at = CURRENT_TIMESTAMP");
  values.push(id);

  await d1.prepare(`UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`).bind(...values).run();
  return getTask(id);
}
