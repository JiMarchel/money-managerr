import { UserId } from "../user/value-objects/user-id";
import { StatisticsData } from "./types";

export interface StatisticsRepository {
    getStatistics(userId: UserId, startDate?: Date, endDate?: Date): Promise<StatisticsData>;
}
