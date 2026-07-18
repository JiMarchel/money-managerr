import { UserId } from "../../../domain/user/value-objects/user-id";
import { TransactionId } from "../../../domain/transaction/value-objects/transaction-id";

export interface DeleteTransactionCommand {
    userId: UserId;
    transactionId: string;
}
