import { CreateTransferUseCase } from "../../../application/transaction/create-transfer/usecase";
import { CreateTransferDtoType } from "../../dto/transaction/create-transfer";
import { UserId } from "../../../domain/user/value-objects/user-id";
import { TransactionError } from "../../../domain/transaction/error";
import { ValidationError } from "../../../shared/errors/validation-error";
import { ApiSuccessResponse } from "../../types/response";

export class CreateTransferHandler {
    constructor(private readonly createTransferUseCase: CreateTransferUseCase) {}

    async handle(userId: UserId, body: CreateTransferDtoType, set: any): Promise<ApiSuccessResponse<any> | { status: string; message: string }> {
        try {
            const command = {
                userId,
                ...body
            };

            const result = await this.createTransferUseCase.execute(command);
            
            set.status = 201;
            return {
                message: "Successfully created transfer",
                data: result
            };
        } catch (error) {
            if (error instanceof TransactionError || error instanceof ValidationError) {
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
