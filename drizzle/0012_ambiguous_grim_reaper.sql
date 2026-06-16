CREATE TABLE `training_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`product` text DEFAULT 'respond' NOT NULL,
	`category` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `training_categories_product_category_idx` ON `training_categories` (`product`,`category`);