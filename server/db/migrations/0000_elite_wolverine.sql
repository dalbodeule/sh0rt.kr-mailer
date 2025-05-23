CREATE TABLE `emails` (
	`id` text PRIMARY KEY NOT NULL,
	`from` text NOT NULL,
	`to` text NOT NULL,
	`key` text
);
--> statement-breakpoint
CREATE TABLE `fido_devices` (
	`id` text,
	`userId` integer,
	`credential_id` text,
	`public_key` text,
	`counter` text,
	`challenge` text,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`email` text NOT NULL
);
