import { getD1 } from "../db";
import { portalDefaultsForTask } from "./portalDefaults";
import {
  allSeedClients,
  defaultEnvironment,
  defaultProduct,
  normalizeProduct,
  normalizeEnvironment,
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
  type EnvironmentKey,
  type Priority,
  type ProductKey,
  type RespondClient,
  type Task,
  type TaskStatus,
  type TaskUpdatePayload,
} from "./types";

type TaskRow = Omit<
  Task,
  "environment" | "product" | "dependencies" | "clientId" | "templateId" | "portalVisible" | "portalActionRequired" | "portalConfigured"
> & {
  environment: string;
  product: string;
  clientId: string;
  templateId: string;
  dependencies: string;
  portalVisible: number;
  portalActionRequired: number;
  portalConfigured: number;
};

type ClientRow = Omit<RespondClient, "environment" | "product" | "timeline" | "attention"> & {
  environment: string;
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

type CountRow = {
  count: number;
};

type MetaRow = {
  value: string;
};

const defaultClientId = productConfig(defaultProduct).defaultClientId;
const currentStorageVersion = "2026-06-14-loom-instructions";
const storagePreparedMetaKey = "task_storage_prepared";
const portalDefaultBatchSize = 50;
const taskSelectFields =
  "id, environment, product, client_id AS clientId, template_id AS templateId, title, category, phase, status, assignee, due_window AS dueWindow, priority, dependencies, notes, loom_url AS loomUrl, loom_title AS loomTitle, portal_visible AS portalVisible, portal_title AS portalTitle, portal_note AS portalNote, portal_action_required AS portalActionRequired, portal_configured AS portalConfigured, sort_order AS sortOrder, created_at AS createdAt, updated_at AS updatedAt";
const clientSelectFields =
  "id, environment, product, portal_token AS portalToken, name, company_name AS companyName, code, industry, owner, phase, health, progress, current_task AS currentTask, go_live_date AS goLiveDate, go_live_label AS goLiveLabel, last_update AS lastUpdate, next_step AS nextStep, blocker, risk, active_tasks AS activeTasks, completed_tasks AS completedTasks, timeline, attention";
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
    environment: normalizeEnvironment(row.environment),
    product: normalizeProduct(row.product),
    dependencies: parseDependencies(row.dependencies),
    loomUrl: row.loomUrl ?? "",
    loomTitle: row.loomTitle ?? "",
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
    environment: normalizeEnvironment(row.environment),
    product: normalizeProduct(row.product),
    companyName: row.companyName ?? "",
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

function buildNewClient(payload: ClientCreatePayload, id: string, environment: EnvironmentKey, product: ProductKey): RespondClient {
  const config = productConfig(product);
  const templateTasks = productTasks(product);
  const name = payload.name?.trim() ?? "";
  const companyName = payload.companyName?.trim() ?? "";
  const goLiveDate = payload.goLiveDate?.trim() || defaultGoLiveDate();
  const owner = payload.owner?.trim() || config.ownerFallback;
  const industry = payload.industry?.trim() || "New client";
  const lastUpdate = nowLabel();

  return {
    id,
    environment,
    product,
    portalToken: makePortalToken(),
    name,
    companyName,
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
    client.environment,
    client.product,
    client.portalToken ?? makePortalToken(),
    client.name,
    client.companyName ?? "",
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

async function ensureAppMetaTable(d1 = getD1()) {
  await d1
    .prepare(
      "CREATE TABLE IF NOT EXISTS app_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"
    )
    .run();
}

async function seedWorkspaceShapeReady() {
  const d1 = getD1();
  const [taskColumns, clientColumns] = await Promise.all([tableColumns("tasks"), tableColumns("clients")]);
  const requiredTaskColumns = [
    "client_id",
    "environment",
    "product",
    "template_id",
    "loom_url",
    "loom_title",
    "portal_visible",
    "portal_title",
    "portal_note",
    "portal_action_required",
    "portal_configured",
  ];
  const requiredClientColumns = ["portal_token", "environment", "product", "company_name"];

  if (!requiredTaskColumns.every((column) => taskColumns.has(column)) || !requiredClientColumns.every((column) => clientColumns.has(column))) {
    return false;
  }

  const seedClientIds = allSeedClients.map((client) => client.id);
  const seedClientsWithCompany = allSeedClients.filter((client) => client.companyName);
  const placeholders = seedClientIds.map(() => "?").join(", ");
  const [clientCount, taskClientCount] = await Promise.all([
    d1
      .prepare(`SELECT COUNT(DISTINCT id) AS count FROM clients WHERE id IN (${placeholders})`)
      .bind(...seedClientIds)
      .first<CountRow>(),
    d1
      .prepare(`SELECT COUNT(DISTINCT client_id) AS count FROM tasks WHERE client_id IN (${placeholders})`)
      .bind(...seedClientIds)
      .first<CountRow>(),
  ]);

  if ((clientCount?.count ?? 0) < seedClientIds.length || (taskClientCount?.count ?? 0) < seedClientIds.length) {
    return false;
  }

  if (seedClientsWithCompany.length === 0) {
    return true;
  }

  const companyPlaceholders = seedClientsWithCompany.map(() => "?").join(", ");
  const companyRows = await d1
    .prepare(`SELECT id, company_name AS companyName FROM clients WHERE id IN (${companyPlaceholders})`)
    .bind(...seedClientsWithCompany.map((client) => client.id))
    .all<Pick<ClientRow, "id" | "companyName">>();
  const companyByClientId = new Map((companyRows.results ?? []).map((client) => [client.id, client.companyName ?? ""]));

  return seedClientsWithCompany.every((client) => normalizeClientIdentity(companyByClientId.get(client.id)) === normalizeClientIdentity(client.companyName));
}

async function markStoragePrepared(d1 = getD1()) {
  await ensureAppMetaTable(d1);
  await d1
    .prepare(
      "INSERT INTO app_meta (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP"
    )
    .bind(storagePreparedMetaKey, currentStorageVersion)
    .run();
}

async function storagePreparationAlreadyCompleted(d1 = getD1()) {
  await ensureAppMetaTable(d1);

  try {
    const meta = await d1.prepare("SELECT value FROM app_meta WHERE key = ?").bind(storagePreparedMetaKey).first<MetaRow>();
    const shapeReady = await seedWorkspaceShapeReady();

    if (!shapeReady) {
      return false;
    }

    if (meta?.value !== currentStorageVersion) {
      await markStoragePrepared(d1);
    }

    return true;
  } catch {
    return false;
  }
}

async function ensureTaskColumns() {
  const d1 = getD1();
  const columns = await tableColumns("tasks");

  if (!columns.has("client_id")) {
    await d1.prepare(`ALTER TABLE tasks ADD COLUMN client_id TEXT NOT NULL DEFAULT '${defaultClientId}'`).run();
  }

  if (!columns.has("environment")) {
    await d1.prepare("ALTER TABLE tasks ADD COLUMN environment TEXT NOT NULL DEFAULT 'demo'").run();
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

  if (!columns.has("loom_url")) {
    await d1.prepare("ALTER TABLE tasks ADD COLUMN loom_url TEXT NOT NULL DEFAULT ''").run();
  }

  if (!columns.has("loom_title")) {
    await d1.prepare("ALTER TABLE tasks ADD COLUMN loom_title TEXT NOT NULL DEFAULT ''").run();
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

  if (!columns.has("environment")) {
    await d1.prepare("ALTER TABLE clients ADD COLUMN environment TEXT NOT NULL DEFAULT 'demo'").run();
  }

  if (!columns.has("product")) {
    await d1.prepare("ALTER TABLE clients ADD COLUMN product TEXT NOT NULL DEFAULT 'respond'").run();
  }

  if (!columns.has("company_name")) {
    await d1.prepare("ALTER TABLE clients ADD COLUMN company_name TEXT NOT NULL DEFAULT ''").run();
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
            environment,
            product,
            portal_token,
            name,
            company_name,
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
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(...clientInsertValues(client))
    )
  );
}

async function syncSeedClientIdentityDefaults() {
  const d1 = getD1();
  const seededCompanies = allSeedClients.filter((client) => client.companyName);

  if (seededCompanies.length === 0) {
    return;
  }

  await d1.batch(
    seededCompanies.map((client) =>
      d1
        .prepare("UPDATE clients SET company_name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND company_name = ''")
        .bind(client.companyName ?? "", client.id)
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

async function seedTemplateTasksForClient(clientId: string, environment: EnvironmentKey, product: ProductKey, useTemplateState: boolean) {
  const d1 = getD1();
  const existing = await d1
    .prepare("SELECT template_id AS templateId FROM tasks WHERE client_id = ? AND environment = ? AND product = ?")
    .bind(clientId, environment, product)
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
            environment,
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
            loom_url,
            loom_title,
            portal_visible,
            portal_title,
            portal_note,
            portal_action_required,
            portal_configured,
            sort_order
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(...taskInsertValues(clientId, environment, product, item, useTemplateState))
    )
  );
}

function taskInsertValues(clientId: string, environment: EnvironmentKey, product: ProductKey, item: Task, useTemplateState: boolean) {
  const portalDefaults = portalDefaultsForTask(item);

  return [
    scopedTaskId(clientId, item.id),
    environment,
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
    item.loomUrl ?? "",
    item.loomTitle ?? "",
    item.portalVisible ? 1 : portalDefaults.portalVisible ? 1 : 0,
    item.portalTitle || portalDefaults.portalTitle,
    item.portalNote || portalDefaults.portalNote,
    item.portalActionRequired ? 1 : portalDefaults.portalActionRequired ? 1 : 0,
    1,
    item.sortOrder,
  ];
}

async function applyPortalDefaultsToUnconfiguredTasks(clientId?: string, environment?: EnvironmentKey, product?: ProductKey) {
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

  if (environment) {
    where.push("environment = ?");
    binds.push(environment);
  }

  if (product) {
    where.push("product = ?");
    binds.push(product);
  }

  const result = await d1
    .prepare(`SELECT id, title, category FROM tasks WHERE ${where.join(" AND ")}`)
    .bind(...binds)
    .all<Pick<Task, "id" | "title" | "category">>();

  const tasks = result.results ?? [];

  for (let index = 0; index < tasks.length; index += portalDefaultBatchSize) {
    const batch = tasks.slice(index, index + portalDefaultBatchSize).map((task) => {
      const defaults = portalDefaultsForTask(task);

      return d1
        .prepare(
          "UPDATE tasks SET portal_visible = ?, portal_title = ?, portal_note = ?, portal_action_required = ?, portal_configured = 1 WHERE id = ? AND portal_configured = 0"
        )
        .bind(defaults.portalVisible ? 1 : 0, defaults.portalTitle, defaults.portalNote, defaults.portalActionRequired ? 1 : 0, task.id);
    });

    if (batch.length > 0) {
      await d1.batch(batch);
    }
  }
}

async function seedTaskWorkspaces() {
  const clients = await getD1()
    .prepare("SELECT id, environment, product FROM clients ORDER BY created_at ASC")
    .all<{ id: string; environment: string; product: string }>();

  for (const client of clients.results ?? []) {
    const environment = normalizeEnvironment(client.environment);
    const product = normalizeProduct(client.product);
    await seedTemplateTasksForClient(client.id, environment, product, environment === defaultEnvironment && client.id === productConfig(product).defaultClientId);
  }
}

async function prepareTaskStorage() {
  const d1 = getD1();

  if (await storagePreparationAlreadyCompleted(d1)) {
    return;
  }

  await d1.batch([
    d1.prepare(`
      CREATE TABLE IF NOT EXISTS app_meta (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `),
    d1.prepare(`
      CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        environment TEXT NOT NULL DEFAULT 'demo',
        product TEXT NOT NULL DEFAULT 'respond',
        portal_token TEXT NOT NULL DEFAULT '',
        name TEXT NOT NULL,
        company_name TEXT NOT NULL DEFAULT '',
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
        environment TEXT NOT NULL DEFAULT 'demo',
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
        loom_url TEXT NOT NULL DEFAULT '',
        loom_title TEXT NOT NULL DEFAULT '',
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
  await syncSeedClientIdentityDefaults();
  await ensureClientPortalTokens();

  await d1.batch([
    d1.prepare("CREATE INDEX IF NOT EXISTS tasks_environment_idx ON tasks (environment)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS tasks_environment_product_idx ON tasks (environment, product)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS tasks_environment_product_client_idx ON tasks (environment, product, client_id)"),
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
    d1.prepare("CREATE INDEX IF NOT EXISTS clients_environment_idx ON clients (environment)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS clients_environment_product_idx ON clients (environment, product)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS clients_environment_product_name_idx ON clients (environment, product, name)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS clients_environment_product_company_idx ON clients (environment, product, company_name)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS clients_product_idx ON clients (product)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS clients_product_name_idx ON clients (product, name)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS clients_name_idx ON clients (name)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS clients_company_name_idx ON clients (company_name)"),
    d1.prepare("CREATE UNIQUE INDEX IF NOT EXISTS clients_portal_token_idx ON clients (portal_token)"),
  ]);

  await migrateGlobalTasksToClient();
  await seedTaskWorkspaces();
  await applyPortalDefaultsToUnconfiguredTasks();
  await markStoragePrepared(d1);
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

export async function listClients(environmentInput: string | null | undefined = defaultEnvironment, productInput: string | null | undefined = defaultProduct) {
  await ensureTaskStorage();
  const d1 = getD1();
  const environment = normalizeEnvironment(environmentInput);
  const product = normalizeProduct(productInput);

  await reconcileDuplicateClients(environment, product);

  const [clientRows, countRows] = await Promise.all([
    d1
      .prepare(`SELECT ${clientSelectFields} FROM clients WHERE environment = ? AND product = ? ORDER BY created_at ASC, id ASC`)
      .bind(environment, product)
      .all<ClientRow>(),
    d1
      .prepare(
        "SELECT client_id AS clientId, COUNT(*) AS total, SUM(CASE WHEN status = 'complete' THEN 1 ELSE 0 END) AS completed, SUM(CASE WHEN status = 'blocked' THEN 1 ELSE 0 END) AS blocked FROM tasks WHERE environment = ? AND product = ? GROUP BY client_id"
      )
      .bind(environment, product)
      .all<ClientCountRow>(),
  ]);
  const counts = new Map((countRows.results ?? []).map((item) => [item.clientId, item]));

  return (clientRows.results ?? []).map(fromClientRow).map((client) => applyClientCounts(client, counts.get(client.id)));
}

async function requireClient(environment: EnvironmentKey, product: ProductKey, clientId: string) {
  await ensureTaskStorage();
  const client = await getD1()
    .prepare("SELECT id FROM clients WHERE id = ? AND environment = ? AND product = ?")
    .bind(clientId, environment, product)
    .first<{ id: string }>();

  if (!client) {
    throw new Error("Client not found.");
  }

  await seedTemplateTasksForClient(clientId, environment, product, false);
  await applyPortalDefaultsToUnconfiguredTasks(clientId, environment, product);
  return client.id;
}

async function firstClientId(environment: EnvironmentKey, product: ProductKey) {
  const row = await getD1()
    .prepare("SELECT id FROM clients WHERE environment = ? AND product = ? ORDER BY created_at ASC, id ASC")
    .bind(environment, product)
    .first<{ id: string }>();

  return row?.id ?? "";
}

export async function listTasks(
  environmentInput: string | null | undefined = defaultEnvironment,
  productInput: string | null | undefined = defaultProduct,
  clientIdInput?: string | null
) {
  await ensureTaskStorage();
  const environment = normalizeEnvironment(environmentInput);
  const product = normalizeProduct(productInput);
  const requestedClientId = clientIdInput && clientIdInput !== "all" ? clientIdInput : await firstClientId(environment, product);

  if (!requestedClientId) {
    return [];
  }

  const scopedClientId = await requireClient(environment, product, requestedClientId);
  const result = await getD1()
    .prepare(`SELECT ${taskSelectFields} FROM tasks WHERE environment = ? AND product = ? AND client_id = ? ORDER BY sort_order ASC`)
    .bind(environment, product, scopedClientId)
    .all<TaskRow>();

  return (result.results ?? []).map(fromRow);
}

export async function createTask(
  environmentInput: string | null | undefined,
  productInput: string | null | undefined,
  clientId: string | undefined,
  payload: Partial<TaskUpdatePayload>
) {
  const environment = normalizeEnvironment(environmentInput);
  const product = normalizeProduct(productInput);
  const scopedClientId = await requireClient(environment, product, clientId || (await firstClientId(environment, product)));
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
    .prepare("SELECT COALESCE(MAX(sort_order), 0) + 1 AS nextOrder FROM tasks WHERE environment = ? AND product = ? AND client_id = ?")
    .bind(environment, product, scopedClientId)
    .first<{ nextOrder: number }>();
  const templateId = `custom-${crypto.randomUUID().slice(0, 8)}`;
  const id = scopedTaskId(scopedClientId, templateId);
  const status = payload.status && validStatuses.has(payload.status) ? payload.status : "queued";
  const priority = payload.priority && validPriorities.has(payload.priority) ? payload.priority : "normal";

  await d1
    .prepare(`
      INSERT INTO tasks (
        id,
        environment,
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
        loom_url,
        loom_title,
        portal_visible,
        portal_title,
        portal_note,
        portal_action_required,
        portal_configured,
        sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      id,
      environment,
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
      payload.loomUrl?.trim() ?? "",
      payload.loomTitle?.trim() ?? "",
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
  const existing = await d1.prepare("SELECT environment, product FROM tasks WHERE id = ?").bind(id).first<{ environment: string; product: string }>();

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

  if (typeof payload.loomUrl === "string") {
    updates.push("loom_url = ?");
    values.push(payload.loomUrl.trim());
  }

  if (typeof payload.loomTitle === "string") {
    updates.push("loom_title = ?");
    values.push(payload.loomTitle.trim());
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

async function nextClientId(name: string, environment: EnvironmentKey, product: ProductKey) {
  const d1 = getD1();
  const slug = slugify(name);
  const productSlug = product === "respond" ? slug : `${product}-${slug}`;
  const base = environment === "demo" ? productSlug : `live-${productSlug}`;
  let id = base;
  let suffix = 2;

  while (await d1.prepare("SELECT id FROM clients WHERE id = ?").bind(id).first<{ id: string }>()) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }

  return id;
}

function normalizeClientIdentity(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function stripCompanySuffix(identity: string) {
  return identity
    .replace(/\b(pty\s+ltd|pty\s+limited|limited|ltd|llc|incorporated|inc|corporation|corp|company|co)\b\.?$/i, "")
    .trim();
}

function clientIdentityValues(...values: Array<string | null | undefined>) {
  const identities = new Set<string>();

  values.forEach((value) => {
    const normalized = normalizeClientIdentity(value);

    if (!normalized) {
      return;
    }

    [normalized, stripCompanySuffix(normalized)].forEach((identity) => {
      if (!identity) {
        return;
      }

      identities.add(identity);
      identities.add(identity.replace(/\s+/g, ""));
    });
  });

  return [...identities];
}

function identitiesOverlap(...identitySets: string[][]) {
  const [first, ...rest] = identitySets;

  if (!first || rest.length === 0) {
    return false;
  }

  const lookup = new Set(first);
  return rest.some((identities) => identities.some((identity) => lookup.has(identity)));
}

function companyNameLooksLegalEntity(value: string | null | undefined) {
  return /\b(pty|ltd|limited|llc|inc|corp|corporation|company|co)\b/i.test(normalizeClientIdentity(value));
}

function companyIdentityValuesFor(name: string | null | undefined, companyName: string | null | undefined) {
  return clientIdentityValues(companyName, companyNameLooksLegalEntity(name) ? name : undefined);
}

function ownerIdentityValuesFor(name: string | null | undefined) {
  return companyNameLooksLegalEntity(name) ? [] : clientIdentityValues(name);
}

function clientMatchesIncomingIdentity(client: RespondClient, incomingName: string, incomingCompanyName: string) {
  const clientCompanyIdentities = companyIdentityValuesFor(client.name, client.companyName);
  const incomingCompanyIdentities = companyIdentityValuesFor(incomingName, incomingCompanyName);

  if (identitiesOverlap(clientCompanyIdentities, incomingCompanyIdentities)) {
    return true;
  }

  const clientOwnerIdentities = ownerIdentityValuesFor(client.name);
  const incomingOwnerIdentities = ownerIdentityValuesFor(incomingName);

  if (clientCompanyIdentities.length > 0 && incomingCompanyIdentities.length > 0) {
    return false;
  }

  return identitiesOverlap(clientOwnerIdentities, incomingOwnerIdentities);
}

function clientsShareClientIdentity(left: RespondClient, right: RespondClient) {
  const leftCompanyIdentities = companyIdentityValuesFor(left.name, left.companyName);
  const rightCompanyIdentities = companyIdentityValuesFor(right.name, right.companyName);

  if (identitiesOverlap(leftCompanyIdentities, rightCompanyIdentities)) {
    return true;
  }

  if (leftCompanyIdentities.length > 0 && rightCompanyIdentities.length > 0) {
    return false;
  }

  return identitiesOverlap(ownerIdentityValuesFor(left.name), ownerIdentityValuesFor(right.name));
}

function canonicalClientScore(client: RespondClient, incomingName?: string, incomingCompanyName?: string) {
  const clientNameIdentities = clientIdentityValues(client.name);
  const clientCompanyIdentities = clientIdentityValues(client.companyName);
  const incomingNameIdentities = clientIdentityValues(incomingName);
  const incomingCompanyIdentities = clientIdentityValues(incomingCompanyName);
  const nameMatchesIncomingName = identitiesOverlap(clientNameIdentities, incomingNameIdentities);
  const nameMatchesIncomingCompany = identitiesOverlap(clientNameIdentities, incomingCompanyIdentities);
  const companyMatchesIncomingCompany = identitiesOverlap(clientCompanyIdentities, incomingCompanyIdentities);
  const nameAndCompanyDiffer = Boolean(client.companyName) && !identitiesOverlap(clientNameIdentities, clientCompanyIdentities);
  let score = 0;

  if (nameMatchesIncomingName) {
    score += 120;
  }

  if (companyMatchesIncomingCompany) {
    score += 90;
  }

  if (nameAndCompanyDiffer) {
    score += 70;
  }

  if (client.companyName) {
    score += 30;
  }

  if (companyNameLooksLegalEntity(client.name)) {
    score -= 25;
  }

  if (nameMatchesIncomingCompany && incomingNameIdentities.length > 0 && !nameMatchesIncomingName) {
    score -= 20;
  }

  return score;
}

function pickCanonicalClient(clients: RespondClient[], incomingName?: string, incomingCompanyName?: string) {
  return [...clients].sort(
    (left, right) => canonicalClientScore(right, incomingName, incomingCompanyName) - canonicalClientScore(left, incomingName, incomingCompanyName)
  )[0];
}

async function findExistingClientsByIdentity(environment: EnvironmentKey, product: ProductKey, name: string, companyName: string) {
  const incomingIdentities = clientIdentityValues(name, companyName);

  if (incomingIdentities.length === 0) {
    return [];
  }

  const incoming = new Set(incomingIdentities);
  const result = await getD1()
    .prepare(`SELECT ${clientSelectFields} FROM clients WHERE environment = ? AND product = ? ORDER BY created_at ASC, id ASC`)
    .bind(environment, product)
    .all<ClientRow>();

  return (result.results ?? [])
    .map(fromClientRow)
    .filter(
      (client) =>
        clientIdentityValues(client.name, client.companyName).some((identity) => incoming.has(identity)) &&
        clientMatchesIncomingIdentity(client, name, companyName)
    );
}

async function mergeDuplicateClientTasks(canonicalClientId: string, duplicateClientId: string, environment: EnvironmentKey, product: ProductKey) {
  const d1 = getD1();
  const duplicateTasks = await d1
    .prepare(`SELECT ${taskSelectFields} FROM tasks WHERE environment = ? AND product = ? AND client_id = ? ORDER BY sort_order ASC`)
    .bind(environment, product, duplicateClientId)
    .all<TaskRow>();

  for (const duplicateRow of duplicateTasks.results ?? []) {
    const templateId = duplicateRow.templateId || duplicateRow.id.split("__").at(-1) || duplicateRow.id;
    const canonicalTaskId = scopedTaskId(canonicalClientId, templateId);
    const dependencies = parseDependencies(duplicateRow.dependencies).map((dependencyId) =>
      dependencyId.replace(`${duplicateClientId}__`, `${canonicalClientId}__`)
    );
    const existingRow = await d1.prepare(`SELECT ${taskSelectFields} FROM tasks WHERE id = ?`).bind(canonicalTaskId).first<TaskRow>();

    if (!existingRow) {
      await d1
        .prepare("UPDATE tasks SET id = ?, client_id = ?, dependencies = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
        .bind(canonicalTaskId, canonicalClientId, JSON.stringify(dependencies), duplicateRow.id)
        .run();
      continue;
    }

    const updates: string[] = [];
    const values: unknown[] = [];

    if (existingRow.status === "queued" && duplicateRow.status !== "queued") {
      updates.push("status = ?");
      values.push(duplicateRow.status);
    }

    if (existingRow.assignee === "Unassigned" && duplicateRow.assignee && duplicateRow.assignee !== "Unassigned") {
      updates.push("assignee = ?");
      values.push(duplicateRow.assignee);
    }

    if (existingRow.priority === "normal" && duplicateRow.priority && duplicateRow.priority !== "normal") {
      updates.push("priority = ?");
      values.push(duplicateRow.priority);
    }

    if (!existingRow.notes && duplicateRow.notes) {
      updates.push("notes = ?");
      values.push(duplicateRow.notes);
    }

    if (!existingRow.loomUrl && duplicateRow.loomUrl) {
      updates.push("loom_url = ?");
      values.push(duplicateRow.loomUrl);
    }

    if (!existingRow.loomTitle && duplicateRow.loomTitle) {
      updates.push("loom_title = ?");
      values.push(duplicateRow.loomTitle);
    }

    if (!existingRow.portalConfigured && duplicateRow.portalConfigured) {
      updates.push("portal_visible = ?", "portal_title = ?", "portal_note = ?", "portal_action_required = ?", "portal_configured = ?");
      values.push(
        duplicateRow.portalVisible ? 1 : 0,
        duplicateRow.portalTitle ?? "",
        duplicateRow.portalNote ?? "",
        duplicateRow.portalActionRequired ? 1 : 0,
        1
      );
    }

    if (updates.length > 0) {
      updates.push("updated_at = CURRENT_TIMESTAMP");
      values.push(canonicalTaskId);
      await d1.prepare(`UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`).bind(...values).run();
    }

    await d1.prepare("DELETE FROM tasks WHERE id = ?").bind(duplicateRow.id).run();
  }
}

async function mergeDuplicateClients(canonicalClient: RespondClient, duplicateClients: RespondClient[], environment: EnvironmentKey, product: ProductKey) {
  const d1 = getD1();

  for (const duplicateClient of duplicateClients) {
    if (duplicateClient.id === canonicalClient.id) {
      continue;
    }

    await mergeDuplicateClientTasks(canonicalClient.id, duplicateClient.id, environment, product);
    await d1.prepare("DELETE FROM clients WHERE id = ?").bind(duplicateClient.id).run();
  }
}

async function reconcileDuplicateClients(environment: EnvironmentKey, product: ProductKey) {
  const result = await getD1()
    .prepare(`SELECT ${clientSelectFields} FROM clients WHERE environment = ? AND product = ? ORDER BY created_at ASC, id ASC`)
    .bind(environment, product)
    .all<ClientRow>();
  const remaining = (result.results ?? []).map(fromClientRow);

  while (remaining.length > 0) {
    const client = remaining.shift();

    if (!client) {
      continue;
    }

    const duplicates = remaining.filter((candidate) => clientsShareClientIdentity(client, candidate));

    if (duplicates.length === 0) {
      continue;
    }

    const group = [client, ...duplicates];
    const canonicalClient = pickCanonicalClient(group);
    const duplicateClients = group.filter((candidate) => candidate.id !== canonicalClient.id);
    await mergeDuplicateClients(canonicalClient, duplicateClients, environment, product);

    duplicateClients.forEach((duplicateClient) => {
      const index = remaining.findIndex((candidate) => candidate.id === duplicateClient.id);

      if (index >= 0) {
        remaining.splice(index, 1);
      }
    });
  }
}

async function updateExistingClientIdentity(client: RespondClient, payload: ClientCreatePayload) {
  const d1 = getD1();
  const updates: string[] = [];
  const values: unknown[] = [];
  const incomingName = payload.name?.trim() ?? "";
  const incomingCompanyName = payload.companyName?.trim() ?? "";
  const currentCompanyName = client.companyName ?? "";
  const existingLooksCompanyNamed =
    (Boolean(currentCompanyName) && normalizeClientIdentity(client.name) === normalizeClientIdentity(currentCompanyName)) ||
    (Boolean(incomingCompanyName) && normalizeClientIdentity(client.name) === normalizeClientIdentity(incomingCompanyName));

  if (incomingCompanyName && normalizeClientIdentity(incomingCompanyName) !== normalizeClientIdentity(currentCompanyName)) {
    updates.push("company_name = ?");
    values.push(incomingCompanyName);
  }

  if (
    incomingName &&
    existingLooksCompanyNamed &&
    normalizeClientIdentity(incomingName) !== normalizeClientIdentity(client.name) &&
    normalizeClientIdentity(incomingName) !== normalizeClientIdentity(incomingCompanyName)
  ) {
    updates.push("name = ?", "code = ?");
    values.push(incomingName, clientCode(incomingName));
  }

  if (payload.industry?.trim() && (!client.industry || client.industry === "New client")) {
    updates.push("industry = ?");
    values.push(payload.industry.trim());
  }

  if (updates.length === 0) {
    return client;
  }

  updates.push("updated_at = CURRENT_TIMESTAMP");
  values.push(client.id);
  await d1.prepare(`UPDATE clients SET ${updates.join(", ")} WHERE id = ?`).bind(...values).run();

  const row = await d1.prepare(`SELECT ${clientSelectFields} FROM clients WHERE id = ?`).bind(client.id).first<ClientRow>();
  return row ? fromClientRow(row) : client;
}

export async function createClient(payload: ClientCreatePayload) {
  await ensureTaskStorage();
  const name = payload.name?.trim();
  const companyName = payload.companyName?.trim() ?? "";
  const environment = normalizeEnvironment(payload.environment);
  const product = normalizeProduct(payload.product);

  if (!name) {
    throw new Error("Client name is required.");
  }

  const d1 = getD1();
  const existingClients = await findExistingClientsByIdentity(environment, product, name, companyName);
  const existingClient = pickCanonicalClient(existingClients, name, companyName);

  if (existingClient) {
    await mergeDuplicateClients(
      existingClient,
      existingClients.filter((client) => client.id !== existingClient.id),
      environment,
      product
    );

    const client = await updateExistingClientIdentity(existingClient, { ...payload, name, companyName });
    await seedTemplateTasksForClient(client.id, environment, product, false);
    await applyPortalDefaultsToUnconfiguredTasks(client.id, environment, product);

    return {
      client,
      tasks: await listTasks(environment, product, client.id),
      created: false,
    };
  }

  const id = await nextClientId(name, environment, product);
  const client = buildNewClient({ ...payload, name, companyName }, id, environment, product);

  await d1
    .prepare(`
      INSERT INTO clients (
        id,
        environment,
        product,
        portal_token,
        name,
        company_name,
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(...clientInsertValues(client))
    .run();

  await seedTemplateTasksForClient(client.id, environment, product, false);
  await applyPortalDefaultsToUnconfiguredTasks(client.id, environment, product);

  return {
    client,
    tasks: await listTasks(environment, product, client.id),
    created: true,
  };
}

export async function getPortalWorkspace(token: string) {
  const portalToken = token.trim();

  if (!/^[a-zA-Z0-9_-]{20,80}$/.test(portalToken)) {
    throw new Error("Portal not found.");
  }

  await ensureTaskStorage();

  const row = await getD1()
    .prepare(`SELECT ${clientSelectFields} FROM clients WHERE portal_token = ?`)
    .bind(portalToken)
    .first<ClientRow>();

  if (!row) {
    throw new Error("Portal not found.");
  }

  const client = fromClientRow(row);

  return {
    client,
    tasks: await listTasks(client.environment, client.product, client.id),
  };
}
