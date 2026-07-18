import { TransactionRepository } from "../../../domain/transaction/repository";
import { GetTransactionQuery } from "./query";
import { TransactionId } from "../../../domain/transaction/value-objects/transaction-id";
import { TransactionError } from "../../../domain/transaction/error";

export class GetTransactionUseCase {
    constructor(private readonly transactionRepository: TransactionRepository) {}

    async execute(query: GetTransactionQuery) {
        const transactionId = TransactionId.create(query.transactionId);
        
        const transaction = await this.transactionRepository.findById(transactionId);
        
        if (!transaction) {
            throw new TransactionError("Transaction not found");
        }

        if (transaction.userId.toString() !== query.userId.toString()) {
            throw new TransactionError("Unauthorized to view this transaction");
        }

        return {
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
        };
    }
}
