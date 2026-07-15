import { CreateWalletUseCase } from "../../../application/wallet/create-wallet/usecase";
import { CreateWalletDtoType } from "../../dto/wallet/create-wallet";
import { UserId } from "../../../domain/user/value-objects/user-id";
import { DuplicateWalletError, WalletError } from "../../../domain/wallet/error";
import { ValidationError } from "../../../shared/errors/validation-error";
import { ApiSuccessResponse } from "../../types/response";

export class CreateWalletHandler {
    constructor(private readonly createWalletUseCase: CreateWalletUseCase) {}

    async handle(userId: UserId, body: CreateWalletDtoType, set: any): Promise<ApiSuccessResponse<any> | { status: string; message: string }> {
        try {
            const command = {
                userId,
                name: body.name,
                accountType: body.accountType,
                currency: body.currency
            };

            const result = await this.createWalletUseCase.execute(command);
            
            set.status = 201;
            return {
                message: "Successfully created wallet",
                data: result
            };
        } catch (error) {
            if (error instanceof DuplicateWalletError) {
                set.status = 409;
                return {
                    status: "error",
                    message: error.message
                };
            }
            if (error instanceof WalletError || error instanceof ValidationError) {
                set.status = 400;
                return {
                    status: "error",
                    message: error.message
                };
            }
            
            throw error;
        }
    }
}
