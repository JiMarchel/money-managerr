export interface StatisticsSummary {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
}

export interface CategoryStatistic {
    categoryId: string;
    categoryName: string;
    totalAmount: number;
    percentage: number;
}

export interface StatisticsData {
    summary: StatisticsSummary;
    expenseByCategory: CategoryStatistic[];
    incomeByCategory: CategoryStatistic[];
}
