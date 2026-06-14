ALTER TABLE `clients` ADD `environment` text DEFAULT 'demo' NOT NULL;--> statement-breakpoint
ALTER TABLE `tasks` ADD `environment` text DEFAULT 'demo' NOT NULL;