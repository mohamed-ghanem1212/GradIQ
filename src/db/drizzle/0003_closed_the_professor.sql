ALTER TABLE "users" ADD COLUMN "provider" text DEFAULT 'local' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "providerId" text;