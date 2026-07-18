import { desc, eq, inArray, sql, and, gte, lte } from "drizzle-orm";
import { TransactionFilters, TransactionRepository } from "../../domain/transaction/repository";
import { Transaction, TransactionEntry } from "../../domain/transaction/entity";
import { UserId } from "../../domain/user/value-objects/user-id";
import { Database } from "../database/db";
import { accounts, transactionEntries, transactions } from "../database/schema";
import { DatabaseError } from "./error";
import { TransactionId } from "../../domain/transaction/value-objects/transaction-id";
import { EntryId } from "../../domain/transaction/value-objects/entry-id";
import { WalletId } from "../../domain/wallet/value-objects/wallet-id";
import { CategoryId } from "../../domain/category/value-objects/category-id";
import { Amount } from "../../domain/transaction/value-objects/amount";
import { Direction, DirectionEnum } from "../../domain/transaction/value-objects/direction";
import { Description } from "../../domain/transaction/value-objects/description";
import { TransactionDate } from "../../domain/transaction/value-objects/transaction-date";

export class DrizzleTransactionRepository implements TransactionRepository {
    constructor(private readonly db: Database) { }

    async findById(id: TransactionId): Promise<Transaction | null> {
        try {
            const txsResult = await this.db.select()
                .from(transactions)
                .where(eq(transactions.id, id.toString()))
                .limit(1);

            if (txsResult.length === 0) return null;
            const txRow = txsResult[0];

            const entriesResult = await this.db.select()
                .from(transactionEntries)
                .where(eq(transactionEntries.transactionId, id.toString()));

            const txEntries = entriesResult.map(e => TransactionEntry.load(
                EntryId.create(e.id),
                TransactionId.create(e.transactionId),
                WalletId.create(e.accountId),
                e.categoryId ? CategoryId.create(e.categoryId) : null,
                Amount.create(e.amount),
                Direction.create(e.direction)
            ));

            return Transaction.load(
                TransactionId.create(txRow.id),
                UserId.create(txRow.userId),
                Description.create(txRow.description),
                TransactionDate.create(txRow.transactionDate),
                txEntries
            );
        } catch (error) {
            throw new DatabaseError("Failed to find transaction by id", error);
        }
    }

    async findByUserId(userId: UserId, filters?: TransactionFilters): Promise<Transaction[]> {
        try {
            const conditions = [eq(transactions.userId, userId.toString())];
            
            if (filters?.startDate) {
                conditions.push(gte(transactions.transactionDate, filters.startDate));
            }
            if (filters?.endDate) {
                conditions.push(lte(transactions.transactionDate, filters.endDate));
            }

            const txsResult = await this.db.select()
                .from(transactions)
                .where(and(...conditions))
                .orderBy(desc(transactions.transactionDate), desc(transactions.createdAt));

            if (txsResult.length === 0) return [];

            const txIds = txsResult.map(tx => tx.id);
            const entriesResult = await this.db.select()
                .from(transactionEntries)
                .where(inArray(transactionEntries.transactionId, txIds));

            return txsResult.map(txRow => {
                const txEntries = entriesResult
                    .filter(e => e.transactionId === txRow.id)
                    .map(e => TransactionEntry.load(
                        EntryId.create(e.id),
                        TransactionId.create(e.transactionId),
                        WalletId.create(e.accountId),
                        e.categoryId ? CategoryId.create(e.categoryId) : null,
                        Amount.create(e.amount),
                        Direction.create(e.direction)
                    ));

                return Transaction.load(
                    TransactionId.create(txRow.id),
                    UserId.create(txRow.userId),
                    Description.create(txRow.description),
                    TransactionDate.create(txRow.transactionDate),
                    txEntries
                );
            });
        } catch (error) {
            throw new DatabaseError("Failed to query transactions by user id", error);
        }
    }

