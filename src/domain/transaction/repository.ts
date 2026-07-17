import { UserId } from "../user/value-objects/user-id";
import { Transaction } from "./entity";

export interface TransactionRepository {
    findByUserId(userId: UserId): Promise<Transaction[]>;
    save(transaction: Transaction): Promise<void>;
}
