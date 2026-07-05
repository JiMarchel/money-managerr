import { GetCurrentUserUseCase } from "../../../application/user/get-current-user/usecase";
import { UserId } from "../../../domain/user/value-objects/user-id";
import { GetCurrentUserResponse } from "../../dto/user/get-current-user";
import { ApiSuccessResponse } from "../../types/response";

export class GetCurrentUserHandler {
    constructor(private readonly getCurrentUserUseCase: GetCurrentUserUseCase) { }

    async handle(userId: UserId): Promise<ApiSuccessResponse<GetCurrentUserResponse>> {
        const user = await this.getCurrentUserUseCase.execute({ userId });

        return {
            message: "Successfully retrieved current user",
            data: user
        };
    }
}
