PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_fido_devices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`credential_id` text,
	`public_key` text,
	`counter` integer,
	`transports` text,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_fido_devices`("id", "userId", "credential_id", "public_key", "counter", "transports") SELECT "id", "userId", "credential_id", "public_key", "counter", "transports" FROM `fido_devices`;--> statement-breakpoint
DROP TABLE `fido_devices`;--> statement-breakpoint
ALTER TABLE `__new_fido_devices` RENAME TO `fido_devices`;--> statement-breakpoint
PRAGMA foreign_keys=ON;