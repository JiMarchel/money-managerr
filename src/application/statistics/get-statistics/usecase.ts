import { StatisticsRepository } from "../../../domain/statistics/repository";
import { GetStatisticsQuery } from "./query";
import { StatisticsData } from "../../../domain/statistics/types";

export class GetStatisticsUseCase {
    constructor(private readonly statisticsRepository: StatisticsRepository) {}

    async execute(query: GetStatisticsQuery): Promise<StatisticsData> {
        return this.statisticsRepository.getStatistics(query.userId, query.startDate, query.endDate);
    }
}
