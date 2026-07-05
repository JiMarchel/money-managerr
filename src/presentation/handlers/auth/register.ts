import { RegisterUseCase } from "../../../application/auth/register/usecase";
import { RegisterRequest } from "../../dto/auth/register";
import { ApiSuccessResponse } from "../../types/response";

export class RegisterHandler {
    constructor(private readonly registerUseCase: RegisterUseCase) { }

    async handle(body: RegisterRequest): Promise<ApiSuccessResponse> {
        await this.registerUseCase.execute({
            email: body.email,
            username: body.username,
            password: body.password
        });

        return {
            message: "User registered successfully"
        };
    }
}
