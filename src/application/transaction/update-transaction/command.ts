import { UserId } from "../../../domain/user/value-objects/user-id";

export interface UpdateTransactionCommand {
    userId: UserId;
    transactionId: string;
    accountId: string;
    categoryId: string;
    amount: number;
    direction: "IN" | "OUT";
    description: string;
    date: string | Date;
}
