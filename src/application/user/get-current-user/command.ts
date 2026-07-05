import { UserId } from "../../../domain/user/value-objects/user-id";

export interface GetCurrentUserCommand {
    userId: UserId;
}
