CREATE TYPE "public"."account_type" AS ENUM('Cash', 'Bank', 'Credit Card', 'Savings', 'Investment', 'E-Wallet', 'Crypto', 'Loan');--> statement-breakpoint
CREATE TYPE "public"."category_type" AS ENUM('Income', 'Expense', 'Transfer');--> statement-breakpoint
CREATE TYPE "public"."direction_type" AS ENUM('IN', 'OUT');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"account_type" "account_type" NOT NULL,
	"currency" char(3) NOT NULL,
	"balance_cache" numeric(36, 18) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_account_name" UNIQUE("user_id","name")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "uq_category_name" UNIQUE("user_id","name")
);
--> statement-breakpoint
CREATE TABLE "refresh_token" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"device_name" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"revoked_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_used_at" timestamp,
	CONSTRAINT "refresh_token_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "transaction_entries" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"transaction_id" uuid NOT NULL,
	"account_id" uuid NOT NULL,
	"category_id" uuid,
	"amount" numeric(36, 18) NOT NULL,
	"direction" "direction_type" NOT NULL,
	CONSTRAINT "chk_transaction_entries_amount" CHECK ("transaction_entries"."amount" > 0)
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"description" text NOT NULL,
	"transaction_date" date DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_entries" ADD CONSTRAINT "transaction_entries_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_entries" ADD CONSTRAINT "transaction_entries_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_entries" ADD CONSTRAINT "transaction_entries_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_accounts_user_id" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_categories_user_id" ON "categories" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "refresh_token_user_id_idx" ON "refresh_token" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_transaction_entries_transaction_id" ON "transaction_entries" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "idx_transaction_entries_account_id" ON "transaction_entries" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "idx_transaction_entries_category_id" ON "transaction_entries" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_transactions_user_id" ON "transactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_transactions_date" ON "transactions" USING btree ("transaction_date");