CREATE TABLE "address" (
	"id" serial PRIMARY KEY NOT NULL,
	"street" varchar(255),
	"city" varchar(100),
	"state_id" integer,
	"country_id" integer,
	"postal_code" varchar(20),
	"address_type_id" integer,
	"person_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(100),
	"updated_by" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "address_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(100),
	"updated_by" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "contact" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"gender_id" integer,
	"profile_picture_url" text,
	"date_of_birth" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(100),
	"updated_by" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "country" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(10) NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(100),
	"updated_by" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "gender" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(10) NOT NULL,
	"name" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(100),
	"updated_by" varchar(100)
);
--> statement-breakpoint
CREATE TABLE "state" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"country_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(100),
	"updated_by" varchar(100)
);
--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_state_id_state_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."state"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_country_id_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."country"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_address_type_id_address_type_id_fk" FOREIGN KEY ("address_type_id") REFERENCES "public"."address_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_person_id_contact_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."contact"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact" ADD CONSTRAINT "contact_gender_id_gender_id_fk" FOREIGN KEY ("gender_id") REFERENCES "public"."gender"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "state" ADD CONSTRAINT "state_country_id_country_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."country"("id") ON DELETE no action ON UPDATE no action;