import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  phase: text("phase").notNull(),
  status: text("status").notNull().default("queued"),
  assignee: text("assignee").notNull().default("Unassigned"),
  dueWindow: text("due_window").notNull().default(""),
  priority: text("priority").notNull().default("normal"),
  dependencies: text("dependencies").notNull().default("[]"),
  notes: text("notes").notNull().default(""),
  sortOrder: integer("sort_order").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
