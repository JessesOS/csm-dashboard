CREATE TABLE `portal_form_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`environment` text DEFAULT 'demo' NOT NULL,
	`product` text DEFAULT 'respond' NOT NULL,
	`client_id` text NOT NULL,
	`form_id` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`responses` text DEFAULT '{}' NOT NULL,
	`submitted_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
