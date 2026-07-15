import { GetWalletsUseCase } from "../../../application/wallet/get-wallets/usecase";
import { UserId } from "../../../domain/user/value-objects/user-id";
import { ApiSuccessResponse } from "../../types/response";

export class GetWalletsHandler {
    constructor(private readonly getWalletsUseCase: GetWalletsUseCase) {}

    async handle(userId: UserId): Promise<ApiSuccessResponse<any>> {
        const query = {
            userId
        };

        const result = await this.getWalletsUseCase.execute(query);
        
        return {
            message: "Successfully retrieved wallets",
            data: result
        };
    }
}
