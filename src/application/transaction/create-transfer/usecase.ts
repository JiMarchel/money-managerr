import { TransactionRepository } from "../../../domain/transaction/repository";
import { CreateTransferCommand } from "./command";
import { Transaction } from "../../../domain/transaction/entity";
import { WalletId } from "../../../domain/wallet/value-objects/wallet-id";
import { Amount } from "../../../domain/transaction/value-objects/amount";
import { Description } from "../../../domain/transaction/value-objects/description";
import { TransactionDate } from "../../../domain/transaction/value-objects/transaction-date";
import { TransactionError } from "../../../domain/transaction/error";

export class CreateTransferUseCase {
    constructor(private readonly transactionRepository: TransactionRepository) {}

    async execute(command: CreateTransferCommand) {
        if (command.sourceAccountId === command.destinationAccountId) {
            throw new TransactionError("Source and destination accounts must be different");
        }

        const sourceAccountId = WalletId.create(command.sourceAccountId);
        const destinationAccountId = WalletId.create(command.destinationAccountId);
        const amount = Amount.create(command.amount);
        const description = Description.create(command.description);
        const date = TransactionDate.create(command.date);

        const transaction = Transaction.createTransfer(
            command.userId,
            sourceAccountId,
            destinationAccountId,
            amount,
            description,
            date
        );

        await this.transactionRepository.save(transaction);

        return {
            id: transaction.id.toString(),
            description: transaction.description.toString(),
            date: transaction.date.toISOString(),
            amount: amount.toNumber(),
            sourceAccountId: sourceAccountId.toString(),
            destinationAccountId: destinationAccountId.toString()
        };
    }
}
