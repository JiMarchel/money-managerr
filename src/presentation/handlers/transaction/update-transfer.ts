import { UpdateTransferUseCase } from "../../../application/transaction/update-transfer/usecase";
import { UpdateTransferDtoType } from "../../dto/transaction/update-transfer";
import { UserId } from "../../../domain/user/value-objects/user-id";
import { TransactionError } from "../../../domain/transaction/error";
import { ValidationError } from "../../../shared/errors/validation-error";
import { ApiSuccessResponse } from "../../types/response";

export class UpdateTransferHandler {
    constructor(private readonly updateTransferUseCase: UpdateTransferUseCase) {}

    async handle(userId: UserId, transactionId: string, body: UpdateTransferDtoType, set: any): Promise<ApiSuccessResponse<any> | { status: string; message: string }> {
        try {
            const command = {
                userId,
                transactionId,
                ...body
            };

            const result = await this.updateTransferUseCase.execute(command);
            
            return {
                message: "Successfully updated transfer",
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
