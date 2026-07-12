import { getD1 } from "../db";
import {
  isOnboardingFormTaskTitle,
  onboardingFormForId,
  onboardingFormForProduct,
  onboardingFormMissingRequired,
  sanitizeOnboardingFormResponses,
} from "./onboardingForm";
import { portalDefaultsForTask } from "./portalDefaults";
import { scaleTasksForVariant } from "./scaleTasks";
import {
  allSeedClients,
  defaultEnvironment,
  defaultProduct,
  defaultScaleVariant,
  normalizeProduct,
  normalizeScaleVariant,
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
  type PortalFormResponses,
  type PortalFormSubmission,
  type Priority,
  type ProductKey,
  type RespondClient,
  type ScaleVariant,
  type Task,
  type TaskSnapshotCollection,
  type TaskSnapshot,
  type TaskSnapshotCreatePayload,
  type TaskSnapshotDetail,
  type TaskSnapshotPointers,
  type TaskStatus,
  type TaskUpdatePayload,
  type TrainingVideo,
  type TrainingVideoCreatePayload,
} from "./types";

type TaskRow = Omit<
  Task,
  | "environment"
  | "product"
  | "dependencies"
  | "clientId"
  | "templateId"
  | "portalVisible"
  | "portalActionRequired"
  | "portalConfigured"
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
  scaleVariant: string;
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

type TemplatePointerKey = "legacySnapshotId" | "masterSnapshotId";

type PortalFormSubmissionRow = Omit<PortalFormSubmission, "environment" | "product" | "responses" | "status"> & {
  environment: string;
  product: string;
  responses: string;
  status: string;
};

type TrainingVideoRow = Omit<TrainingVideo, "product" | "tags"> & {
  product: string;
  tags: string;
};

type TrainingCategoryRow = {
  product: string;
  category: string;
  sortOrder: number;
};

type TaskSnapshotRow = Omit<TaskSnapshot, "environment" | "product"> & {
  environment: string;
  product: string;
  payload: string;
};

const defaultClientId = productConfig(defaultProduct).defaultClientId;
const currentStorageVersion = "2026-07-12-scale-consolidation-v1";
const storagePreparedMetaKey = "task_storage_prepared";
const portalDefaultBatchSize = 50;
const restoreBatchSize = 50;
const taskSelectFields =
  "id, environment, product, client_id AS clientId, template_id AS templateId, title, category, phase, status, assignee, due_window AS dueWindow, priority, dependencies, notes, loom_url AS loomUrl, loom_title AS loomTitle, portal_visible AS portalVisible, portal_title AS portalTitle, portal_note AS portalNote, portal_action_required AS portalActionRequired, portal_action_url AS portalActionUrl, portal_action_label AS portalActionLabel, portal_configured AS portalConfigured, sort_order AS sortOrder, created_at AS createdAt, updated_at AS updatedAt";
const clientSelectFields =
  "id, environment, product, scale_variant AS scaleVariant, portal_token AS portalToken, name, company_name AS companyName, code, industry, owner, phase, health, progress, current_task AS currentTask, go_live_date AS goLiveDate, go_live_label AS goLiveLabel, last_update AS lastUpdate, next_step AS nextStep, blocker, risk, active_tasks AS activeTasks, completed_tasks AS completedTasks, timeline, attention";
const portalFormSubmissionSelectFields =
  "id, environment, product, client_id AS clientId, form_id AS formId, status, responses, submitted_at AS submittedAt, updated_at AS updatedAt";
const trainingVideoSelectFields =
  "id, product, category, title, description, loom_url AS loomUrl, tags, sort_order AS sortOrder, created_at AS createdAt, updated_at AS updatedAt";
const taskSnapshotSelectFields =
  "id, environment, product, client_id AS clientId, name, description, task_count AS taskCount, payload, created_at AS createdAt";
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
const legacyTaskSnapshotName = "Legacy original build";
const masterTaskSnapshotName = "Current working master";

function taskSnapshotPointerMetaKey(environment: EnvironmentKey, product: ProductKey, clientId: string, kind: TemplatePointerKey) {
  return `task_snapshot_pointer:${environment}:${product}:${clientId}:${kind}`;
}

function productMasterSnapshotPointerMetaKey(environment: EnvironmentKey, product: ProductKey, scaleVariant?: ScaleVariant) {
  if (product === "scale" && scaleVariant) {
    return `task_snapshot_pointer:${environment}:${product}:${scaleVariant}:masterSnapshotId`;
  }

  return `task_snapshot_pointer:${environment}:${product}:masterSnapshotId`;
}

async function getMetaValue(key: string) {
  await ensureAppMetaTable(getD1());
  const row = await getD1().prepare("SELECT value FROM app_meta WHERE key = ?").bind(key).first<MetaRow>();
  return row?.value ?? "";
}

async function setMetaValue(key: string, value: string) {
  await ensureAppMetaTable(getD1());
  await getD1()
    .prepare("INSERT INTO app_meta (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP")
    .bind(key, value)
    .run();
}

async function getTaskSnapshotPointers(environment: EnvironmentKey, product: ProductKey, clientId: string): Promise<TaskSnapshotPointers> {
  const scaleVariant = product === "scale" ? await getClientScaleVariant(clientId, environment, product) : undefined;
  const [legacySnapshotId, masterSnapshotId] = await Promise.all([
    getMetaValue(taskSnapshotPointerMetaKey(environment, product, clientId, "legacySnapshotId")),
    getMetaValue(productMasterSnapshotPointerMetaKey(environment, product, scaleVariant)),
  ]);

  return {
    legacySnapshotId: legacySnapshotId || null,
    masterSnapshotId: masterSnapshotId || (product === "scale" ? await getMetaValue(productMasterSnapshotPointerMetaKey(environment, product)) : "") || null,
  };
}

async function setTaskSnapshotPointer(
  environment: EnvironmentKey,
  product: ProductKey,
  clientId: string,
  kind: TemplatePointerKey,
  snapshotId: string | null
) {
  await setMetaValue(taskSnapshotPointerMetaKey(environment, product, clientId, kind), snapshotId ?? "");
}

async function setProductMasterSnapshotPointer(
  environment: EnvironmentKey,
  product: ProductKey,
  snapshotId: string | null,
  scaleVariant?: ScaleVariant
) {
  await setMetaValue(productMasterSnapshotPointerMetaKey(environment, product, scaleVariant), snapshotId ?? "");
}

const starterTrainingVideos: TrainingVideo[] = [
  {
    id: "respond-start-here",
    product: "respond",
    category: "Start here",
    title: "Respond overview and first login",
    description: "A short orientation for new users before they begin working through the Respond system.",
    loomUrl: "",
    tags: ["overview", "login", "start"],
    sortOrder: 1,
  },
  {
    id: "respond-client-portal",
    product: "respond",
    category: "Client portal",
    title: "Using the client portal and onboarding steps",
    description: "How clients move through guided onboarding, complete forms, and find the next action.",
    loomUrl: "",
    tags: ["portal", "onboarding", "forms"],
    sortOrder: 2,
  },
  {
    id: "respond-conversations",
    product: "respond",
    category: "Daily usage",
    title: "Managing conversations, calls, and follow-up",
    description: "A practical walkthrough for reviewing conversations, call notes, and follow-up activity.",
    loomUrl: "",
    tags: ["calls", "conversations", "follow-up"],
    sortOrder: 3,
  },
  {
    id: "respond-troubleshooting",
    product: "respond",
    category: "Troubleshooting",
    title: "Fixing common Respond setup issues",
    description: "Quick answers for the common things clients get stuck on during setup and go-live.",
    loomUrl: "",
    tags: ["troubleshooting", "setup", "support"],
    sortOrder: 4,
  },
  {
    id: "scale-start-here",
    product: "scale",
    category: "Start here",
    title: "Scale overview and onboarding expectations",
    description: "A simple starting point for Scale clients before ad setup, tracking, and launch work begins.",
    loomUrl: "",
    tags: ["overview", "onboarding", "start"],
    sortOrder: 1,
  },
  {
    id: "scale-access-assets",
    product: "scale",
    category: "Access and assets",
    title: "Providing access, assets, and approvals",
    description: "How to share the items needed for Google, Meta, domains, tracking, creative, and launch approval.",
    loomUrl: "",
    tags: ["access", "assets", "approval"],
    sortOrder: 2,
  },
  {
    id: "scale-performance",
    product: "scale",
    category: "Performance review",
    title: "Reading campaign updates and next steps",
    description: "How clients should review reporting, recommendations, and follow-up actions after launch.",
    loomUrl: "",
    tags: ["reporting", "campaigns", "review"],
    sortOrder: 3,
  },
];

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

