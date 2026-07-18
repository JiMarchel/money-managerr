import { eq, and, gte, lte, sql } from "drizzle-orm";
import { StatisticsRepository } from "../../domain/statistics/repository";
import { StatisticsData, CategoryStatistic, StatisticsSummary } from "../../domain/statistics/types";
import { UserId } from "../../domain/user/value-objects/user-id";
import { Database } from "../database/db";
import { transactions, transactionEntries, categories } from "../database/schema";
import { DatabaseError } from "./error";

export class DrizzleStatisticsRepository implements StatisticsRepository {
    constructor(private readonly db: Database) {}

    async getStatistics(userId: UserId, startDate?: Date, endDate?: Date): Promise<StatisticsData> {
        try {
            // Build the date filter condition for transactions
            const dateConditions = [];
            if (startDate) dateConditions.push(gte(transactions.transactionDate, startDate));
            if (endDate) dateConditions.push(lte(transactions.transactionDate, endDate));

            const txCondition = and(
                eq(transactions.userId, userId.toString()),
                ...dateConditions
            );

            // Subquery: Get filtered transaction IDs
            const txSubquery = this.db.select({ id: transactions.id })
                .from(transactions)
                .where(txCondition);

            // Main query: Aggregate entries that belong to the filtered transactions
            const results = await this.db.select({
                categoryId: transactionEntries.categoryId,
                categoryName: categories.name,
                direction: transactionEntries.direction,
                totalAmount: sql<number>`SUM(CAST(${transactionEntries.amount} AS DECIMAL))`
            })
            .from(transactionEntries)
            .leftJoin(categories, eq(transactionEntries.categoryId, categories.id))
            .where(
                // In Drizzle, we can use `inArray` with a subquery, or join. 
                // Let's use an INNER JOIN for better performance and simplicity.
                sql`${transactionEntries.transactionId} IN (${txSubquery})`
            )
            .groupBy(transactionEntries.categoryId, categories.name, transactionEntries.direction);

            let totalIncome = 0;
            let totalExpense = 0;
            const expenseCategories: CategoryStatistic[] = [];
            const incomeCategories: CategoryStatistic[] = [];

            // 1. First pass: separate income and expense, calculate totals
            results.forEach(row => {
                const amount = Number(row.totalAmount) || 0;
                
                if (row.direction === "IN") {
                    totalIncome += amount;
                    if (row.categoryId && row.categoryName) {
                        incomeCategories.push({
                            categoryId: row.categoryId,
                            categoryName: row.categoryName,
                            totalAmount: amount,
                            percentage: 0 // Will be calculated next
                        });
                    }
                } else if (row.direction === "OUT") {
                    totalExpense += amount;
                    if (row.categoryId && row.categoryName) {
                        expenseCategories.push({
                            categoryId: row.categoryId,
                            categoryName: row.categoryName,
                            totalAmount: amount,
                            percentage: 0 // Will be calculated next
                        });
                    }
                }
            });

            // 2. Second pass: Calculate percentages
            const finalExpenseCategories = expenseCategories.map(cat => ({
                ...cat,
                percentage: totalExpense > 0 ? Number(((cat.totalAmount / totalExpense) * 100).toFixed(2)) : 0
            })).sort((a, b) => b.totalAmount - a.totalAmount); // Sort descending

            const finalIncomeCategories = incomeCategories.map(cat => ({
                ...cat,
                percentage: totalIncome > 0 ? Number(((cat.totalAmount / totalIncome) * 100).toFixed(2)) : 0
            })).sort((a, b) => b.totalAmount - a.totalAmount);

            const summary: StatisticsSummary = {
                totalIncome,
                totalExpense,
                netBalance: totalIncome - totalExpense
            };

            return {
                summary,
                expenseByCategory: finalExpenseCategories,
                incomeByCategory: finalIncomeCategories
            };
        } catch (error) {
            throw new DatabaseError("Failed to calculate statistics", error);
        }
    }
}