    async save(transaction: Transaction): Promise<void> {
        try {
            await this.db.transaction(async (tx) => {
                // 1. Insert Transaction
                await tx.insert(transactions).values({
                    id: transaction.id.toString(),
                    userId: transaction.userId.toString(),
                    description: transaction.description.toString(),
                    transactionDate: transaction.date.toDate(),
                });

                // 2. Insert Entries and Update Balances
                for (const entry of transaction.entries) {
                    await tx.insert(transactionEntries).values({
                        id: entry.id.toString(),
                        transactionId: entry.transactionId.toString(),
                        accountId: entry.accountId.toString(),
                        categoryId: entry.categoryId ? entry.categoryId.toString() : null,
                        amount: entry.amount.toString(),
                        direction: entry.direction.toString() as DirectionEnum,
                    });

                    // 3. Update account balance
                    const amountToChange = entry.amount.toNumber();
                    if (entry.direction.toString() === "IN") {
                        await tx.update(accounts)
                            .set({ balanceCache: sql`${accounts.balanceCache} + ${amountToChange}` })
                            .where(eq(accounts.id, entry.accountId.toString()));
                    } else {
                        await tx.update(accounts)
                            .set({ balanceCache: sql`${accounts.balanceCache} - ${amountToChange}` })
                            .where(eq(accounts.id, entry.accountId.toString()));
                    }
                }
            });
        } catch (error) {
            throw new DatabaseError("Failed to save transaction and entries", error);
        }
    }

    async delete(transaction: Transaction): Promise<void> {
        try {
            await this.db.transaction(async (tx) => {
                // Revert balances
                for (const entry of transaction.entries) {
                    const balanceImpact = entry.direction.toString() === "IN" ? -entry.amount.toNumber() : entry.amount.toNumber();

                    if (balanceImpact > 0) {
                        await tx.update(accounts)
                            .set({ balanceCache: sql`${accounts.balanceCache} + ${balanceImpact}` })
                            .where(eq(accounts.id, entry.accountId.toString()));
                    } else if (balanceImpact < 0) {
                        await tx.update(accounts)
                            .set({ balanceCache: sql`${accounts.balanceCache} - ${Math.abs(balanceImpact)}` })
                            .where(eq(accounts.id, entry.accountId.toString()));
                    }
                }

                // Delete entries
                await tx.delete(transactionEntries)
                    .where(eq(transactionEntries.transactionId, transaction.id.toString()));

                // Delete transaction
                await tx.delete(transactions)
                    .where(eq(transactions.id, transaction.id.toString()));
            });
        } catch (error) {
            throw new DatabaseError("Failed to delete transaction", error);
        }
    }

    async update(oldTransaction: Transaction, newTransaction: Transaction): Promise<void> {
        try {
            await this.db.transaction(async (tx) => {
                // 1. Revert old balances
                for (const entry of oldTransaction.entries) {
                    const balanceImpact = entry.direction.toString() === "IN" ? -entry.amount.toNumber() : entry.amount.toNumber();

                    if (balanceImpact > 0) {
                        await tx.update(accounts)
                            .set({ balanceCache: sql`${accounts.balanceCache} + ${balanceImpact}` })
                            .where(eq(accounts.id, entry.accountId.toString()));
                    } else if (balanceImpact < 0) {
                        await tx.update(accounts)
                            .set({ balanceCache: sql`${accounts.balanceCache} - ${Math.abs(balanceImpact)}` })
                            .where(eq(accounts.id, entry.accountId.toString()));
                    }
                }

                // 2. Delete old entries
                await tx.delete(transactionEntries)
                    .where(eq(transactionEntries.transactionId, oldTransaction.id.toString()));

                // 3. Update transaction record
                await tx.update(transactions)
                    .set({
                        description: newTransaction.description.toString(),
                        transactionDate: newTransaction.date.toDate(),
                    })
                    .where(eq(transactions.id, newTransaction.id.toString()));

                // 4. Insert new entries & apply new balances
                for (const entry of newTransaction.entries) {
                    await tx.insert(transactionEntries).values({
                        id: entry.id.toString(),
                        transactionId: entry.transactionId.toString(),
                        accountId: entry.accountId.toString(),
                        categoryId: entry.categoryId ? entry.categoryId.toString() : null,
                        amount: entry.amount.toString(),
                        direction: entry.direction.toString() as DirectionEnum,
                    });

                    const amountToChange = entry.amount.toNumber();
                    if (entry.direction.toString() === "IN") {
                        await tx.update(accounts)
                            .set({ balanceCache: sql`${accounts.balanceCache} + ${amountToChange}` })
                            .where(eq(accounts.id, entry.accountId.toString()));
                    } else {
                        await tx.update(accounts)
                            .set({ balanceCache: sql`${accounts.balanceCache} - ${amountToChange}` })
                            .where(eq(accounts.id, entry.accountId.toString()));
                    }
                }
            });
        } catch (error) {
            throw new DatabaseError("Failed to update transaction", error);
        }
    }
}
