import { UserId } from "../../../domain/user/value-objects/user-id";

export interface GetTransactionQuery {
    userId: UserId;
    transactionId: string;
}
