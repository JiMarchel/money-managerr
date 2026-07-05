import { LoginUseCase } from "../../../application/auth/login/usecase";
import { LoginRequest, LoginResponse } from "../../dto/auth/login";
import { ApiSuccessResponse } from "../../types/response";

export class LoginHandler {
    constructor(private readonly loginUseCase: LoginUseCase) { }

    async handle(body: LoginRequest): Promise<ApiSuccessResponse<LoginResponse>> {
        const tokens = await this.loginUseCase.execute(body);

        return {
            message: "User logged in successfully",
            data: tokens
        };
    }
}
