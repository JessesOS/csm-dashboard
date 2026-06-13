CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`phase` text NOT NULL,
	`status` text DEFAULT 'queued' NOT NULL,
	`assignee` text DEFAULT 'Unassigned' NOT NULL,
	`due_window` text DEFAULT '' NOT NULL,
	`priority` text DEFAULT 'normal' NOT NULL,
	`dependencies` text DEFAULT '[]' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`sort_order` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
