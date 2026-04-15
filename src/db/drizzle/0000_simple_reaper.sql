CREATE TYPE "public"."format_enum" AS ENUM('PDF', 'DOCX');--> statement-breakpoint
CREATE TYPE "public"."account_type_enum" AS ENUM('EMPLOYER', 'JOB_SEEKER', 'FRESHER');--> statement-breakpoint
CREATE TYPE "public"."role_enum" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "ats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vulnerabilities" text NOT NULL,
	"suggestions" text NOT NULL,
	"score" text DEFAULT '0' NOT NULL,
	"cv_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cv" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"summary" text NOT NULL,
	"note" text NOT NULL,
	"format" "format_enum" DEFAULT 'PDF' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"descriptions" text NOT NULL,
	"ats_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"pfp" text DEFAULT 'https://cdn-icons-png.flaticon.com/512/149/149071.png' NOT NULL,
	"role" "role_enum" DEFAULT 'USER' NOT NULL,
	"account_type" "account_type_enum" DEFAULT 'FRESHER' NOT NULL,
	"position" text NOT NULL,
	"college" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "ats" ADD CONSTRAINT "ats_cv_id_cv_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."cv"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cv" ADD CONSTRAINT "cv_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_offers" ADD CONSTRAINT "job_offers_ats_id_ats_id_fk" FOREIGN KEY ("ats_id") REFERENCES "public"."ats"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_offers" ADD CONSTRAINT "job_offers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;