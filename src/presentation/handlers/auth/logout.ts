import { LogoutUseCase } from "../../../application/auth/logout/usecase";
import { LogoutRequest } from "../../dto/auth/logout";
import { ApiSuccessResponse } from "../../types/response";

export class LogoutHandler {
    constructor(private readonly logoutUseCase: LogoutUseCase) { }

    async handle(body: LogoutRequest): Promise<ApiSuccessResponse<void>> {
        await this.logoutUseCase.execute(body)

        return {
            message: "User logout successfully."
        };
    }
}