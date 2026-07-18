import { DeleteTransactionUseCase } from "../../../application/transaction/delete-transaction/usecase";
import { UserId } from "../../../domain/user/value-objects/user-id";
import { TransactionError } from "../../../domain/transaction/error";
import { ApiSuccessResponse } from "../../types/response";

export class DeleteTransactionHandler {
    constructor(private readonly deleteTransactionUseCase: DeleteTransactionUseCase) {}

    async handle(userId: UserId, transactionId: string, set: any): Promise<ApiSuccessResponse<any> | { status: string; message: string }> {
        try {
            const command = {
                userId,
                transactionId
            };

            await this.deleteTransactionUseCase.execute(command);
            
            return {
                message: "Successfully deleted transaction",
                data: null
            };
        } catch (error) {
            if (error instanceof TransactionError) {
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
