import { sql } from "drizzle-orm";
import { char, check, date, index, numeric, pgEnum, pgTable, text, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid().primaryKey().default(sql`uuidv7()`),
    email: varchar({ length: 255 }).notNull().unique(),
    username: varchar({ length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
})

export const refreshToken = pgTable("refresh_token", {
    id: uuid().primaryKey().default(sql`uuidv7()`),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull().unique(),
    deviceName: text("device_name").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    revokedAt: timestamp("revoked_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    lastUsedAt: timestamp("last_used_at")
}, (table) => [
    index("refresh_token_user_id_idx").on(table.userId)
])

export const accountType = pgEnum("account_type", ["Cash", "Bank", "Credit Card", "Savings", "Investment", "E-Wallet", "Crypto", "Loan"])

export const accounts = pgTable("accounts", {
    id: uuid().primaryKey().default(sql`uuidv7()`),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: text().notNull(),
    accountType: accountType("account_type").notNull(),
    currency: char({ length: 3 }).notNull(),
    balanceCache: numeric("balance_cache", { precision: 36, scale: 18 }).notNull().default("0"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
}, (table) => [
    unique("uq_account_name").on(table.userId, table.name),
    index("idx_accounts_user_id").on(table.userId)
])

export const cateegoryType = pgEnum("category_type", ["Income", "Expense", "Transfer"])

export const categories = pgTable("categories", {
    id: uuid().primaryKey().default(sql`uuidv7()`),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    name: text().notNull(),
}, (table) => [unique("uq_category_name").on(table.userId, table.name), index("idx_categories_user_id").on(table.userId)])

export const transactions = pgTable("transactions", {
    id: uuid().primaryKey().default(sql`uuidv7()`),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    description: text().notNull(),
    transactionDate: date("transaction_date", { mode: "date" }).notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
}, (table) => [index("idx_transactions_user_id").on(table.userId), index("idx_transactions_date").on(table.transactionDate)])

export const directionType = pgEnum("direction_type", ["IN", "OUT"])

export const transactionEntries = pgTable("transaction_entries", {
    id: uuid().primaryKey().default(sql`uuidv7()`),
    transactionId: uuid("transaction_id").notNull().references(() => transactions.id, { onDelete: "cascade" }),
    accountId: uuid("account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    amount: numeric({ precision: 36, scale: 18 }).notNull(),
    direction: directionType("direction").notNull()
}, (table) => [
    index("idx_transaction_entries_transaction_id").on(table.transactionId),
    index("idx_transaction_entries_account_id").on(table.accountId),
    index("idx_transaction_entries_category_id").on(table.categoryId),
    check("chk_transaction_entries_amount", sql`${table.amount} > 0`)
])