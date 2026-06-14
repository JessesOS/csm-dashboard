import { getD1 } from "../db";
import { portalDefaultsForTask } from "./portalDefaults";
import {
  allSeedClients,
  defaultProduct,
  normalizeProduct,
  productCategories,
  productConfig,
  productTasks,
  productTeamMembers,
} from "./productWorkspaces";
import {
  taskStatuses,
  type ClientAttentionItem,
  type ClientCreatePayload,
  type ClientDeliveryPhase,
  type ClientHealth,
  type ClientRisk,
  type ClientTimelineSegment,
  type Priority,
  type ProductKey,
  type RespondClient,
  type Task,
  type TaskStatus,
  type TaskUpdatePayload,
} from "./types";

type TaskRow = Omit<
  Task,
  "product" | "dependencies" | "clientId" | "templateId" | "portalVisible" | "portalActionRequired" | "portalConfigured"
> & {
  product: string;
  clientId: string;
  templateId: string;
  dependencies: string;
  portalVisible: number;
  portalActionRequired: number;
  portalConfigured: number;
};

type ClientRow = Omit<RespondClient, "product" | "timeline" | "attention"> & {
  product: string;
  timeline: string;
  attention: string;
};

type ClientCountRow = {
  clientId: string;
  total: number;
  completed: number;
  blocked: number;
};

const defaultClientId = productConfig(defaultProduct).defaultClientId;
const taskSelectFields =
  "id, product, client_id AS clientId, template_id AS templateId, title, category, phase, status, assignee, due_window AS dueWindow, priority, dependencies, notes, portal_visible AS portalVisible, portal_title AS portalTitle, portal_note AS portalNote, portal_action_required AS portalActionRequired, portal_configured AS portalConfigured, sort_order AS sortOrder, created_at AS createdAt, updated_at AS updatedAt";
const validStatuses = new Set<string>(taskStatuses);
const validPriorities = new Set<string>(["low", "normal", "high", "critical"]);
const validClientPhases = new Set<ClientDeliveryPhase>([
  "Discovery",
  "Onboarding",
  "Implementation",
  "Handoff",
  "Testing",
  "Go-Live",
  "Support",
]);
const validClientHealth = new Set<ClientHealth>(["on_track", "at_risk", "off_track", "on_hold"]);
const validClientRisk = new Set<ClientRisk>(["low", "medium", "high"]);
let storageReadyPromise: Promise<void> | null = null;

function parseJsonArray<T>(value: string | null | undefined, guard: (item: unknown) => item is T) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter(guard) : [];
  } catch {
    return [];
  }
}

function parseDependencies(value: string | null | undefined) {
  return parseJsonArray(value, (item): item is string => typeof item === "string");
}

function isTimelineSegment(item: unknown): item is ClientTimelineSegment {
  if (!item || typeof item !== "object") {
    return false;
  }

  const segment = item as Partial<ClientTimelineSegment>;
  return (
    typeof segment.label === "string" &&
    typeof segment.phase === "string" &&
    validClientPhases.has(segment.phase as ClientDeliveryPhase) &&
    typeof segment.startDay === "number" &&
    typeof segment.span === "number" &&
    typeof segment.status === "string" &&
    validClientHealth.has(segment.status as ClientHealth)
  );
}

function isAttentionItem(item: unknown): item is ClientAttentionItem {
  if (!item || typeof item !== "object") {
    return false;
  }

  const attention = item as Partial<ClientAttentionItem>;
  return (
    typeof attention.issue === "string" &&
    typeof attention.status === "string" &&
    typeof attention.owner === "string" &&
    typeof attention.lastUpdate === "string" &&
    typeof attention.nextStep === "string" &&
    typeof attention.blocker === "string" &&
    typeof attention.risk === "string" &&
    validClientRisk.has(attention.risk as ClientRisk)
  );
}

function fromRow(row: TaskRow): Task {
  return {
    ...row,
    product: normalizeProduct(row.product),
    dependencies: parseDependencies(row.dependencies),
    portalVisible: Boolean(row.portalVisible),
    portalActionRequired: Boolean(row.portalActionRequired),
    portalConfigured: Boolean(row.portalConfigured),
  };
}

