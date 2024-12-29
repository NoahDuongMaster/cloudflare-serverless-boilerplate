CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`full_name` text,
	`role` text DEFAULT 'customer' NOT NULL,
	`updated_at` text DEFAULT '2024-12-29T12:02:22.707Z' NOT NULL,
	`created_at` text DEFAULT '2024-12-29T12:02:22.709Z' NOT NULL,
	`deleted_at` text
);
