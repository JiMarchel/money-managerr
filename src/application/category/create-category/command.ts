import { UserId } from "../../../domain/user/value-objects/user-id";

export interface CreateCategoryCommand {
    userId: UserId;
    name: string;
    type: string;
}