function fromClientRow(row: ClientRow): RespondClient {
  const phase = validClientPhases.has(row.phase) ? row.phase : "Onboarding";
  const health = validClientHealth.has(row.health) ? row.health : "on_track";
  const risk = validClientRisk.has(row.risk) ? row.risk : "low";

  return {
    ...row,
    product: normalizeProduct(row.product),
    phase,
    health,
    risk,
    timeline: parseJsonArray(row.timeline, isTimelineSegment),
    attention: parseJsonArray(row.attention, isAttentionItem),
  };
}

function scopedTaskId(clientId: string, templateId: string) {
  return `${clientId}__${templateId}`;
}

function unscopedDependencyId(clientId: string, dependencyId: string) {
  return dependencyId.includes("__") ? dependencyId : scopedTaskId(clientId, dependencyId);
}

function routeErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  if (message.includes("D1 binding") || message.includes("no such table") || message.includes("no such column")) {
    return "Task storage is not ready yet. The dashboard can still render its seeded checklist, but live updates need the D1 binding and migration.";
  }

  return message;
}

export { routeErrorMessage };

function safeDateLabel(dateString: string) {
  if (!dateString) {
    return "";
  }

  const date = new Date(`${dateString}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function defaultGoLiveDate() {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 14);
  return date.toISOString().slice(0, 10);
}

function nowLabel() {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42);

  return slug || `client-${crypto.randomUUID().slice(0, 8)}`;
}

function makePortalToken() {
  return `rsp${crypto.randomUUID().replace(/-/g, "")}`;
}

function clientCode(name: string) {
  const letters = name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (letters || "CL").slice(0, 3);
}

function buildNewClient(payload: ClientCreatePayload, id: string, product: ProductKey): RespondClient {
  const config = productConfig(product);
  const templateTasks = productTasks(product);
  const name = payload.name?.trim() ?? "";
  const goLiveDate = payload.goLiveDate?.trim() || defaultGoLiveDate();
  const owner = payload.owner?.trim() || config.ownerFallback;
  const industry = payload.industry?.trim() || "New client";
  const lastUpdate = nowLabel();

  return {
    id,
    product,
    portalToken: makePortalToken(),
    name,
    code: clientCode(name),
    industry,
    owner,
    phase: "Onboarding",
    health: "on_track",
    progress: 0,
    currentTask: config.currentTaskFallback,
    goLiveDate,
    goLiveLabel: safeDateLabel(goLiveDate),
    lastUpdate,
    nextStep: config.nextStepFallback,
    blocker: "None",
    risk: "low",
    activeTasks: templateTasks.length,
    completedTasks: 0,
    timeline: [
      {
        label: config.taskTemplateLabel,
        phase: "Onboarding",
        startDay: 0,
        span: 5,
        status: "on_track",
        marker: "milestone",
      },
    ],
    attention: [
      {
        issue: "New client ready to start",
        status: "Ready",
        owner,
        lastUpdate,
        nextStep: config.nextStepFallback,
        blocker: "None",
        risk: "low",
      },
    ],
  };
}

function clientInsertValues(client: RespondClient) {
  return [
    client.id,
    client.product,
    client.portalToken ?? makePortalToken(),
    client.name,
    client.code,
    client.industry,
    client.owner,
    client.phase,
    client.health,
    client.progress,
    client.currentTask,
    client.goLiveDate,
    client.goLiveLabel,
    client.lastUpdate,
    client.nextStep,
    client.blocker,
    client.risk,
    client.activeTasks,
    client.completedTasks,
    JSON.stringify(client.timeline),
    JSON.stringify(client.attention),
  ];
}

async function tableColumns(tableName: string) {
  const result = await getD1().prepare(`PRAGMA table_info(${tableName})`).all<{ name: string }>();
  return new Set((result.results ?? []).map((column) => column.name));
}

async function ensureTaskColumns() {
  const d1 = getD1();
  const columns = await tableColumns("tasks");

  if (!columns.has("client_id")) {
    await d1.prepare(`ALTER TABLE tasks ADD COLUMN client_id TEXT NOT NULL DEFAULT '${defaultClientId}'`).run();
  }

  if (!columns.has("product")) {
    await d1.prepare("ALTER TABLE tasks ADD COLUMN product TEXT NOT NULL DEFAULT 'respond'").run();
  }

  if (!columns.has("template_id")) {
    await d1.prepare("ALTER TABLE tasks ADD COLUMN template_id TEXT NOT NULL DEFAULT ''").run();
  }

  if (!columns.has("portal_visible")) {
    await d1.prepare("ALTER TABLE tasks ADD COLUMN portal_visible INTEGER NOT NULL DEFAULT 0").run();
  }

  if (!columns.has("portal_title")) {
    await d1.prepare("ALTER TABLE tasks ADD COLUMN portal_title TEXT NOT NULL DEFAULT ''").run();
  }

  if (!columns.has("portal_note")) {
    await d1.prepare("ALTER TABLE tasks ADD COLUMN portal_note TEXT NOT NULL DEFAULT ''").run();
  }

  if (!columns.has("portal_action_required")) {
    await d1.prepare("ALTER TABLE tasks ADD COLUMN portal_action_required INTEGER NOT NULL DEFAULT 0").run();
  }

  if (!columns.has("portal_configured")) {
    await d1.prepare("ALTER TABLE tasks ADD COLUMN portal_configured INTEGER NOT NULL DEFAULT 0").run();
  }
}

async function ensureClientColumns() {
  const d1 = getD1();
  const columns = await tableColumns("clients");

  if (!columns.has("portal_token")) {
    await d1.prepare("ALTER TABLE clients ADD COLUMN portal_token TEXT NOT NULL DEFAULT ''").run();
  }

  if (!columns.has("product")) {
    await d1.prepare("ALTER TABLE clients ADD COLUMN product TEXT NOT NULL DEFAULT 'respond'").run();
  }
}

async function ensureClientPortalTokens() {
  const d1 = getD1();
  const rows = await d1.prepare("SELECT id FROM clients WHERE portal_token = ''").all<{ id: string }>();

  for (const row of rows.results ?? []) {
    await d1.prepare("UPDATE clients SET portal_token = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(makePortalToken(), row.id).run();
  }
}

async function seedClients() {
  const d1 = getD1();

  await d1.batch(
    allSeedClients.map((client) =>
      d1
        .prepare(`
          INSERT OR IGNORE INTO clients (
            id,
            product,
            portal_token,
            name,
            code,
            industry,
            owner,
            phase,
            health,
            progress,
            current_task,
            go_live_date,
            go_live_label,
            last_update,
            next_step,
            blocker,
            risk,
            active_tasks,
            completed_tasks,
            timeline,
            attention
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(...clientInsertValues(client))
    )
  );
}

