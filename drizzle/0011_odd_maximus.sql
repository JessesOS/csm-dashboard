CREATE TABLE `training_videos` (
	`id` text PRIMARY KEY NOT NULL,
	`product` text DEFAULT 'respond' NOT NULL,
	`category` text NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`loom_url` text DEFAULT '' NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