function parsePortalFormResponses(value: string | null | undefined, formId: string, product: ProductKey): PortalFormResponses {
  if (!value) {
    return {};
  }

  try {
    return sanitizeOnboardingFormResponses(JSON.parse(value), onboardingFormForId(formId, product));
  } catch {
    return {};
  }
}

function parseTags(value: string | null | undefined) {
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

function normalizeTaskCategoryName(product: ProductKey, category: string) {
  if (product !== "scale") {
    return category;
  }

  if (category === "Comms, Admin & Communication Routines") {
    return "Accounts Stage Verification";
  }

  if (category === "Pre-Onboarding & Welcome Call") {
    return "Welcome Onboarding Call";
  }

  return category;
}

function normalizeTaskTitle(task: Pick<TaskRow, "product" | "title">) {
  const product = normalizeProduct(task.product);

  if (product !== "scale") {
    return task.title;
  }

  const replacements: Record<string, string> = {
    "Have the client log into LaunchBay live while sharing their screen on the call.":
      "Have the client log into CSM live while sharing their screen on the call.",
    'Copy the "Magic Link" from the Users tab in LaunchBay and provide it to the client.':
      'Copy the "Magic Link" from the Users tab in CSM platform and provide it to the client.',
    "Instruct the client to bookmark their LaunchBay Magic Link.":
      "Instruct the client to bookmark their Magic Link.",
    "Walk the client through LaunchBay project milestones, tasks, and the messaging center.":
      "Walk the client through CSM project milestones, tasks, and the messaging center.",
  };

  return replacements[task.title] ?? task.title;
}

function fromRow(row: TaskRow): Task {
  const product = normalizeProduct(row.product);

  return {
    ...row,
    environment: normalizeEnvironment(row.environment),
    product,
    title: normalizeTaskTitle(row),
    category: normalizeTaskCategoryName(product, row.category),
    dependencies: parseDependencies(row.dependencies),
    loomUrl: row.loomUrl ?? "",
    loomTitle: row.loomTitle ?? "",
    portalVisible: Boolean(row.portalVisible),
    portalActionRequired: Boolean(row.portalActionRequired),
    portalActionUrl: row.portalActionUrl ?? "",
    portalActionLabel: row.portalActionLabel ?? "",
    portalConfigured: Boolean(row.portalConfigured),
  };
}

function fromClientRow(row: ClientRow): RespondClient {
  const phase = validClientPhases.has(row.phase) ? row.phase : "Onboarding";
  const health = validClientHealth.has(row.health) ? row.health : "on_track";
  const risk = validClientRisk.has(row.risk) ? row.risk : "low";
  const product = normalizeProduct(row.product);

  return {
    ...row,
    environment: normalizeEnvironment(row.environment),
    product,
    scaleVariant: product === "scale" ? normalizeScaleVariant(row.scaleVariant) : undefined,
    companyName: row.companyName ?? "",
    phase,
    health,
    risk,
    timeline: parseJsonArray(row.timeline, isTimelineSegment),
    attention: parseJsonArray(row.attention, isAttentionItem),
  };
}

function fromPortalFormSubmissionRow(row: PortalFormSubmissionRow): PortalFormSubmission {
  const product = normalizeProduct(row.product);

  return {
    ...row,
    environment: normalizeEnvironment(row.environment),
    product,
    status: row.status === "submitted" ? "submitted" : "draft",
    responses: parsePortalFormResponses(row.responses, row.formId, product),
  };
}

function fromTrainingVideoRow(row: TrainingVideoRow): TrainingVideo {
  return {
    ...row,
    product: normalizeProduct(row.product),
    tags: parseTags(row.tags),
    loomUrl: row.loomUrl ?? "",
  };
}

function taskSnapshotSummary(row: TaskSnapshotRow): TaskSnapshot {
  return {
    id: row.id,
    environment: normalizeEnvironment(row.environment),
    product: normalizeProduct(row.product),
    clientId: row.clientId,
    name: row.name,
    description: row.description ?? "",
    taskCount: row.taskCount,
    createdAt: row.createdAt,
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
  const scaleVariant = product === "scale" ? normalizeScaleVariant(payload.scaleVariant) : undefined;
  const templateTasks = productTasks(product, scaleVariant);
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
    scaleVariant,
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
    client.scaleVariant ?? (client.product === "scale" ? defaultScaleVariant : ""),
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
  const [
    taskColumns,
    clientColumns,
    portalFormColumns,
    trainingVideoColumns,
    trainingCategoryColumns,
    taskSnapshotColumns,
    taskTemplateDeletionColumns,
  ] = await Promise.all([
    tableColumns("tasks"),
    tableColumns("clients"),
    tableColumns("portal_form_submissions"),
    tableColumns("training_videos"),
    tableColumns("training_categories"),
    tableColumns("task_snapshots"),
    tableColumns("task_template_deletions"),
  ]);
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
    "portal_action_url",
    "portal_action_label",
    "portal_configured",
  ];
  const requiredClientColumns = ["portal_token", "environment", "product", "company_name", "scale_variant"];
  const requiredPortalFormColumns = [
    "client_id",
    "environment",
    "product",
    "form_id",
    "status",
    "responses",
    "submitted_at",
  ];
  const requiredTrainingVideoColumns = ["product", "category", "title", "description", "loom_url", "tags", "sort_order"];
  const requiredTrainingCategoryColumns = ["product", "category", "sort_order"];
  const requiredTaskSnapshotColumns = ["environment", "product", "client_id", "name", "description", "task_count", "payload"];
  const requiredTaskTemplateDeletionColumns = ["environment", "product", "client_id", "template_id"];

  if (
    !requiredTaskColumns.every((column) => taskColumns.has(column)) ||
    !requiredClientColumns.every((column) => clientColumns.has(column)) ||
    !requiredPortalFormColumns.every((column) => portalFormColumns.has(column)) ||
    !requiredTrainingVideoColumns.every((column) => trainingVideoColumns.has(column)) ||
    !requiredTrainingCategoryColumns.every((column) => trainingCategoryColumns.has(column)) ||
    !requiredTaskSnapshotColumns.every((column) => taskSnapshotColumns.has(column)) ||
    !requiredTaskTemplateDeletionColumns.every((column) => taskTemplateDeletionColumns.has(column))
  ) {
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

  if (!columns.has("portal_action_url")) {
    await d1.prepare("ALTER TABLE tasks ADD COLUMN portal_action_url TEXT NOT NULL DEFAULT ''").run();
  }

  if (!columns.has("portal_action_label")) {
    await d1.prepare("ALTER TABLE tasks ADD COLUMN portal_action_label TEXT NOT NULL DEFAULT ''").run();
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

  if (!columns.has("scale_variant")) {
    await d1.prepare(`ALTER TABLE clients ADD COLUMN scale_variant TEXT NOT NULL DEFAULT '${defaultScaleVariant}'`).run();
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
            scale_variant,
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
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
  const scaleVariant = product === "scale" ? await getClientScaleVariant(clientId, environment, product) : undefined;
  const [existing, deletedTemplates] = await Promise.all([
    d1
      .prepare("SELECT template_id AS templateId FROM tasks WHERE client_id = ? AND environment = ? AND product = ?")
      .bind(clientId, environment, product)
      .all<{ templateId: string }>(),
    deletedTemplateIdsForClient(d1, environment, product, clientId),
  ]);
  const existingTemplates = new Set((existing.results ?? []).map((item) => item.templateId));
  const missing = productTasks(product, scaleVariant).filter((item) => !existingTemplates.has(item.id) && !deletedTemplates.has(item.id));

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
            portal_action_url,
            portal_action_label,
            portal_configured,
            sort_order
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(...taskInsertValues(clientId, environment, product, item, useTemplateState))
    )
  );
}

async function getClientScaleVariant(clientId: string, environment: EnvironmentKey, product: ProductKey) {
  if (product !== "scale") {
    return undefined;
  }

  const row = await getD1()
    .prepare("SELECT scale_variant AS scaleVariant FROM clients WHERE id = ? AND environment = ? AND product = ?")
    .bind(clientId, environment, product)
    .first<{ scaleVariant: string }>();

  return normalizeScaleVariant(row?.scaleVariant);
}

async function removeTemplateTasksOutsideVariant(clientId: string, environment: EnvironmentKey, product: ProductKey, scaleVariant?: ScaleVariant) {
  if (product !== "scale") {
    return;
  }

  const d1 = getD1();
  const allowedTemplateIds = new Set(productTasks(product, scaleVariant).map((task) => task.id));
  const rows = await d1
    .prepare("SELECT id, template_id AS templateId, dependencies FROM tasks WHERE environment = ? AND product = ? AND client_id = ?")
    .bind(environment, product, clientId)
    .all<{ id: string; templateId: string; dependencies: string }>();
  const disallowedTaskIds = new Set(
    (rows.results ?? [])
      .filter((row) => row.templateId && !row.templateId.startsWith("custom-") && !allowedTemplateIds.has(row.templateId))
      .map((row) => row.id)
  );

  if (disallowedTaskIds.size === 0) {
    return;
  }

  const dependencyUpdates = (rows.results ?? [])
    .map((row) => {
      const nextDependencies = parseDependencies(row.dependencies).filter((dependencyId) => !disallowedTaskIds.has(dependencyId));
      return nextDependencies.length === parseDependencies(row.dependencies).length
        ? null
        : d1.prepare("UPDATE tasks SET dependencies = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(JSON.stringify(nextDependencies), row.id);
    })
    .filter((statement): statement is D1PreparedStatement => Boolean(statement));

  const deleteStatements = [...dependencyUpdates];
  for (const taskId of disallowedTaskIds) {
    deleteStatements.push(d1.prepare("DELETE FROM tasks WHERE id = ?").bind(taskId));
  }

  const staleTemplateDeletions = await d1
    .prepare("SELECT id, template_id AS templateId FROM task_template_deletions WHERE environment = ? AND product = ? AND client_id = ?")
    .bind(environment, product, clientId)
    .all<{ id: string; templateId: string }>();

  for (const row of staleTemplateDeletions.results ?? []) {
    if (!allowedTemplateIds.has(row.templateId)) {
      deleteStatements.push(d1.prepare("DELETE FROM task_template_deletions WHERE id = ?").bind(row.id));
    }
  }

  await d1.batch(deleteStatements);
}

async function deletedTemplateIdsForClient(d1: D1Database, environment: EnvironmentKey, product: ProductKey, clientId: string) {
  const rows = await d1
    .prepare("SELECT template_id AS templateId FROM task_template_deletions WHERE environment = ? AND product = ? AND client_id = ?")
    .bind(environment, product, clientId)
    .all<{ templateId: string }>();

  return new Set((rows.results ?? []).map((row) => row.templateId));
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
    // If template explicitly configured portal (portalConfigured: true), use its values exactly.
    // Otherwise merge with keyword-detected defaults so unconfigured tasks still get suggestions.
    item.portalConfigured ? (item.portalVisible ? 1 : 0) : (item.portalVisible ? 1 : portalDefaults.portalVisible ? 1 : 0),
    item.portalConfigured ? item.portalTitle : (item.portalTitle || portalDefaults.portalTitle),
    item.portalConfigured ? item.portalNote : (item.portalNote || portalDefaults.portalNote),
    item.portalConfigured ? (item.portalActionRequired ? 1 : 0) : (item.portalActionRequired ? 1 : portalDefaults.portalActionRequired ? 1 : 0),
    item.portalActionUrl ?? "",
    item.portalActionLabel ?? "",
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

async function seedTrainingVideos() {
  const d1 = getD1();

  await d1.batch(
    starterTrainingVideos.map((video) =>
      d1
        .prepare(`
          INSERT OR IGNORE INTO training_videos (
            id,
            product,
            category,
            title,
            description,
            loom_url,
            tags,
            sort_order
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(video.id, video.product, video.category, video.title, video.description, video.loomUrl, JSON.stringify(video.tags), video.sortOrder)
    )
  );
}

function trainingCategoryId(product: ProductKey, category: string) {
  const slug = normalizeClientIdentity(category).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "category";
  return `training-category-${product}-${slug}-${crypto.randomUUID().slice(0, 8)}`;
}

async function ensureTrainingCategory(product: ProductKey, category: string) {
  const d1 = getD1();
  const cleanCategory = cleanTrainingText(category, "General");
  const existing = await d1
    .prepare("SELECT id FROM training_categories WHERE product = ? AND category = ?")
    .bind(product, cleanCategory)
    .first<{ id: string }>();

  if (existing) {
    return;
  }

  const nextOrder = await d1
    .prepare("SELECT COALESCE(MAX(sort_order), 0) + 1 AS nextOrder FROM training_categories WHERE product = ?")
    .bind(product)
    .first<{ nextOrder: number }>();

  await d1
    .prepare(`
      INSERT OR IGNORE INTO training_categories (
        id,
        product,
        category,
        sort_order
      ) VALUES (?, ?, ?, ?)
    `)
    .bind(trainingCategoryId(product, cleanCategory), product, cleanCategory, nextOrder?.nextOrder ?? 1)
    .run();
}

async function seedTrainingCategoryOrders() {
  const rows = await getD1()
    .prepare(
      "SELECT product, category, MIN(sort_order) AS sortOrder FROM training_videos GROUP BY product, category ORDER BY product ASC, sortOrder ASC, category ASC"
    )
    .all<TrainingCategoryRow>();

  for (const row of rows.results ?? []) {
    await ensureTrainingCategory(normalizeProduct(row.product), row.category);
  }
}

async function migrateScalePortalDefaults() {
  const d1 = getD1();
  const configuredTemplateTasks = scaleTasksForVariant("meta_google").filter((t) => t.portalConfigured);

  if (configuredTemplateTasks.length === 0) {
    return;
  }

  const clients = await d1
    .prepare("SELECT id, environment FROM clients WHERE product = 'scale'")
    .all<{ id: string; environment: string }>();

  for (const client of clients.results ?? []) {
    const updates = configuredTemplateTasks.map((template) =>
      d1
        .prepare(
          "UPDATE tasks SET portal_visible = ?, portal_title = ?, portal_note = ?, portal_action_required = ?, portal_configured = 1, updated_at = CURRENT_TIMESTAMP WHERE environment = ? AND product = 'scale' AND client_id = ? AND template_id = ?"
        )
        .bind(
          template.portalVisible ? 1 : 0,
          template.portalTitle,
          template.portalNote,
          template.portalActionRequired ? 1 : 0,
          client.environment,
          client.id,
          template.id
        )
    );

    for (let i = 0; i < updates.length; i += 50) {
      await d1.batch(updates.slice(i, i + 50));
    }
  }
}

// Propagate the Scale task consolidation (many micro-steps merged into fewer milestones)
// to existing client workspaces: delete tasks whose template is gone, and refresh the
// surviving tasks' title / dependencies / order / merged-step notes from the template.
async function migrateScaleTaskConsolidation() {
  const d1 = getD1();
  const clients = await d1
    .prepare("SELECT id, environment, scale_variant AS scaleVariant FROM clients WHERE product = 'scale'")
    .all<{ id: string; environment: string; scaleVariant: string }>();

  for (const client of clients.results ?? []) {
    const environment = normalizeEnvironment(client.environment);
    const variant = normalizeScaleVariant(client.scaleVariant);

    // 1. Remove tasks whose template_id no longer exists in the consolidated template (repoints deps).
    await removeTemplateTasksOutsideVariant(client.id, environment, "scale", variant);

    // 2. Refresh surviving tasks from the template. Title / dependencies / sort order are always
    //    synced (idempotent for unchanged tasks); notes are only overwritten when the template has
    //    merged-step content, so any hand-written notes on untouched tasks are preserved.
    const templateTasks = scaleTasksForVariant(variant);
    const updates = templateTasks.map((template) =>
      template.notes && template.notes.trim()
        ? d1
            .prepare(
              "UPDATE tasks SET title = ?, notes = ?, dependencies = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE environment = ? AND product = 'scale' AND client_id = ? AND template_id = ?"
            )
            .bind(template.title, template.notes, JSON.stringify(template.dependencies), template.sortOrder, environment, client.id, template.id)
        : d1
            .prepare(
              "UPDATE tasks SET title = ?, dependencies = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE environment = ? AND product = 'scale' AND client_id = ? AND template_id = ?"
            )
            .bind(template.title, JSON.stringify(template.dependencies), template.sortOrder, environment, client.id, template.id)
    );

    for (let i = 0; i < updates.length; i += 50) {
      await d1.batch(updates.slice(i, i + 50));
    }
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
        scale_variant TEXT NOT NULL DEFAULT 'meta_google',
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
        portal_action_url TEXT NOT NULL DEFAULT '',
        portal_action_label TEXT NOT NULL DEFAULT '',
        portal_configured INTEGER NOT NULL DEFAULT 0,
        sort_order INTEGER NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `),
    d1.prepare(`
      CREATE TABLE IF NOT EXISTS portal_form_submissions (
        id TEXT PRIMARY KEY,
        environment TEXT NOT NULL DEFAULT 'demo',
        product TEXT NOT NULL DEFAULT 'respond',
        client_id TEXT NOT NULL,
        form_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        responses TEXT NOT NULL DEFAULT '{}',
        submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `),
    d1.prepare(`
      CREATE TABLE IF NOT EXISTS task_snapshots (
        id TEXT PRIMARY KEY,
        environment TEXT NOT NULL DEFAULT 'demo',
        product TEXT NOT NULL DEFAULT 'respond',
        client_id TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        task_count INTEGER NOT NULL DEFAULT 0,
        payload TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `),
    d1.prepare(`
      CREATE TABLE IF NOT EXISTS task_template_deletions (
        id TEXT PRIMARY KEY,
        environment TEXT NOT NULL DEFAULT 'demo',
        product TEXT NOT NULL DEFAULT 'respond',
        client_id TEXT NOT NULL,
        template_id TEXT NOT NULL,
        deleted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `),
    d1.prepare(`
      CREATE TABLE IF NOT EXISTS training_videos (
        id TEXT PRIMARY KEY,
        product TEXT NOT NULL DEFAULT 'respond',
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        loom_url TEXT NOT NULL DEFAULT '',
        tags TEXT NOT NULL DEFAULT '[]',
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `),
    d1.prepare(`
      CREATE TABLE IF NOT EXISTS training_categories (
        id TEXT PRIMARY KEY,
        product TEXT NOT NULL DEFAULT 'respond',
        category TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
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
    d1.prepare("CREATE INDEX IF NOT EXISTS portal_form_submissions_client_idx ON portal_form_submissions (client_id)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS portal_form_submissions_environment_product_idx ON portal_form_submissions (environment, product)"),
    d1.prepare("CREATE UNIQUE INDEX IF NOT EXISTS portal_form_submissions_client_form_idx ON portal_form_submissions (client_id, form_id)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS task_snapshots_workspace_idx ON task_snapshots (environment, product, client_id)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS task_snapshots_created_idx ON task_snapshots (created_at)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS task_template_deletions_workspace_idx ON task_template_deletions (environment, product, client_id)"),
    d1.prepare(
      "CREATE UNIQUE INDEX IF NOT EXISTS task_template_deletions_workspace_template_idx ON task_template_deletions (environment, product, client_id, template_id)"
    ),
    d1.prepare("CREATE INDEX IF NOT EXISTS training_videos_product_idx ON training_videos (product)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS training_videos_product_category_idx ON training_videos (product, category)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS training_videos_product_sort_idx ON training_videos (product, sort_order)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS training_categories_product_idx ON training_categories (product)"),
    d1.prepare("CREATE UNIQUE INDEX IF NOT EXISTS training_categories_product_category_idx ON training_categories (product, category)"),
    d1.prepare("CREATE INDEX IF NOT EXISTS training_categories_product_sort_idx ON training_categories (product, sort_order)"),
  ]);

  await migrateGlobalTasksToClient();
  await seedTaskWorkspaces();
  await migrateScaleTaskConsolidation();
  await migrateScalePortalDefaults();
  await applyPortalDefaultsToUnconfiguredTasks();
  await seedTrainingVideos();
  await seedTrainingCategoryOrders();
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
    .prepare("SELECT id, scale_variant AS scaleVariant FROM clients WHERE id = ? AND environment = ? AND product = ?")
    .bind(clientId, environment, product)
    .first<{ id: string; scaleVariant: string }>();

  if (!client) {
    throw new Error("Client not found.");
  }

  await removeTemplateTasksOutsideVariant(clientId, environment, product, normalizeScaleVariant(client.scaleVariant));
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

  const scaleVariant = await getClientScaleVariant(scopedClientId, environment, product);
  const categories = productCategories(product, scaleVariant);
  const teamMembers = productTeamMembers(product);
  const templateTasks = productTasks(product, scaleVariant);
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
        portal_action_url,
        portal_action_label,
        portal_configured,
        sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      payload.portalActionUrl?.trim() ?? "",
      payload.portalActionLabel?.trim() ?? "",
      payload.portalVisible || payload.portalTitle || payload.portalNote || payload.portalActionRequired || payload.portalActionUrl ? 1 : 0,
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
  const taskClient = await d1
    .prepare("SELECT client_id AS clientId, environment, product FROM tasks WHERE id = ?")
    .bind(id)
    .first<{ clientId: string; environment: string; product: string }>();
  const scaleVariant = taskClient ? await getClientScaleVariant(taskClient.clientId, normalizeEnvironment(taskClient.environment), product) : undefined;
  const categories = productCategories(product, scaleVariant);
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

  if (typeof payload.portalActionUrl === "string") {
    const portalActionUrl = payload.portalActionUrl.trim();
    updates.push("portal_action_url = ?");
    values.push(portalActionUrl);
    touchedPortalFields = true;

    if (portalActionUrl && typeof payload.portalVisible !== "boolean") {
      updates.push("portal_visible = ?");
      values.push(1);
    }

    if (portalActionUrl && typeof payload.portalActionRequired !== "boolean") {
      updates.push("portal_action_required = ?");
      values.push(1);
    }
  }

  if (typeof payload.portalActionLabel === "string") {
    updates.push("portal_action_label = ?");
    values.push(payload.portalActionLabel.trim());
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

export async function deleteTask(id: string) {
  await ensureTaskStorage();
  const d1 = getD1();
  const existing = await d1
    .prepare("SELECT environment, product, client_id AS clientId, template_id AS templateId FROM tasks WHERE id = ?")
    .bind(id)
    .first<{ environment: string; product: string; clientId: string; templateId: string }>();

  if (!existing) {
    throw new Error("Task not found.");
  }

  const dependentRows = await d1
    .prepare("SELECT id, dependencies FROM tasks WHERE environment = ? AND product = ? AND client_id = ? AND dependencies LIKE ?")
    .bind(existing.environment, existing.product, existing.clientId, `%${id}%`)
    .all<Pick<TaskRow, "id" | "dependencies">>();
  const dependencyUpdates = (dependentRows.results ?? [])
    .map((row) => {
      const dependencies = parseDependencies(row.dependencies);
      const nextDependencies = dependencies.filter((dependencyId) => dependencyId !== id);

      return dependencies.length === nextDependencies.length
        ? null
        : d1.prepare("UPDATE tasks SET dependencies = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(JSON.stringify(nextDependencies), row.id);
    })
    .filter((statement): statement is D1PreparedStatement => Boolean(statement));

  const deletionStatements = [...dependencyUpdates, d1.prepare("DELETE FROM tasks WHERE id = ?").bind(id)];

  if (existing.templateId && !existing.templateId.startsWith("custom-")) {
    deletionStatements.push(
      d1
        .prepare(
          `
            INSERT INTO task_template_deletions (
              id,
              environment,
              product,
              client_id,
              template_id
            ) VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(environment, product, client_id, template_id)
            DO UPDATE SET deleted_at = CURRENT_TIMESTAMP
          `
        )
        .bind(`task-template-deletion-${crypto.randomUUID().slice(0, 12)}`, existing.environment, existing.product, existing.clientId, existing.templateId)
    );
  }

  await d1.batch(deletionStatements);

  return { id };
}

function parseSnapshotTasks(payload: string): Task[] {
  try {
    const parsed = JSON.parse(payload) as { tasks?: unknown };
    return Array.isArray(parsed.tasks) ? (parsed.tasks as Task[]) : [];
  } catch {
    return [];
  }
}

async function fetchTaskSnapshotSummaries(
  environmentInput: string | null | undefined = defaultEnvironment,
  productInput: string | null | undefined = defaultProduct,
  clientIdInput?: string | null
) {
  const environment = normalizeEnvironment(environmentInput);
  const product = normalizeProduct(productInput);
  const clientId = clientIdInput && clientIdInput !== "all" ? clientIdInput : await firstClientId(environment, product);

  if (!clientId) {
    return {
      snapshots: [] as TaskSnapshot[],
      templatePointers: { legacySnapshotId: null, masterSnapshotId: null } satisfies TaskSnapshotPointers,
    };
  }

  const rows = await getD1()
    .prepare(`SELECT ${taskSnapshotSelectFields} FROM task_snapshots WHERE environment = ? AND product = ? AND client_id = ? ORDER BY created_at DESC`)
    .bind(environment, product, clientId)
    .all<TaskSnapshotRow>();

  const templatePointers = await getTaskSnapshotPointers(environment, product, clientId);
  const currentSnapshots = (rows.results ?? []).map(taskSnapshotSummary);
  const snapshots = [...currentSnapshots];

  if (templatePointers.masterSnapshotId && !snapshots.some((snapshot) => snapshot.id === templatePointers.masterSnapshotId)) {
    const masterRow = await getD1()
      .prepare(`SELECT ${taskSnapshotSelectFields} FROM task_snapshots WHERE id = ?`)
      .bind(templatePointers.masterSnapshotId)
      .first<TaskSnapshotRow>();

    if (masterRow) {
      snapshots.unshift(taskSnapshotSummary(masterRow));
    }
  }

  return {
    snapshots,
    templatePointers,
  };
}

async function ensureLegacyTaskSnapshot(
  environmentInput: string | null | undefined = defaultEnvironment,
  productInput: string | null | undefined = defaultProduct,
  clientIdInput?: string | null
) {
  const environment = normalizeEnvironment(environmentInput);
  const product = normalizeProduct(productInput);
  const clientId = clientIdInput && clientIdInput !== "all" ? clientIdInput : await firstClientId(environment, product);

  if (!clientId) {
    return null;
  }

  await requireClient(environment, product, clientId);

  const pointers = await getTaskSnapshotPointers(environment, product, clientId);
  if (pointers.legacySnapshotId) {
    const existing = await getD1()
      .prepare(`SELECT ${taskSnapshotSelectFields} FROM task_snapshots WHERE id = ?`)
      .bind(pointers.legacySnapshotId)
      .first<TaskSnapshotRow>();

    if (existing) {
      return taskSnapshotSummary(existing);
    }
  }

  const existingSnapshots = await getD1()
    .prepare(`SELECT ${taskSnapshotSelectFields} FROM task_snapshots WHERE environment = ? AND product = ? AND client_id = ? ORDER BY created_at ASC`)
    .bind(environment, product, clientId)
    .all<TaskSnapshotRow>();
  const orderedSnapshots = (existingSnapshots.results ?? []).map(taskSnapshotSummary);

  if (orderedSnapshots.length > 0) {
    const legacySnapshot = orderedSnapshots[0];
    await setTaskSnapshotPointer(environment, product, clientId, "legacySnapshotId", legacySnapshot.id);
    return legacySnapshot;
  }

  const snapshot = await createTaskSnapshot({
    environment,
    product,
    clientId,
    name: legacyTaskSnapshotName,
    description: "Archived original build captured before template editing.",
    kind: "backup",
  });

  await setTaskSnapshotPointer(environment, product, clientId, "legacySnapshotId", snapshot.id);
  return snapshot;
}

async function getTaskSnapshotRow(id: string) {
  await ensureTaskStorage();
  const row = await getD1().prepare(`SELECT ${taskSnapshotSelectFields} FROM task_snapshots WHERE id = ?`).bind(id).first<TaskSnapshotRow>();

  if (!row) {
    throw new Error("Task backup not found.");
  }

  return row;
}

export async function listTaskSnapshots(
  environmentInput: string | null | undefined = defaultEnvironment,
  productInput: string | null | undefined = defaultProduct,
  clientIdInput?: string | null
) {
  await ensureTaskStorage();
  const environment = normalizeEnvironment(environmentInput);
  const product = normalizeProduct(productInput);
  const clientId = clientIdInput && clientIdInput !== "all" ? clientIdInput : await firstClientId(environment, product);

  if (!clientId) {
    return {
      snapshots: [],
      templatePointers: { legacySnapshotId: null, masterSnapshotId: null },
    } satisfies TaskSnapshotCollection;
  }

  await requireClient(environment, product, clientId);

  await ensureLegacyTaskSnapshot(environment, product, clientId);
  return fetchTaskSnapshotSummaries(environment, product, clientId);
}

export async function getTaskSnapshot(id: string): Promise<TaskSnapshotDetail> {
  const row = await getTaskSnapshotRow(id);

  return {
    ...taskSnapshotSummary(row),
    tasks: parseSnapshotTasks(row.payload),
  };
}

export async function createTaskSnapshot(payload: TaskSnapshotCreatePayload) {
  await ensureTaskStorage();
  const environment = normalizeEnvironment(payload.environment);
  const product = normalizeProduct(payload.product);
  const clientId = payload.clientId && payload.clientId !== "all" ? payload.clientId : await firstClientId(environment, product);

  if (!clientId) {
    throw new Error("Choose a client before creating a backup.");
  }

  await requireClient(environment, product, clientId);

  const tasks = await listTasks(environment, product, clientId);
  const scaleVariant = product === "scale" ? await getClientScaleVariant(clientId, environment, product) : undefined;
  const name = (payload.name?.trim() || `Backup ${new Date().toISOString().slice(0, 10)}`).slice(0, 120);
  const description = (payload.description?.trim() ?? "").slice(0, 240);
  const snapshotId = `task-snapshot-${crypto.randomUUID().slice(0, 12)}`;
  const snapshotPayload = JSON.stringify({
    version: 1,
    environment,
    product,
    clientId,
    createdAt: new Date().toISOString(),
    tasks,
  });

  await getD1()
    .prepare(
      `
        INSERT INTO task_snapshots (
          id,
          environment,
          product,
          client_id,
          name,
          description,
          task_count,
          payload
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
    .bind(snapshotId, environment, product, clientId, name, description, tasks.length, snapshotPayload)
    .run();

  if (payload.kind === "master") {
    await setProductMasterSnapshotPointer(environment, product, snapshotId, scaleVariant);
  }

  return getTaskSnapshot(snapshotId);
}

function taskRestoreValues(task: Task, environment: EnvironmentKey, product: ProductKey, clientId: string) {
  const status = validStatuses.has(task.status) ? task.status : "queued";
  const priority = validPriorities.has(task.priority) ? task.priority : "normal";

  return [
    task.id,
    environment,
    product,
    clientId,
    task.templateId ?? "",
    task.title,
    task.category,
    task.phase,
    status,
    task.assignee,
    task.dueWindow,
    priority,
    JSON.stringify(task.dependencies ?? []),
    task.notes,
    task.loomUrl ?? "",
    task.loomTitle ?? "",
    task.portalVisible ? 1 : 0,
    task.portalTitle,
    task.portalNote,
    task.portalActionRequired ? 1 : 0,
    task.portalActionUrl ?? "",
    task.portalActionLabel ?? "",
    task.portalConfigured ? 1 : 0,
    task.sortOrder,
    task.createdAt ?? new Date().toISOString(),
    new Date().toISOString(),
  ];
}

function taskRestoreStatement(d1: D1Database, task: Task, environment: EnvironmentKey, product: ProductKey, clientId: string) {
  return d1
    .prepare(
      `
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
          portal_action_url,
          portal_action_label,
          portal_configured,
          sort_order,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
    )
    .bind(...taskRestoreValues(task, environment, product, clientId));
}

async function syncTemplateDeletionMarkersForTasks(d1: D1Database, environment: EnvironmentKey, product: ProductKey, clientId: string, tasks: Task[]) {
  const scaleVariant = await getClientScaleVariant(clientId, environment, product);
  const defaultTemplateIds = new Set(productTasks(product, scaleVariant).map((task) => task.id));
  const restoredTemplateIds = new Set(
    tasks
      .map((task) => task.templateId ?? "")
      .filter((templateId) => templateId && defaultTemplateIds.has(templateId))
  );
  const missingTemplateIds = [...defaultTemplateIds].filter((templateId) => !restoredTemplateIds.has(templateId));

  await d1
    .prepare("DELETE FROM task_template_deletions WHERE environment = ? AND product = ? AND client_id = ?")
    .bind(environment, product, clientId)
    .run();

  for (let index = 0; index < missingTemplateIds.length; index += restoreBatchSize) {
    const chunk = missingTemplateIds.slice(index, index + restoreBatchSize);

    if (chunk.length === 0) {
      continue;
    }

    await d1.batch(
      chunk.map((templateId) =>
        d1
          .prepare(
            `
              INSERT OR IGNORE INTO task_template_deletions (
                id,
                environment,
                product,
                client_id,
                template_id
              ) VALUES (?, ?, ?, ?, ?)
            `
          )
          .bind(`task-template-deletion-${crypto.randomUUID().slice(0, 12)}`, environment, product, clientId, templateId)
      )
    );
  }
}

export async function restoreTaskSnapshot(id: string) {
  const snapshot = await getTaskSnapshot(id);
  const d1 = getD1();

  await requireClient(snapshot.environment, snapshot.product, snapshot.clientId);

  const tasks = [...snapshot.tasks]
    .map((task) => ({
      ...task,
      environment: snapshot.environment,
      product: snapshot.product,
      clientId: snapshot.clientId,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  await d1
    .prepare("DELETE FROM tasks WHERE environment = ? AND product = ? AND client_id = ?")
    .bind(snapshot.environment, snapshot.product, snapshot.clientId)
    .run();

  for (let index = 0; index < tasks.length; index += restoreBatchSize) {
    const chunk = tasks.slice(index, index + restoreBatchSize);

    if (chunk.length === 0) {
      continue;
    }

    await d1.batch(chunk.map((task) => taskRestoreStatement(d1, task, snapshot.environment, snapshot.product, snapshot.clientId)));
  }

  await removeTemplateTasksOutsideVariant(snapshot.clientId, snapshot.environment, snapshot.product, await getClientScaleVariant(snapshot.clientId, snapshot.environment, snapshot.product));
  await syncTemplateDeletionMarkersForTasks(d1, snapshot.environment, snapshot.product, snapshot.clientId, tasks);

  return {
    snapshot: taskSnapshotSummary({
      ...snapshot,
      payload: JSON.stringify({ tasks }),
    }),
    tasks: await listTasks(snapshot.environment, snapshot.product, snapshot.clientId),
  };
}

function cloneSnapshotTasksForClient(
  tasks: Task[],
  targetClientId: string,
  targetEnvironment: EnvironmentKey,
  targetProduct: ProductKey,
  options?: { resetWorkflowState?: boolean; existingTasksByTemplateId?: Map<string, Task> }
) {
  const idMap = new Map<string, string>();

  for (const task of tasks) {
    const templateId = task.templateId || task.id.split("__").pop() || task.id;
    idMap.set(task.id, scopedTaskId(targetClientId, templateId));
  }

  return tasks.map((task) => {
    const templateId = task.templateId || task.id.split("__").pop() || task.id;
    const nextId = idMap.get(task.id) ?? scopedTaskId(targetClientId, templateId);
    const nextDependencies = (task.dependencies ?? []).map((dependencyId) => idMap.get(dependencyId) ?? unscopedDependencyId(targetClientId, dependencyId));
    const existingTask = options?.existingTasksByTemplateId?.get(templateId);

    return {
      ...task,
      id: nextId,
      environment: targetEnvironment,
      product: targetProduct,
      clientId: targetClientId,
      templateId,
      status: options?.resetWorkflowState ? "queued" : task.status,
      dependencies: nextDependencies,
      portalVisible: existingTask?.portalVisible ?? task.portalVisible,
      portalTitle: existingTask?.portalTitle ?? task.portalTitle,
      portalNote: existingTask?.portalNote ?? task.portalNote,
      portalActionRequired: existingTask?.portalActionRequired ?? task.portalActionRequired,
      portalActionUrl: existingTask?.portalActionUrl ?? task.portalActionUrl,
      portalActionLabel: existingTask?.portalActionLabel ?? task.portalActionLabel,
      portalConfigured: existingTask?.portalConfigured ?? task.portalConfigured,
    };
  });
}

export async function restoreTaskSnapshotToClient(
  id: string,
  targetClientIdInput: string,
  environmentInput: string | null | undefined = defaultEnvironment,
  productInput: string | null | undefined = defaultProduct,
  options?: { resetWorkflowState?: boolean }
) {
  const snapshot = await getTaskSnapshot(id);
  const d1 = getD1();
  const targetEnvironment = normalizeEnvironment(environmentInput);
  const targetProduct = normalizeProduct(productInput);
  const targetClientId = await requireClient(targetEnvironment, targetProduct, targetClientIdInput);
  const existingTargetTasks = options?.resetWorkflowState ? await listTasks(targetEnvironment, targetProduct, targetClientId) : [];
  const existingTasksByTemplateId = new Map(existingTargetTasks.map((task) => [task.templateId || task.id, task]));

  const tasks = cloneSnapshotTasksForClient(
    [...snapshot.tasks].sort((a, b) => a.sortOrder - b.sortOrder),
    targetClientId,
    targetEnvironment,
    targetProduct,
    {
      ...options,
      existingTasksByTemplateId,
    }
  );

  await d1
    .prepare("DELETE FROM tasks WHERE environment = ? AND product = ? AND client_id = ?")
    .bind(targetEnvironment, targetProduct, targetClientId)
    .run();

  for (let index = 0; index < tasks.length; index += restoreBatchSize) {
    const chunk = tasks.slice(index, index + restoreBatchSize);

    if (chunk.length === 0) {
      continue;
    }

    await d1.batch(chunk.map((task) => taskRestoreStatement(d1, task, targetEnvironment, targetProduct, targetClientId)));
  }

  await removeTemplateTasksOutsideVariant(
    targetClientId,
    targetEnvironment,
    targetProduct,
    await getClientScaleVariant(targetClientId, targetEnvironment, targetProduct)
  );
  await syncTemplateDeletionMarkersForTasks(d1, targetEnvironment, targetProduct, targetClientId, tasks);

  return {
    snapshot: taskSnapshotSummary({
      ...snapshot,
      product: targetProduct,
      environment: targetEnvironment,
      clientId: targetClientId,
      payload: JSON.stringify({ tasks }),
    }),
    tasks: await listTasks(targetEnvironment, targetProduct, targetClientId),
  };
}

function cleanTrainingText(value: string | null | undefined, fallback = "") {
  return (value ?? fallback).replace(/\s+/g, " ").trim().slice(0, 240);
}

function cleanTrainingDescription(value: string | null | undefined) {
  return (value ?? "").replace(/\r\n/g, "\n").trim().slice(0, 900);
}

function cleanTrainingLoomUrl(value: string | null | undefined) {
  const clean = (value ?? "").trim();
  return !clean || /^https:\/\/(www\.)?loom\.com\/(share|embed)\//i.test(clean) ? clean.slice(0, 420) : "";
}

function cleanTrainingTags(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.replace(/\s+/g, " ").trim().toLowerCase())
        .filter(Boolean)
    )
  ).slice(0, 10);
}

export async function listTrainingVideos(productInput: string | null | undefined = defaultProduct) {
  await ensureTaskStorage();
  const product = normalizeProduct(productInput);
  await seedTrainingCategoryOrders();
  const result = await getD1()
    .prepare(`
      SELECT
        training_videos.id AS id,
        training_videos.product AS product,
        training_videos.category AS category,
        training_videos.title AS title,
        training_videos.description AS description,
        training_videos.loom_url AS loomUrl,
        training_videos.tags AS tags,
        training_videos.sort_order AS sortOrder,
        training_videos.created_at AS createdAt,
        training_videos.updated_at AS updatedAt
      FROM training_videos
      LEFT JOIN training_categories
        ON training_categories.product = training_videos.product
        AND training_categories.category = training_videos.category
      WHERE training_videos.product = ?
      ORDER BY COALESCE(training_categories.sort_order, training_videos.sort_order) ASC, training_videos.sort_order ASC, training_videos.title ASC
    `)
    .bind(product)
    .all<TrainingVideoRow>();

  return (result.results ?? []).map(fromTrainingVideoRow);
}

export async function createTrainingVideo(productInput: string | null | undefined, payload: TrainingVideoCreatePayload) {
  await ensureTaskStorage();
  const d1 = getD1();
  const product = normalizeProduct(productInput ?? payload.product);
  const title = cleanTrainingText(payload.title);
  const category = cleanTrainingText(payload.category, "General");

  if (!title) {
    throw new Error("Training title is required.");
  }

  await ensureTrainingCategory(product, category);

  const nextOrder = await d1
    .prepare("SELECT COALESCE(MAX(sort_order), 0) + 1 AS nextOrder FROM training_videos WHERE product = ?")
    .bind(product)
    .first<{ nextOrder: number }>();
  const id = `training-${product}-${crypto.randomUUID().slice(0, 10)}`;

  await d1
    .prepare(`
      INSERT INTO training_videos (
        id,
        product,
        category,
        title,
        description,
        loom_url,
        tags,
        sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      id,
      product,
      category,
      title,
      cleanTrainingDescription(payload.description),
      cleanTrainingLoomUrl(payload.loomUrl),
      JSON.stringify(cleanTrainingTags(payload.tags)),
      nextOrder?.nextOrder ?? 1
    )
    .run();

  const video = await d1.prepare(`SELECT ${trainingVideoSelectFields} FROM training_videos WHERE id = ?`).bind(id).first<TrainingVideoRow>();

  if (!video) {
    throw new Error("Training video was created, but could not be loaded.");
  }

  return fromTrainingVideoRow(video);
}

export async function deleteTrainingVideo(id: string) {
  await ensureTaskStorage();
  const result = await getD1().prepare("DELETE FROM training_videos WHERE id = ?").bind(id).run();

  if (!result.meta?.changes) {
    throw new Error("Training video not found.");
  }

  return { id };
}

function cleanTrainingCategories(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => cleanTrainingText(item))
        .filter(Boolean)
    )
  ).slice(0, 50);
}

export async function reorderTrainingCategories(productInput: string | null | undefined, categoryInput: unknown) {
  await ensureTaskStorage();
  const d1 = getD1();
  const product = normalizeProduct(productInput);
  await seedTrainingCategoryOrders();

  const requestedCategories = cleanTrainingCategories(categoryInput);
  const categoryRows = await d1
    .prepare(`
      SELECT
        training_videos.category AS category,
        MIN(training_videos.sort_order) AS sortOrder
      FROM training_videos
      WHERE training_videos.product = ?
      GROUP BY training_videos.category
      ORDER BY sortOrder ASC, category ASC
    `)
    .bind(product)
    .all<{ category: string; sortOrder: number }>();
  const existingCategories = (categoryRows.results ?? []).map((row) => row.category);
  const existingSet = new Set(existingCategories);
  const nextCategories = [
    ...requestedCategories.filter((category) => existingSet.has(category)),
    ...existingCategories.filter((category) => !requestedCategories.includes(category)),
  ];

  if (nextCategories.length === 0) {
    throw new Error("No training categories found.");
  }

  await d1.batch(
    nextCategories.map((category, index) =>
      d1
        .prepare(`
          INSERT INTO training_categories (
            id,
            product,
            category,
            sort_order,
            updated_at
          ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(product, category) DO UPDATE SET
            sort_order = excluded.sort_order,
            updated_at = CURRENT_TIMESTAMP
        `)
        .bind(trainingCategoryId(product, category), product, category, index + 1)
    )
  );

  return listTrainingVideos(product);
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

    const willCopyPortalConfiguration = !existingRow.portalConfigured && duplicateRow.portalConfigured;

    if (!willCopyPortalConfiguration && !existingRow.portalActionUrl && duplicateRow.portalActionUrl) {
      updates.push("portal_action_url = ?");
      values.push(duplicateRow.portalActionUrl);
    }

    if (!willCopyPortalConfiguration && !existingRow.portalActionLabel && duplicateRow.portalActionLabel) {
      updates.push("portal_action_label = ?");
      values.push(duplicateRow.portalActionLabel);
    }

    if (willCopyPortalConfiguration) {
      updates.push(
        "portal_visible = ?",
        "portal_title = ?",
        "portal_note = ?",
        "portal_action_required = ?",
        "portal_action_url = ?",
        "portal_action_label = ?",
        "portal_configured = ?"
      );
      values.push(
        duplicateRow.portalVisible ? 1 : 0,
        duplicateRow.portalTitle ?? "",
        duplicateRow.portalNote ?? "",
        duplicateRow.portalActionRequired ? 1 : 0,
        duplicateRow.portalActionUrl ?? "",
        duplicateRow.portalActionLabel ?? "",
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
  const nextScaleVariant = client.product === "scale" ? normalizeScaleVariant(payload.scaleVariant ?? client.scaleVariant) : undefined;
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

  if (client.product === "scale" && nextScaleVariant && nextScaleVariant !== client.scaleVariant) {
    updates.push("scale_variant = ?");
    values.push(nextScaleVariant);
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
        scale_variant,
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

export async function deleteClient(
  clientId: string,
  environmentInput: string | null | undefined = defaultEnvironment,
  productInput: string | null | undefined = defaultProduct
) {
  await ensureTaskStorage();
  const environment = normalizeEnvironment(environmentInput);
  const product = normalizeProduct(productInput);
  const d1 = getD1();
  const client = await d1
    .prepare(`SELECT ${clientSelectFields} FROM clients WHERE id = ? AND environment = ? AND product = ?`)
    .bind(clientId, environment, product)
    .first<ClientRow>();

  if (!client) {
    throw new Error("Client not found.");
  }

  const metaKeys = [
    taskSnapshotPointerMetaKey(environment, product, clientId, "legacySnapshotId"),
    taskSnapshotPointerMetaKey(environment, product, clientId, "masterSnapshotId"),
  ];
  const clientScaleVariant = product === "scale" ? normalizeScaleVariant(client.scaleVariant) : undefined;
  const productMasterPointerKey = productMasterSnapshotPointerMetaKey(environment, product, clientScaleVariant);
  const legacyProductMasterPointerKey = productMasterSnapshotPointerMetaKey(environment, product);
  const productMasterSnapshotId = await getMetaValue(productMasterPointerKey);

  if (productMasterSnapshotId) {
    const productMasterRow = await d1
      .prepare("SELECT client_id AS clientId FROM task_snapshots WHERE id = ?")
      .bind(productMasterSnapshotId)
      .first<{ clientId: string }>();

    if (productMasterRow?.clientId === clientId) {
      metaKeys.push(productMasterPointerKey);
    }
  }

  if (product === "scale") {
    const legacyProductMasterSnapshotId = await getMetaValue(legacyProductMasterPointerKey);

    if (legacyProductMasterSnapshotId) {
      const legacyProductMasterRow = await d1
        .prepare("SELECT client_id AS clientId FROM task_snapshots WHERE id = ?")
        .bind(legacyProductMasterSnapshotId)
        .first<{ clientId: string }>();

      if (legacyProductMasterRow?.clientId === clientId) {
        metaKeys.push(legacyProductMasterPointerKey);
      }
    }
  }

  await d1.batch([
    d1.prepare("DELETE FROM tasks WHERE client_id = ? AND environment = ? AND product = ?").bind(clientId, environment, product),
    d1.prepare("DELETE FROM portal_form_submissions WHERE client_id = ? AND environment = ? AND product = ?").bind(clientId, environment, product),
    d1.prepare("DELETE FROM task_snapshots WHERE client_id = ? AND environment = ? AND product = ?").bind(clientId, environment, product),
    d1.prepare("DELETE FROM task_template_deletions WHERE client_id = ? AND environment = ? AND product = ?").bind(clientId, environment, product),
    d1.prepare(`DELETE FROM app_meta WHERE key IN (${metaKeys.map(() => "?").join(", ")})`).bind(...metaKeys),
    d1.prepare("DELETE FROM clients WHERE id = ? AND environment = ? AND product = ?").bind(clientId, environment, product),
  ]);

  return { clientId, deleted: true };
}

function normalizePortalToken(token: string) {
  const portalToken = token.trim();

  if (!/^[a-zA-Z0-9_-]{20,80}$/.test(portalToken)) {
    throw new Error("Portal not found.");
  }

  return portalToken;
}

async function getClientByPortalToken(token: string) {
  const portalToken = normalizePortalToken(token);

  await ensureTaskStorage();

  const row = await getD1()
    .prepare(`SELECT ${clientSelectFields} FROM clients WHERE portal_token = ?`)
    .bind(portalToken)
    .first<ClientRow>();

  if (!row) {
    throw new Error("Portal not found.");
  }

  return fromClientRow(row);
}

async function getPortalFormSubmissionForClient(client: RespondClient) {
  await ensureTaskStorage();

  const form = onboardingFormForProduct(client.product);
  const formIds = [form.id, ...(form.legacyIds ?? [])];
  const placeholders = formIds.map(() => "?").join(", ");
  const row = await getD1()
    .prepare(
      `SELECT ${portalFormSubmissionSelectFields} FROM portal_form_submissions WHERE client_id = ? AND form_id IN (${placeholders}) ORDER BY updated_at DESC LIMIT 1`
    )
    .bind(client.id, ...formIds)
    .first<PortalFormSubmissionRow>();

  return row ? fromPortalFormSubmissionRow(row) : null;
}

async function markOnboardingFormTaskInReview(client: RespondClient) {
  const d1 = getD1();
  const result = await d1
    .prepare(
      "SELECT id, title, portal_title AS portalTitle, status, notes FROM tasks WHERE environment = ? AND product = ? AND client_id = ? AND portal_visible = 1 ORDER BY sort_order ASC"
    )
    .bind(client.environment, client.product, client.id)
    .all<Pick<TaskRow, "id" | "title" | "portalTitle" | "status" | "notes">>();
  const task = (result.results ?? []).find((item) => isOnboardingFormTaskTitle(item.portalTitle) || isOnboardingFormTaskTitle(item.title));

  if (!task || task.status === "complete") {
    return;
  }

  const submittedNote = `Client submitted the native onboarding form via portal on ${new Date().toISOString().slice(0, 10)}.`;
  const nextNotes = task.notes?.includes(submittedNote) ? task.notes : [task.notes, submittedNote].filter(Boolean).join("\n");

  await d1
    .prepare("UPDATE tasks SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind("review", nextNotes, task.id)
    .run();
}

export async function getPortalOnboardingFormSubmission(token: string) {
  const client = await getClientByPortalToken(token);
  return getPortalFormSubmissionForClient(client);
}

export async function savePortalOnboardingFormSubmission(token: string, responsesInput: unknown) {
  const client = await getClientByPortalToken(token);
  const form = onboardingFormForProduct(client.product);
  const responses = sanitizeOnboardingFormResponses(responsesInput, form);
  const missingRequired = onboardingFormMissingRequired(responses, form);

  if (missingRequired.length > 0) {
    throw new Error(`Please complete: ${missingRequired.join(", ")}.`);
  }

  const id = `${client.id}__${form.id}`;
  const d1 = getD1();

  await d1
    .prepare(
      `
        INSERT INTO portal_form_submissions (
          id,
          environment,
          product,
          client_id,
          form_id,
          status,
          responses,
          submitted_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, 'submitted', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          status = 'submitted',
          responses = excluded.responses,
          updated_at = CURRENT_TIMESTAMP
      `
    )
    .bind(id, client.environment, client.product, client.id, form.id, JSON.stringify(responses))
    .run();

  await markOnboardingFormTaskInReview(client);

  const submission = await getPortalFormSubmissionForClient(client);

  if (!submission) {
    throw new Error("The onboarding form was submitted, but the saved response could not be reloaded.");
  }

  return submission;
}

export async function getPortalWorkspace(token: string) {
  const client = await getClientByPortalToken(token);

  return {
    client,
    tasks: await listTasks(client.environment, client.product, client.id),
    formDefinition: onboardingFormForProduct(client.product),
    formSubmission: await getPortalFormSubmissionForClient(client),
  };
}

export async function listPortalTasks(token: string) {
  const client = await getClientByPortalToken(token);

  await ensureTaskStorage();

  const result = await getD1()
    .prepare(
      `SELECT ${taskSelectFields} FROM tasks WHERE environment = ? AND product = ? AND client_id = ? AND portal_visible = 1 ORDER BY sort_order ASC`
    )
    .bind(client.environment, client.product, client.id)
    .all<TaskRow>();

  return {
    clientId: client.id,
    clientName: client.name,
    tasks: (result.results ?? []).map(fromRow),
  };
}
