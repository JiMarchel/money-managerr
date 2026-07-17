import { TransactionRepository } from "../../../domain/transaction/repository";
import { GetTransactionsQuery } from "./query";

export class GetTransactionsUseCase {
    constructor(private readonly transactionRepository: TransactionRepository) {}

    async execute(query: GetTransactionsQuery) {
        const transactions = await this.transactionRepository.findByUserId(query.userId);

        return transactions.map(transaction => ({
            id: transaction.id.toString(),
            description: transaction.description.toString(),
            date: transaction.date.toISOString(),
            entries: transaction.entries.map(entry => ({
                id: entry.id.toString(),
                accountId: entry.accountId.toString(),
                categoryId: entry.categoryId ? entry.categoryId.toString() : null,
                amount: entry.amount.toNumber(),
                direction: entry.direction.toString()
            }))
        }));
    }
}