async function migrateGlobalTasksToClient() {
  const d1 = getD1();
  const rows = await d1
    .prepare("SELECT id, client_id AS clientId, template_id AS templateId, dependencies FROM tasks WHERE instr(id, '__') = 0")
    .all<Pick<TaskRow, "id" | "clientId" | "templateId" | "dependencies">>();

  for (const row of rows.results ?? []) {
    const clientId = row.clientId || defaultClientId;
    const templateId = row.templateId || row.id;
    const nextId = scopedTaskId(clientId, templateId);
    const dependencies = parseDependencies(row.dependencies).map((dependencyId) => unscopedDependencyId(clientId, dependencyId));
    const collision = await d1.prepare("SELECT id FROM tasks WHERE id = ?").bind(nextId).first<{ id: string }>();

    if (collision && collision.id !== row.id) {
      await d1.prepare("DELETE FROM tasks WHERE id = ?").bind(row.id).run();
      continue;
    }

    await d1
      .prepare("UPDATE tasks SET id = ?, client_id = ?, template_id = ?, dependencies = ? WHERE id = ?")
      .bind(nextId, clientId, templateId, JSON.stringify(dependencies), row.id)
      .run();
  }
}

async function seedTemplateTasksForClient(clientId: string, product: ProductKey, useTemplateState: boolean) {
  const d1 = getD1();
  const existing = await d1
    .prepare("SELECT template_id AS templateId FROM tasks WHERE client_id = ? AND product = ?")
    .bind(clientId, product)
    .all<{ templateId: string }>();
  const existingTemplates = new Set((existing.results ?? []).map((item) => item.templateId));
  const missing = productTasks(product).filter((item) => !existingTemplates.has(item.id));

  if (missing.length === 0) {
    return;
  }

  await d1.batch(
    missing.map((item) =>
      d1
        .prepare(`
          INSERT OR IGNORE INTO tasks (
            id,
            product,
            client_id,
            template_id,
            title,
            category,
            phase,
            status,
            assignee,
            due_window,
            priority,
            dependencies,
            notes,
            portal_visible,
            portal_title,
            portal_note,
            portal_action_required,
            portal_configured,
            sort_order
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(...taskInsertValues(clientId, product, item, useTemplateState))
    )
  );
}

function taskInsertValues(clientId: string, product: ProductKey, item: Task, useTemplateState: boolean) {
  const portalDefaults = portalDefaultsForTask(item);

  return [
    scopedTaskId(clientId, item.id),
    product,
    clientId,
    item.id,
    item.title,
    item.category,
    item.phase,
    useTemplateState ? item.status : "queued",
    item.assignee,
    item.dueWindow,
    item.priority,
    JSON.stringify(item.dependencies.map((dependencyId) => scopedTaskId(clientId, dependencyId))),
    useTemplateState ? item.notes : "",
    item.portalVisible ? 1 : portalDefaults.portalVisible ? 1 : 0,
    item.portalTitle || portalDefaults.portalTitle,
    item.portalNote || portalDefaults.portalNote,
    item.portalActionRequired ? 1 : portalDefaults.portalActionRequired ? 1 : 0,
    item.portalConfigured ? 1 : 0,
    item.sortOrder,
  ];
}

async function applyPortalDefaultsToUnconfiguredTasks(clientId?: string, product?: ProductKey) {
  const d1 = getD1();
  const where = [
    "portal_configured = 0",
    "portal_visible = 0",
    "portal_title = ''",
    "portal_note = ''",
    "portal_action_required = 0",
  ];
  const binds: string[] = [];

  if (clientId) {
    where.push("client_id = ?");
    binds.push(clientId);
  }

  if (product) {
    where.push("product = ?");
    binds.push(product);
  }

  const result = await d1
    .prepare(`SELECT id, title, category FROM tasks WHERE ${where.join(" AND ")}`)
    .bind(...binds)
    .all<Pick<Task, "id" | "title" | "category">>();

  for (const task of result.results ?? []) {
    const defaults = portalDefaultsForTask(task);
    await d1
      .prepare(
        "UPDATE tasks SET portal_visible = ?, portal_title = ?, portal_note = ?, portal_action_required = ? WHERE id = ? AND portal_configured = 0"
      )
      .bind(defaults.portalVisible ? 1 : 0, defaults.portalTitle, defaults.portalNote, defaults.portalActionRequired ? 1 : 0, task.id)
      .run();
  }
}

async function seedTaskWorkspaces() {
  const clients = await getD1().prepare("SELECT id, product FROM clients ORDER BY created_at ASC").all<{ id: string; product: string }>();

  for (const client of clients.results ?? []) {
    const product = normalizeProduct(client.product);
    await seedTemplateTasksForClient(client.id, product, client.id === productConfig(product).defaultClientId);
  }
}

async function prepareTaskStorage() {
  const d1 = getD1();

  await d1.batch([
    d1.prepare(`
      CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        product TEXT NOT NULL DEFAULT 'respond',
        portal_token TEXT NOT NULL DEFAULT '',
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        industry TEXT NOT NULL DEFAULT '',
        owner TEXT NOT NULL DEFAULT 'Response CSM',
        phase TEXT NOT NULL DEFAULT 'Onboarding',
        health TEXT NOT NULL DEFAULT 'on_track',
        progress INTEGER NOT NULL DEFAULT 0,
        current_task TEXT NOT NULL DEFAULT 'Fresh onboarding template',
        go_live_date TEXT NOT NULL DEFAULT '',
        go_live_label TEXT NOT NULL DEFAULT '',
        last_update TEXT NOT NULL DEFAULT '',
        next_step TEXT NOT NULL DEFAULT 'Start onboarding checklist',
        blocker TEXT NOT NULL DEFAULT 'None',
        risk TEXT NOT NULL DEFAULT 'low',
        active_tasks INTEGER NOT NULL DEFAULT 0,
        completed_tasks INTEGER NOT NULL DEFAULT 0,
        timeline TEXT NOT NULL DEFAULT '[]',
        attention TEXT NOT NULL DEFAULT '[]',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `),
    d1.prepare(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        product TEXT NOT NULL DEFAULT 'respond',
        client_id TEXT NOT NULL DEFAULT '${defaultClientId}',
        template_id TEXT NOT NULL DEFAULT '',
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        phase TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'queued',
        assignee TEXT NOT NULL DEFAULT 'Unassigned',
        due_window TEXT NOT NULL DEFAULT '',
        priority TEXT NOT NULL DEFAULT 'normal',
        dependencies TEXT NOT NULL DEFAULT '[]',
        notes TEXT NOT NULL DEFAULT '',
        portal_visible INTEGER NOT NULL DEFAULT 0,
        portal_title TEXT NOT NULL DEFAULT '',
        portal_note TEXT NOT NULL DEFAULT '',
        portal_action_required INTEGER NOT NULL DEFAULT 0,
        portal_configured INTEGER NOT NULL DEFAULT 0,
        sort_order INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `),
  ]);

  await ensureTaskColumns();
  await ensureClientColumns();

  await seedClients();
  await ensureClientPortalTokens();

  await d1.batch([
    d1.prepare("CREATE INDEX IF NOT EXISTS tasks_product_idx ON tasks (product)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS tasks_product_client_idx ON tasks (product, client_id)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS tasks_product_status_idx ON tasks (product, status)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS tasks_client_idx ON tasks (client_id)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS tasks_client_status_idx ON tasks (client_id, status)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS tasks_client_template_idx ON tasks (client_id, template_id)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS tasks_client_portal_idx ON tasks (client_id, portal_visible)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS tasks_category_idx ON tasks (category)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS tasks_assignee_idx ON tasks (assignee)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS tasks_sort_order_idx ON tasks (sort_order)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS clients_product_idx ON clients (product)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS clients_product_name_idx ON clients (product, name)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS clients_name_idx ON clients (name)"),
    d1.prepare("CREATE UNIQUE INDEX IF NOT EXISTS clients_portal_token_idx ON clients (portal_token)"),
  ]);

  await migrateGlobalTasksToClient();
  await seedTaskWorkspaces();
  await applyPortalDefaultsToUnconfiguredTasks();
}

