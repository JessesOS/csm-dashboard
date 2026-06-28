import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  environment: text("environment").notNull().default("demo"),
  product: text("product").notNull().default("respond"),
  clientId: text("client_id").notNull().default("northlane-health"),
  templateId: text("template_id").notNull().default(""),
  title: text("title").notNull(),
  category: text("category").notNull(),
  phase: text("phase").notNull(),
  status: text("status").notNull().default("queued"),
  assignee: text("assignee").notNull().default("Unassigned"),
  dueWindow: text("due_window").notNull().default(""),
  priority: text("priority").notNull().default("normal"),
  dependencies: text("dependencies").notNull().default("[]"),
  notes: text("notes").notNull().default(""),
  loomUrl: text("loom_url").notNull().default(""),
  loomTitle: text("loom_title").notNull().default(""),
  portalVisible: integer("portal_visible").notNull().default(0),
  portalTitle: text("portal_title").notNull().default(""),
  portalNote: text("portal_note").notNull().default(""),
  portalActionRequired: integer("portal_action_required").notNull().default(0),
  portalActionUrl: text("portal_action_url").notNull().default(""),
  portalActionLabel: text("portal_action_label").notNull().default(""),
  portalConfigured: integer("portal_configured").notNull().default(0),
  sortOrder: integer("sort_order").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const clients = sqliteTable("clients", {
  id: text("id").primaryKey(),
  environment: text("environment").notNull().default("demo"),
  product: text("product").notNull().default("respond"),
  scaleVariant: text("scale_variant").notNull().default("meta_google"),
  portalToken: text("portal_token").notNull().default(""),
  name: text("name").notNull(),
  companyName: text("company_name").notNull().default(""),
  code: text("code").notNull(),
  industry: text("industry").notNull().default(""),
  owner: text("owner").notNull().default("Response CSM"),
  phase: text("phase").notNull().default("Onboarding"),
  health: text("health").notNull().default("on_track"),
  progress: integer("progress").notNull().default(0),
  currentTask: text("current_task").notNull().default("Fresh onboarding template"),
  goLiveDate: text("go_live_date").notNull().default(""),
  goLiveLabel: text("go_live_label").notNull().default(""),
  lastUpdate: text("last_update").notNull().default(""),
  nextStep: text("next_step").notNull().default("Start onboarding checklist"),
  blocker: text("blocker").notNull().default("None"),
  risk: text("risk").notNull().default("low"),
  activeTasks: integer("active_tasks").notNull().default(0),
  completedTasks: integer("completed_tasks").notNull().default(0),
  timeline: text("timeline").notNull().default("[]"),
  attention: text("attention").notNull().default("[]"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const appMeta = sqliteTable("app_meta", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const portalFormSubmissions = sqliteTable("portal_form_submissions", {
  id: text("id").primaryKey(),
  environment: text("environment").notNull().default("demo"),
  product: text("product").notNull().default("respond"),
  clientId: text("client_id").notNull(),
  formId: text("form_id").notNull(),
  status: text("status").notNull().default("draft"),
  responses: text("responses").notNull().default("{}"),
  submittedAt: text("submitted_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const taskSnapshots = sqliteTable("task_snapshots", {
  id: text("id").primaryKey(),
  environment: text("environment").notNull().default("demo"),
  product: text("product").notNull().default("respond"),
  clientId: text("client_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  taskCount: integer("task_count").notNull().default(0),
  payload: text("payload").notNull().default("{}"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const taskTemplateDeletions = sqliteTable(
  "task_template_deletions",
  {
    id: text("id").primaryKey(),
    environment: text("environment").notNull().default("demo"),
    product: text("product").notNull().default("respond"),
    clientId: text("client_id").notNull(),
    templateId: text("template_id").notNull(),
    deletedAt: text("deleted_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    workspaceTemplate: uniqueIndex("task_template_deletions_workspace_template_idx").on(
      table.environment,
      table.product,
      table.clientId,
      table.templateId
    ),
  })
);

export const trainingVideos = sqliteTable("training_videos", {
  id: text("id").primaryKey(),
  product: text("product").notNull().default("respond"),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  loomUrl: text("loom_url").notNull().default(""),
  tags: text("tags").notNull().default("[]"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const trainingCategories = sqliteTable(
  "training_categories",
  {
    id: text("id").primaryKey(),
    product: text("product").notNull().default("respond"),
    category: text("category").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    productCategory: uniqueIndex("training_categories_product_category_idx").on(table.product, table.category),
  })
);
