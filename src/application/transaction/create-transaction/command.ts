import { UserId } from "../../../domain/user/value-objects/user-id";

export interface CreateTransactionCommand {
    userId: UserId;
    accountId: string;
    categoryId: string;
    amount: number;
    direction: "IN" | "OUT";
    description: string;
    date: string | Date;
}