export async function ensureTaskStorage() {
  storageReadyPromise ??= prepareTaskStorage().catch((error) => {
    storageReadyPromise = null;
    throw error;
  });

  return storageReadyPromise;
}

function applyClientCounts(client: RespondClient, counts: ClientCountRow | undefined): RespondClient {
  if (!counts || counts.total === 0) {
    return client;
  }

  const progress = Math.round((counts.completed / counts.total) * 100);
  const health: ClientHealth =
    counts.blocked >= 3 ? "off_track" : counts.blocked > 0 ? "at_risk" : progress >= 100 ? "on_track" : client.health;
  const risk: ClientRisk = counts.blocked >= 3 ? "high" : counts.blocked > 0 ? "medium" : client.risk;

  return {
    ...client,
    progress,
    health,
    risk,
    activeTasks: counts.total - counts.completed,
    completedTasks: counts.completed,
  };
}

export async function listClients(productInput: string | null | undefined = defaultProduct) {
  await ensureTaskStorage();
  const d1 = getD1();
  const product = normalizeProduct(productInput);
  const [clientRows, countRows] = await Promise.all([
    d1
      .prepare(
        "SELECT id, product, portal_token AS portalToken, name, code, industry, owner, phase, health, progress, current_task AS currentTask, go_live_date AS goLiveDate, go_live_label AS goLiveLabel, last_update AS lastUpdate, next_step AS nextStep, blocker, risk, active_tasks AS activeTasks, completed_tasks AS completedTasks, timeline, attention FROM clients WHERE product = ? ORDER BY created_at ASC"
      )
      .bind(product)
      .all<ClientRow>(),
    d1
      .prepare(
        "SELECT client_id AS clientId, COUNT(*) AS total, SUM(CASE WHEN status = 'complete' THEN 1 ELSE 0 END) AS completed, SUM(CASE WHEN status = 'blocked' THEN 1 ELSE 0 END) AS blocked FROM tasks WHERE product = ? GROUP BY client_id"
      )
      .bind(product)
      .all<ClientCountRow>(),
  ]);
  const counts = new Map((countRows.results ?? []).map((item) => [item.clientId, item]));

  return (clientRows.results ?? []).map(fromClientRow).map((client) => applyClientCounts(client, counts.get(client.id)));
}

