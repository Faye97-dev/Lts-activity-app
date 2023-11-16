ALTER TABLE "timeline" ADD COLUMN "cumulative_total_created" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "timeline" DROP COLUMN IF EXISTS "total_target";