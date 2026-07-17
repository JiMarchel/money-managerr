import { GetTransactionsUseCase } from "../../../application/transaction/get-transactions/usecase";
import { UserId } from "../../../domain/user/value-objects/user-id";
import { ApiSuccessResponse } from "../../types/response";

export class GetTransactionsHandler {
    constructor(private readonly getTransactionsUseCase: GetTransactionsUseCase) {}

    async handle(userId: UserId): Promise<ApiSuccessResponse<any>> {
        const query = {
            userId
        };

        const result = await this.getTransactionsUseCase.execute(query);
        
        return {
            message: "Successfully retrieved transactions",
            data: result
        };
    }
}
