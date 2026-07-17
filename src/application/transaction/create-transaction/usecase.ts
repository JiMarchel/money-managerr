import { TransactionRepository } from "../../../domain/transaction/repository";
import { CreateTransactionCommand } from "./command";
import { Transaction } from "../../../domain/transaction/entity";
import { WalletId } from "../../../domain/wallet/value-objects/wallet-id";
import { CategoryId } from "../../../domain/category/value-objects/category-id";
import { Amount } from "../../../domain/transaction/value-objects/amount";
import { Direction } from "../../../domain/transaction/value-objects/direction";
import { Description } from "../../../domain/transaction/value-objects/description";
import { TransactionDate } from "../../../domain/transaction/value-objects/transaction-date";

export class CreateTransactionUseCase {
    constructor(private readonly transactionRepository: TransactionRepository) {}

    async execute(command: CreateTransactionCommand) {
        const accountId = WalletId.create(command.accountId);
        const categoryId = CategoryId.create(command.categoryId);
        const amount = Amount.create(command.amount);
        const direction = Direction.create(command.direction);
        const description = Description.create(command.description);
        const date = TransactionDate.create(command.date);

        const transaction = Transaction.createIncomeOrExpense(
            command.userId,
            accountId,
            categoryId,
            amount,
            direction,
            description,
            date
        );

        await this.transactionRepository.save(transaction);

        return {
            id: transaction.id.toString(),
            description: transaction.description.toString(),
            date: transaction.date.toISOString(),
            amount: amount.toNumber(),
            direction: direction.toString(),
            accountId: accountId.toString(),
            categoryId: categoryId.toString()
        };
    }
}
