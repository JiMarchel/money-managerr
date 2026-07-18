import { UserId } from "../user/value-objects/user-id";
import { WalletId } from "../wallet/value-objects/wallet-id";
import { CategoryId } from "../category/value-objects/category-id";
import { TransactionId } from "./value-objects/transaction-id";
import { EntryId } from "./value-objects/entry-id";
import { Amount } from "./value-objects/amount";
import { Direction } from "./value-objects/direction";
import { Description } from "./value-objects/description";
import { TransactionDate } from "./value-objects/transaction-date";

export class TransactionEntry {
    private constructor(
        public readonly id: EntryId,
        public readonly transactionId: TransactionId,
        public readonly accountId: WalletId,
        public readonly categoryId: CategoryId | null,
        public readonly amount: Amount,
        public readonly direction: Direction
    ) {}

    static create(
        transactionId: TransactionId,
        accountId: WalletId,
        categoryId: CategoryId | null,
        amount: Amount,
        direction: Direction
    ): TransactionEntry {
        const entryId = EntryId.create(Bun.randomUUIDv7());
        return new TransactionEntry(
            entryId,
            transactionId,
            accountId,
            categoryId,
            amount,
            direction
        );
    }

    // Constructor mapping for DB hydration
    static load(
        id: EntryId,
        transactionId: TransactionId,
        accountId: WalletId,
        categoryId: CategoryId | null,
        amount: Amount,
        direction: Direction
    ): TransactionEntry {
        return new TransactionEntry(id, transactionId, accountId, categoryId, amount, direction);
    }
}

export class Transaction {
    private constructor(
        public readonly id: TransactionId,
        public readonly userId: UserId,
        public readonly description: Description,
        public readonly date: TransactionDate,
        public readonly entries: TransactionEntry[]
    ) {}

    static createIncomeOrExpense(
        userId: UserId,
        accountId: WalletId,
        categoryId: CategoryId,
        amount: Amount,
        direction: Direction,
        description: Description,
        date: TransactionDate
    ): Transaction {
        const transactionId = TransactionId.create(Bun.randomUUIDv7());
        const entry = TransactionEntry.create(
            transactionId,
            accountId,
            categoryId,
            amount,
            direction
        );
        return new Transaction(transactionId, userId, description, date, [entry]);
    }

    static createTransfer(
        userId: UserId,
        sourceAccountId: WalletId,
        destinationAccountId: WalletId,
        amount: Amount,
        description: Description,
        date: TransactionDate
    ): Transaction {
        const transactionId = TransactionId.create(Bun.randomUUIDv7());
        
        // OUT from source
        const sourceEntry = TransactionEntry.create(
            transactionId,
            sourceAccountId,
            null, // Category is null for transfer
            amount,
            Direction.create("OUT")
        );

        // IN to destination
        const destinationEntry = TransactionEntry.create(
            transactionId,
            destinationAccountId,
            null, // Category is null for transfer
            amount,
            Direction.create("IN")
        );

        return new Transaction(transactionId, userId, description, date, [sourceEntry, destinationEntry]);
    }

    static updateIncomeOrExpense(
        transactionId: TransactionId,
        userId: UserId,
        accountId: WalletId,
        categoryId: CategoryId,
        amount: Amount,
        direction: Direction,
        description: Description,
        date: TransactionDate
    ): Transaction {
        const entry = TransactionEntry.create(
            transactionId,
            accountId,
            categoryId,
            amount,
            direction
        );
        return new Transaction(transactionId, userId, description, date, [entry]);
    }

    static updateTransfer(
        transactionId: TransactionId,
        userId: UserId,
        sourceAccountId: WalletId,
        destinationAccountId: WalletId,
        amount: Amount,
        description: Description,
        date: TransactionDate
    ): Transaction {
        // OUT from source
        const sourceEntry = TransactionEntry.create(
            transactionId,
            sourceAccountId,
            null,
            amount,
            Direction.create("OUT")
        );

        // IN to destination
        const destinationEntry = TransactionEntry.create(
            transactionId,
            destinationAccountId,
            null,
            amount,
            Direction.create("IN")
        );

        return new Transaction(transactionId, userId, description, date, [sourceEntry, destinationEntry]);
    }

    // Constructor mapping for DB hydration
    static load(
        id: TransactionId,
        userId: UserId,
        description: Description,
        date: TransactionDate,
        entries: TransactionEntry[]
    ): Transaction {
        return new Transaction(id, userId, description, date, entries);
    }
}
