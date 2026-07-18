import { GetStatisticsUseCase } from "../../../application/statistics/get-statistics/usecase";
import { UserId } from "../../../domain/user/value-objects/user-id";
import { ApiSuccessResponse } from "../../types/response";

export class GetStatisticsHandler {
    constructor(private readonly getStatisticsUseCase: GetStatisticsUseCase) {}

    async handle(userId: UserId, startDateQuery?: string, endDateQuery?: string, set?: any): Promise<ApiSuccessResponse<any>> {
        const startDate = startDateQuery ? new Date(startDateQuery) : undefined;
        const endDate = endDateQuery ? new Date(endDateQuery) : undefined;

        const result = await this.getStatisticsUseCase.execute({
            userId,
            startDate,
            endDate
        });

        return {
            data: result
        };
    }
}
