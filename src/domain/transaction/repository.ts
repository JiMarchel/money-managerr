import { UserId } from "../user/value-objects/user-id";
import { Transaction } from "./entity";

export interface TransactionFilters {
    startDate?: Date;
    endDate?: Date;
}

export interface TransactionRepository {
    findByUserId(userId: UserId, filters?: TransactionFilters): Promise<Transaction[]>;
    save(transaction: Transaction): Promise<void>;
}
