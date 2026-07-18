import { UpdateTransactionUseCase } from "../../../application/transaction/update-transaction/usecase";
import { UpdateTransactionDtoType } from "../../dto/transaction/update-transaction";
import { UserId } from "../../../domain/user/value-objects/user-id";
import { TransactionError } from "../../../domain/transaction/error";
import { ValidationError } from "../../../shared/errors/validation-error";
import { ApiSuccessResponse } from "../../types/response";

export class UpdateTransactionHandler {
    constructor(private readonly updateTransactionUseCase: UpdateTransactionUseCase) {}

    async handle(userId: UserId, transactionId: string, body: UpdateTransactionDtoType, set: any): Promise<ApiSuccessResponse<any> | { status: string; message: string }> {
        try {
            const command = {
                userId,
                transactionId,
                ...body
            };

            const result = await this.updateTransactionUseCase.execute(command);
            
            return {
                message: "Successfully updated transaction",
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
