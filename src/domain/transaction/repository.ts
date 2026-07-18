import { UserId } from "../user/value-objects/user-id";
import { Transaction } from "./entity";

import { TransactionId } from "./value-objects/transaction-id";

export interface TransactionFilters {
    startDate?: Date;
    endDate?: Date;
}

export interface TransactionRepository {
    findById(id: TransactionId): Promise<Transaction | null>;
    findByUserId(userId: UserId, filters?: TransactionFilters): Promise<Transaction[]>;
    save(transaction: Transaction): Promise<void>;
    update(oldTransaction: Transaction, newTransaction: Transaction): Promise<void>;
    delete(transaction: Transaction): Promise<void>;
}
