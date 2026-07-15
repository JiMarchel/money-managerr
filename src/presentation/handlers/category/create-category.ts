import { CreateCategoryUseCase } from "../../../application/category/create-category/usecase";
import { CreateCategoryDtoType } from "../../dto/category/create-category";
import { UserId } from "../../../domain/user/value-objects/user-id";
import { DuplicateCategoryError, CategoryError } from "../../../domain/category/error";
import { ValidationError } from "../../../shared/errors/validation-error";
import { ApiSuccessResponse } from "../../types/response";

export class CreateCategoryHandler {
    constructor(private readonly createCategoryUseCase: CreateCategoryUseCase) {}

    async handle(userId: UserId, body: CreateCategoryDtoType, set: any): Promise<ApiSuccessResponse<any> | { status: string; message: string }> {
        try {
            const command = {
                userId,
                name: body.name,
                type: body.type
            };

            const result = await this.createCategoryUseCase.execute(command);
            
            set.status = 201;
            return {
                message: "Successfully created category",
                data: result
            };
        } catch (error) {
            if (error instanceof DuplicateCategoryError) {
                set.status = 409;
                return {
                    status: "error",
                    message: error.message
                };
            }
            if (error instanceof CategoryError || error instanceof ValidationError) {
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
