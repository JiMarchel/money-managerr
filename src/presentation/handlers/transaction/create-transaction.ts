import { CreateTransactionUseCase } from "../../../application/transaction/create-transaction/usecase";
import { CreateTransactionDtoType } from "../../dto/transaction/create-transaction";
import { UserId } from "../../../domain/user/value-objects/user-id";
import { TransactionError } from "../../../domain/transaction/error";
import { ValidationError } from "../../../shared/errors/validation-error";
import { ApiSuccessResponse } from "../../types/response";

export class CreateTransactionHandler {
    constructor(private readonly createTransactionUseCase: CreateTransactionUseCase) {}

    async handle(userId: UserId, body: CreateTransactionDtoType, set: any): Promise<ApiSuccessResponse<any> | { status: string; message: string }> {
        try {
            const command = {
                userId,
                ...body
            };

            const result = await this.createTransactionUseCase.execute(command);
            
            set.status = 201;
            return {
                message: "Successfully created transaction",
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