async function requireClient(product: ProductKey, clientId: string) {
  await ensureTaskStorage();
  const client = await getD1().prepare("SELECT id FROM clients WHERE id = ? AND product = ?").bind(clientId, product).first<{ id: string }>();

  if (!client) {
    throw new Error("Client not found.");
  }

  await seedTemplateTasksForClient(clientId, product, false);
  await applyPortalDefaultsToUnconfiguredTasks(clientId, product);
  return client.id;
}

export async function listTasks(productInput: string | null | undefined = defaultProduct, clientIdInput?: string | null) {
  const product = normalizeProduct(productInput);
  const requestedClientId = clientIdInput && clientIdInput !== "all" ? clientIdInput : productConfig(product).defaultClientId;
  const scopedClientId = await requireClient(product, requestedClientId);
  const result = await getD1()
    .prepare(`SELECT ${taskSelectFields} FROM tasks WHERE product = ? AND client_id = ? ORDER BY sort_order ASC`)
    .bind(product, scopedClientId)
    .all<TaskRow>();

  return (result.results ?? []).map(fromRow);
}

export async function createTask(productInput: string | null | undefined, clientId: string | undefined, payload: Partial<TaskUpdatePayload>) {
  const product = normalizeProduct(productInput);
  const scopedClientId = await requireClient(product, clientId || productConfig(product).defaultClientId);
  const d1 = getD1();
  const title = payload.title?.trim();

  if (!title) {
    throw new Error("Task title is required.");
  }

  const categories = productCategories(product);
  const teamMembers = productTeamMembers(product);
  const templateTasks = productTasks(product);
  const category = categories.find((item) => item.name === payload.category) ?? categories[0];
  const nextOrder = await d1
    .prepare("SELECT COALESCE(MAX(sort_order), 0) + 1 AS nextOrder FROM tasks WHERE product = ? AND client_id = ?")
    .bind(product, scopedClientId)
    .first<{ nextOrder: number }>();
  const templateId = `custom-${crypto.randomUUID().slice(0, 8)}`;
  const id = scopedTaskId(scopedClientId, templateId);
  const status = payload.status && validStatuses.has(payload.status) ? payload.status : "queued";
  const priority = payload.priority && validPriorities.has(payload.priority) ? payload.priority : "normal";

  await d1
    .prepare(`
      INSERT INTO tasks (
        id,
        product,
        client_id,
        template_id,
        title,
        category,
        phase,
        status,
        assignee,
        due_window,
        priority,
        dependencies,
        notes,
        portal_visible,
        portal_title,
        portal_note,
        portal_action_required,
        portal_configured,
        sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      id,
      product,
      scopedClientId,
      templateId,
      title,
      category.name,
      category.phase,
      status,
      payload.assignee && teamMembers.includes(payload.assignee) ? payload.assignee : "Unassigned",
      payload.dueWindow?.trim() ?? "",
      priority,
      JSON.stringify(payload.dependencies ?? []),
      payload.notes?.trim() ?? "",
      payload.portalVisible ? 1 : 0,
      payload.portalTitle?.trim() ?? "",
      payload.portalNote?.trim() ?? "",
      payload.portalActionRequired ? 1 : 0,
      payload.portalVisible || payload.portalTitle || payload.portalNote || payload.portalActionRequired ? 1 : 0,
      nextOrder?.nextOrder ?? templateTasks.length + 1
    )
    .run();

  return getTask(id);
}

export async function getTask(id: string) {
  await ensureTaskStorage();
  const row = await getD1()
    .prepare(`SELECT ${taskSelectFields} FROM tasks WHERE id = ?`)
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
  const existing = await d1.prepare("SELECT product FROM tasks WHERE id = ?").bind(id).first<{ product: string }>();

  if (!existing) {
    throw new Error("Task not found.");
  }

  const product = normalizeProduct(existing.product);
  const categories = productCategories(product);
  const teamMembers = productTeamMembers(product);
  const updates: string[] = [];
  const values: unknown[] = [];
  let touchedPortalFields = false;

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

  if (typeof payload.portalVisible === "boolean") {
    updates.push("portal_visible = ?");
    values.push(payload.portalVisible ? 1 : 0);
    touchedPortalFields = true;
  }

  if (typeof payload.portalTitle === "string") {
    updates.push("portal_title = ?");
    values.push(payload.portalTitle.trim());
    touchedPortalFields = true;
  }

  if (typeof payload.portalNote === "string") {
    updates.push("portal_note = ?");
    values.push(payload.portalNote.trim());
    touchedPortalFields = true;
  }

  if (typeof payload.portalActionRequired === "boolean") {
    updates.push("portal_action_required = ?");
    values.push(payload.portalActionRequired ? 1 : 0);
    touchedPortalFields = true;
  }

  if (updates.length === 0) {
    return getTask(id);
  }

  if (touchedPortalFields) {
    updates.push("portal_configured = ?");
    values.push(1);
  }

  updates.push("updated_at = CURRENT_TIMESTAMP");
  values.push(id);

  await d1.prepare(`UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`).bind(...values).run();
  return getTask(id);
}

async function nextClientId(name: string, product: ProductKey) {
  const d1 = getD1();
  const slug = slugify(name);
  const base = product === "respond" ? slug : `${product}-${slug}`;
  let id = base;
  let suffix = 2;

  while (await d1.prepare("SELECT id FROM clients WHERE id = ?").bind(id).first<{ id: string }>()) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }

  return id;
}

export async function createClient(payload: ClientCreatePayload) {
  await ensureTaskStorage();
  const name = payload.name?.trim();
  const product = normalizeProduct(payload.product);

  if (!name) {
    throw new Error("Client name is required.");
  }

  const d1 = getD1();
  const id = await nextClientId(name, product);
  const client = buildNewClient({ ...payload, name }, id, product);

  await d1
    .prepare(`
      INSERT INTO clients (
        id,
        product,
        portal_token,
        name,
        code,
        industry,
        owner,
        phase,
        health,
        progress,
        current_task,
        go_live_date,
        go_live_label,
        last_update,
        next_step,
        blocker,
        risk,
        active_tasks,
        completed_tasks,
        timeline,
        attention
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(...clientInsertValues(client))
    .run();

  await seedTemplateTasksForClient(client.id, product, false);
  await applyPortalDefaultsToUnconfiguredTasks(client.id, product);

  return {
    client,
    tasks: await listTasks(product, client.id),
  };
}

export async function getPortalWorkspace(token: string) {
  const portalToken = token.trim();

  if (!/^[a-zA-Z0-9_-]{20,80}$/.test(portalToken)) {
    throw new Error("Portal not found.");
  }

  await ensureTaskStorage();

  const row = await getD1()
    .prepare(
      "SELECT id, product, portal_token AS portalToken, name, code, industry, owner, phase, health, progress, current_task AS currentTask, go_live_date AS goLiveDate, go_live_label AS goLiveLabel, last_update AS lastUpdate, next_step AS nextStep, blocker, risk, active_tasks AS activeTasks, completed_tasks AS completedTasks, timeline, attention FROM clients WHERE portal_token = ?"
    )
    .bind(portalToken)
    .first<ClientRow>();

  if (!row) {
    throw new Error("Portal not found.");
  }

  const client = fromClientRow(row);

  return {
    client,
    tasks: await listTasks(client.product, client.id),
  };
}
