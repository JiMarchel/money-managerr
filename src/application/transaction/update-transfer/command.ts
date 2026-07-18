import { UserId } from "../../../domain/user/value-objects/user-id";

export interface UpdateTransferCommand {
    userId: UserId;
    transactionId: string;
    sourceAccountId: string;
    destinationAccountId: string;
    amount: number;
    description: string;
    date: string | Date;
}
