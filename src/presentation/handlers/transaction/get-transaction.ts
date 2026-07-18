import { GetTransactionUseCase } from "../../../application/transaction/get-transaction/usecase";
import { UserId } from "../../../domain/user/value-objects/user-id";
import { TransactionError } from "../../../domain/transaction/error";
import { ApiSuccessResponse } from "../../types/response";

export class GetTransactionHandler {
    constructor(private readonly getTransactionUseCase: GetTransactionUseCase) {}

    async handle(userId: UserId, transactionId: string, set: any): Promise<ApiSuccessResponse<any> | { status: string; message: string }> {
        try {
            const query = {
                userId,
                transactionId
            };

            const result = await this.getTransactionUseCase.execute(query);
            
            return {
                message: "Successfully retrieved transaction",
                data: result
            };
        } catch (error) {
            if (error instanceof TransactionError) {
                set.status = 404;
                return {
                    status: "error",
                    message: error.message
                };
            }
            throw error;
        }
    }
}
