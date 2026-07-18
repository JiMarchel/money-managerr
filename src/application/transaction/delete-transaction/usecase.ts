import { TransactionRepository } from "../../../domain/transaction/repository";
import { DeleteTransactionCommand } from "./command";
import { TransactionId } from "../../../domain/transaction/value-objects/transaction-id";
import { TransactionError } from "../../../domain/transaction/error";

export class DeleteTransactionUseCase {
    constructor(private readonly transactionRepository: TransactionRepository) {}

    async execute(command: DeleteTransactionCommand) {
        const transactionId = TransactionId.create(command.transactionId);
        
        const transaction = await this.transactionRepository.findById(transactionId);
        if (!transaction) {
            throw new TransactionError("Transaction not found");
        }

        if (transaction.userId.toString() !== command.userId.toString()) {
            throw new TransactionError("Unauthorized to delete this transaction");
        }

        await this.transactionRepository.delete(transaction);
    }
}
