import { TransactionRepository } from "../../../domain/transaction/repository";
import { UpdateTransactionCommand } from "./command";
import { Transaction } from "../../../domain/transaction/entity";
import { TransactionId } from "../../../domain/transaction/value-objects/transaction-id";
import { WalletId } from "../../../domain/wallet/value-objects/wallet-id";
import { CategoryId } from "../../../domain/category/value-objects/category-id";
import { Amount } from "../../../domain/transaction/value-objects/amount";
import { Direction } from "../../../domain/transaction/value-objects/direction";
import { Description } from "../../../domain/transaction/value-objects/description";
import { TransactionDate } from "../../../domain/transaction/value-objects/transaction-date";
import { TransactionError } from "../../../domain/transaction/error";

export class UpdateTransactionUseCase {
    constructor(private readonly transactionRepository: TransactionRepository) {}

    async execute(command: UpdateTransactionCommand) {
        const transactionId = TransactionId.create(command.transactionId);
        
        const oldTransaction = await this.transactionRepository.findById(transactionId);
        if (!oldTransaction) {
            throw new TransactionError("Transaction not found");
        }

        if (oldTransaction.userId.toString() !== command.userId.toString()) {
            throw new TransactionError("Unauthorized to update this transaction");
        }

        const accountId = WalletId.create(command.accountId);
        const categoryId = CategoryId.create(command.categoryId);
        const amount = Amount.create(command.amount);
        const direction = Direction.create(command.direction);
        const description = Description.create(command.description);
        const date = TransactionDate.create(command.date);

        const newTransaction = Transaction.updateIncomeOrExpense(
            transactionId,
            command.userId,
            accountId,
            categoryId,
            amount,
            direction,
            description,
            date
        );

        await this.transactionRepository.update(oldTransaction, newTransaction);

        return {
            id: newTransaction.id.toString(),
            description: newTransaction.description.toString(),
            date: newTransaction.date.toISOString(),
            amount: amount.toNumber(),
            direction: direction.toString(),
            accountId: accountId.toString(),
            categoryId: categoryId.toString()
        };
    }
}
