import { Elysia, t } from "elysia";
import { GetStatisticsHandler } from "../handlers/statistics/get-statistics";
import { TokenProvider } from "../../domain/auth/token-provider";
import { authGuard } from "../middleware/auth-guard";
import { UserId } from "../../domain/user/value-objects/user-id";

export const statisticsRoutes = (
    getStatisticsHandler: GetStatisticsHandler,
    tokenProvider: TokenProvider
) => new Elysia({ prefix: "/statistics" })
    .use(authGuard(tokenProvider))
    .get("/", async ({ userId, query: { startDate, endDate }, set }) => {
        return getStatisticsHandler.handle(userId, startDate, endDate, set);
    }, {
        query: t.Object({
            startDate: t.Optional(t.String({ format: "date", error: "Invalid startDate format" })),
            endDate: t.Optional(t.String({ format: "date", error: "Invalid endDate format" }))
        }),
        detail: {
            tags: ["Statistics"],
            summary: "Get pre-calculated financial summaries for a specific time period"
        }
    });
