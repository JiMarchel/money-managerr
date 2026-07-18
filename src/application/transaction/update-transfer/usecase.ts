import { TransactionRepository } from "../../../domain/transaction/repository";
import { UpdateTransferCommand } from "./command";
import { Transaction } from "../../../domain/transaction/entity";
import { TransactionId } from "../../../domain/transaction/value-objects/transaction-id";
import { WalletId } from "../../../domain/wallet/value-objects/wallet-id";
import { Amount } from "../../../domain/transaction/value-objects/amount";
import { Description } from "../../../domain/transaction/value-objects/description";
import { TransactionDate } from "../../../domain/transaction/value-objects/transaction-date";
import { TransactionError } from "../../../domain/transaction/error";

export class UpdateTransferUseCase {
    constructor(private readonly transactionRepository: TransactionRepository) {}

    async execute(command: UpdateTransferCommand) {
        if (command.sourceAccountId === command.destinationAccountId) {
            throw new TransactionError("Source and destination accounts must be different");
        }

        const transactionId = TransactionId.create(command.transactionId);
        
        const oldTransaction = await this.transactionRepository.findById(transactionId);
        if (!oldTransaction) {
            throw new TransactionError("Transaction not found");
        }

        if (oldTransaction.userId.toString() !== command.userId.toString()) {
            throw new TransactionError("Unauthorized to update this transaction");
        }

        const sourceAccountId = WalletId.create(command.sourceAccountId);
        const destinationAccountId = WalletId.create(command.destinationAccountId);
        const amount = Amount.create(command.amount);
        const description = Description.create(command.description);
        const date = TransactionDate.create(command.date);

        const newTransaction = Transaction.updateTransfer(
            transactionId,
            command.userId,
            sourceAccountId,
            destinationAccountId,
            amount,
            description,
            date
        );

        await this.transactionRepository.update(oldTransaction, newTransaction);

        return {
            id: newTransaction.id.toString(),
            description: newTransaction.description.toString(),
            date: newTransaction.date.toISOString(),
            amount: amount.toNumber(),
            sourceAccountId: sourceAccountId.toString(),
            destinationAccountId: destinationAccountId.toString()
        };
    }
}
