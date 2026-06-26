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
CREATE INDEX `task_snapshots_workspace_idx` ON `task_snapshots` (`environment`,`product`,`client_id`);
--> statement-breakpoint
CREATE INDEX `task_snapshots_created_idx` ON `task_snapshots` (`created_at`);
--> statement-breakpoint
CREATE INDEX `task_template_deletions_workspace_idx` ON `task_template_deletions` (`environment`,`product`,`client_id`);
--> statement-breakpoint
CREATE UNIQUE INDEX `task_template_deletions_workspace_template_idx` ON `task_template_deletions` (`environment`,`product`,`client_id`,`template_id`);
