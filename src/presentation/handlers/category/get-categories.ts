import { GetCategoriesUseCase } from "../../../application/category/get-categories/usecase";
import { UserId } from "../../../domain/user/value-objects/user-id";
import { ApiSuccessResponse } from "../../types/response";

export class GetCategoriesHandler {
    constructor(private readonly getCategoriesUseCase: GetCategoriesUseCase) {}

    async handle(userId: UserId): Promise<ApiSuccessResponse<any>> {
        const query = {
            userId
        };

        const result = await this.getCategoriesUseCase.execute(query);
        
        return {
            message: "Successfully retrieved categories",
            data: result
        };
    }
}
