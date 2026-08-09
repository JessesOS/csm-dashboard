CREATE TABLE `task_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`task_id` text NOT NULL,
	`client_id` text DEFAULT '' NOT NULL,
	`from_status` text DEFAULT '' NOT NULL,
	`to_status` text DEFAULT '' NOT NULL,
	`actor` text DEFAULT 'team' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `task_snapshots` (
	`id` text PRIMARY KEY NOT NULL,
	`environment` text DEFAULT 'demo' NOT NULL,
	`product` text DEFAULT 'respond' NOT NULL,
	`client_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`task_count` integer DEFAULT 0 NOT NULL,
	`payload` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `task_template_deletions` (
	`id` text PRIMARY KEY NOT NULL,
	`environment` text DEFAULT 'demo' NOT NULL,
	`product` text DEFAULT 'respond' NOT NULL,
	`client_id` text NOT NULL,
	`template_id` text NOT NULL,
	`deleted_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `task_template_deletions_workspace_template_idx` ON `task_template_deletions` (`environment`,`product`,`client_id`,`template_id`);--> statement-breakpoint
ALTER TABLE `clients` ADD `scale_variant` text DEFAULT 'meta_google' NOT NULL;--> statement-breakpoint
ALTER TABLE `tasks` ADD `team_visible` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `tasks` ADD `rolls_up_to` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `tasks` ADD `status_changed_at` text DEFAULT '' NOT NULL;