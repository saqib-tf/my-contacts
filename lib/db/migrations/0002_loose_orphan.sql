ALTER TABLE "tenant" ADD CONSTRAINT "tenant_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");