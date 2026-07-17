import { UserId } from "../../../domain/user/value-objects/user-id";

export interface CreateTransferCommand {
    userId: UserId;
    sourceAccountId: string;
    destinationAccountId: string;
    amount: number;
    description: string;
    date: string | Date;
}
