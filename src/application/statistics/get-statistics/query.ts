import { UserId } from "../../../domain/user/value-objects/user-id";

export interface GetStatisticsQuery {
    userId: UserId;
    startDate?: Date;
    endDate?: Date;
}
