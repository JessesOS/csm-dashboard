ALTER TABLE `clients` ADD `company_name` text DEFAULT '' NOT NULL;
--> statement-breakpoint
UPDATE `clients`
SET
  `name` = 'Bruce Chaplin',
  `company_name` = 'BC TD Management PTY LTD',
  `code` = 'BC',
  `industry` = CASE WHEN `industry` = '' THEN 'GHL Active Client' ELSE `industry` END,
  `updated_at` = CURRENT_TIMESTAMP
WHERE `id` = 'live-bruce-chaplin';
--> statement-breakpoint
UPDATE `clients`
SET
  `company_name` = 'BC TD Management PTY LTD',
  `updated_at` = CURRENT_TIMESTAMP
WHERE `environment` = 'live'
  AND `product` = 'respond'
  AND lower(`name`) = 'bruce chaplin'
  AND `company_name` = '';
--> statement-breakpoint
UPDATE `tasks`
SET
  `client_id` = 'live-bruce-chaplin',
  `id` = 'live-bruce-chaplin__' || `template_id`,
  `dependencies` = replace(`dependencies`, `client_id` || '__', 'live-bruce-chaplin__'),
  `updated_at` = CURRENT_TIMESTAMP
WHERE `client_id` IN (
  SELECT `id`
  FROM `clients`
  WHERE `environment` = 'live'
    AND `product` = 'respond'
    AND lower(`name`) = 'bc td management pty ltd'
)
  AND `template_id` LIKE 'custom-%'
  AND NOT EXISTS (
    SELECT 1
    FROM `tasks` AS `existing`
    WHERE `existing`.`id` = 'live-bruce-chaplin__' || `tasks`.`template_id`
  );
--> statement-breakpoint
DELETE FROM `tasks`
WHERE `client_id` IN (
  SELECT `id`
  FROM `clients`
  WHERE `environment` = 'live'
    AND `product` = 'respond'
    AND lower(`name`) = 'bc td management pty ltd'
);
--> statement-breakpoint
DELETE FROM `clients`
WHERE `environment` = 'live'
  AND `product` = 'respond'
  AND lower(`name`) = 'bc td management pty ltd';
