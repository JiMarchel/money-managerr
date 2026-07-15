import { UserId } from "../../../domain/user/value-objects/user-id";

export interface CreateWalletCommand {
    userId: UserId;
    name: string;
    accountType: string;
    currency: string;
}
