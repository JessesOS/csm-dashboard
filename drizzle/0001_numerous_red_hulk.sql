CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`industry` text DEFAULT '' NOT NULL,
	`owner` text DEFAULT 'Response CSM' NOT NULL,
	`phase` text DEFAULT 'Onboarding' NOT NULL,
	`health` text DEFAULT 'on_track' NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`current_task` text DEFAULT 'Fresh onboarding template' NOT NULL,
	`go_live_date` text DEFAULT '' NOT NULL,
	`go_live_label` text DEFAULT '' NOT NULL,
	`last_update` text DEFAULT '' NOT NULL,
	`next_step` text DEFAULT 'Start onboarding checklist' NOT NULL,
	`blocker` text DEFAULT 'None' NOT NULL,
	`risk` text DEFAULT 'low' NOT NULL,
	`active_tasks` integer DEFAULT 0 NOT NULL,
	`completed_tasks` integer DEFAULT 0 NOT NULL,
	`timeline` text DEFAULT '[]' NOT NULL,
	`attention` text DEFAULT '[]' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE `tasks` ADD `client_id` text DEFAULT 'northlane-health' NOT NULL;--> statement-breakpoint
ALTER TABLE `tasks` ADD `template_id` text DEFAULT '' NOT NULL;