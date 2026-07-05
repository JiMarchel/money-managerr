import { RefreshUseCase } from "../../../application/auth/refresh/usecase";
import { RefreshRequest, RefreshResponse } from "../../dto/auth/refresh";
import { ApiSuccessResponse } from "../../types/response";

export class RefreshHandler {
    constructor(private readonly refreshUseCase: RefreshUseCase) { }

    async handle(body: RefreshRequest): Promise<ApiSuccessResponse<RefreshResponse>> {
        const tokens = await this.refreshUseCase.execute({
            refreshToken: body.refreshToken,
            deviceName: body.deviceName
        });

        return {
            message: "Token refreshed successfully",
            data: tokens
        };
    }
}
