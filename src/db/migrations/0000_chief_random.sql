CREATE TABLE `emails` (
	`id` text PRIMARY KEY NOT NULL,
	`from` text NOT NULL,
	`to` text NOT NULL,
	`key` text
);
--> statement-breakpoint
CREATE TABLE `users` (
	`email` text NOT NULL
);
