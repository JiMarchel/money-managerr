import { UserId } from "../../../domain/user/value-objects/user-id";

export interface GetTransactionsQuery {
    userId: UserId;
}
